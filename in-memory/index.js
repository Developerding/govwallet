"use strict";
const fs = require('fs');
const csv = require('csv-parser');
const { exit } = require('process');
const sqlite3 = require('sqlite3').verbose();
const grpc = require('@grpc/grpc-js');
const services = require('./proto/backend_grpc_pb');
const messages = require('./proto/backend_pb');

function fileExists(filepath) {
    try {
        fs.accessSync(filepath, fs.constants.F_OK);
        return true;
    }
    catch (err) {
        return false;
    }
}

const created_db = new sqlite3.Database(':memory:');
created_db.serialize(() => {
    created_db.run('CREATE TABLE created (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_name TEXT, created_at TEXT)');
});
// creating in memory database for redeemed data
const redeemed_db = new sqlite3.Database(':memory:');
redeemed_db.serialize(() => {
    redeemed_db.run('CREATE TABLE redeemed (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_name TEXT, redeemed_at TEXT)');
});

let server = new grpc.Server();

function processCSV() {
    return new Promise((resolve, reject) => {
        const filepath = './data/redeemed.csv';
    //parsing the csv file into the database
    fs.createReadStream('./data/staff-id-to-team-mapping.csv')
        .pipe(csv())
        .on('data', (row) => {
        // accessing the staff_pass_id variable
        var id = '';
        for (let i in row) {
            id = row[i];
            break;
        }
        created_db.run('INSERT INTO created (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)', [id, row.team_name,row.created_at]);
    })
        .on('end', () => {
        console.log('CSV file successfully processed');
            created_db.all("SELECT * FROM created", (err, rows) => {
        if (err) {
            console.error(err.message);
            exit(1);
        }
        else {
            console.log(rows);
        }
    });
    })
        .on('error', (error) => {
        console.error('Error:', error);
        reject();
    });
    // reading from the redeemed csv file if it exists
    if (fileExists(filepath)) {
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (row) => {
            redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row.staff_pass_id, row.team_name, row.redeemed_at]);
        })
            .on('end', () => {
            console.log('redeemed CSV file successfully processed');

        })
            .on('error', (error) => {
            console.error('Error:', error);
        });
    } else {
        fs.writeFile(filepath, 'staff_pass_id,team_name,redeemed_at', (err) => {
            if (err) {
            console.error(err.message);
            exit(1);
            }
            console.log('redeemed CSV file created successfully');
        });
    }
});
}
function getTeam(call, callback) {
    const staffId = call.request.getStaffPassId(); 
        let resp = new messages.GetTeamResponse();
        const query = "SELECT team_id FROM created WHERE staff_pass_id = '" + staffId + "'";
        created_db.all(query, (err, rows) => {
            if (err) {
                return callback({
                    code: grpc.status.UNAUTHENTICATED,
                    message: 'Staff ID not found'
                });
            } else {
                const teamName = rows[0].getTeamName();
                resp.setGtresp(teamName);
                callback(null, resp);
            }
        });
    };

function getGifts(call, callback) {
    const teamName = call.request.getTeamName();
        let resp = new messages.GetGiftsResponse();
        const query = "SELECT * FROM created WHERE team_name = '" + teamName + "'";
        created_db.all(query, (err, rows) => {
            if (err) {
                return callback({
                    code: grpc.status.UNAUTHENTICATED,
                    message: 'No available gifts for this team'
                });
            } else {;
                for (let i in rows) {
                    console.log(rows[i]);
                    let gift = new messages.Gift();
                    gift.setStaffPassId(rows[i]['staff_pass_id']);
                    gift.setTeamName(rows[i]['team_name']);
                    gift.setTime(rows[i]['created_at']);
                    resp.addGift(gift);
                }
                callback(null, resp);
            }
        });
    }

function redeemGift(call, callback) {
    let resp = new messages.RedeemResponse();
    const gifts = call.request.getGiftList();
    for (let i in gifts) {
        redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [gifts[i].getStaffPassId(), gifts[i].getTeamName(), Math.floor(Date.now()).toString()]);
        created_db.run("DELETE FROM created WHERE team_name = '" + gifts[i].getTeamName() + "'");
    }
        resp.setRresp('Gift redeemed successfully');
        callback(null, resp);
};

function checkHistory(call, callback) {
    const teamName = call.request.getGetteamid();
    let resp = new messages.HistoryResponse();
    const query = "SELECT * FROM redeemed WHERE team_name = '" + teamName + "'";
    redeemed_db.all(query, (err, rows) => {
        if (err) {
            return callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'No previous gifts redeemed for this team'
            });
        } else {
            const res = JSON.stringify(rows);
            resp.setHresp(res);
            callback(null, resp);
        }
    });
}

function updateCreate(call, callback) {
    let resp = new messages.UpdateCreateResponse();
    created_db.all("SELECT * FROM created", (err, rows) => {
        if (err) {
            return callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'No data found'
            });
        } else {
          const headers = 'staff_pass_id,team_name,created_at';
          const csvData = rows.map(row => Object.values(row).slice(1).join(','));
          csvData.unshift(headers);
          fs.writeFile('./data/staff-id-to-team-mapping.csv', csvData.join('\n'), (err) => {
            if (err) {
              return callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'Error creating CSV file'
            });
            } else {
                const res = JSON.stringify(rows);
                resp.setUcresp(res);
                callback(null, resp);
            }
          });
        }
    });
}

function updateRedeemed(call, callback) {
    let resp = new messages.UpdateRedeemedResponse();
    redeemed_db.all("SELECT * FROM redeemed", (err, rows) => {
        if (err) {
            return callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'No data found'
            });
        } else {
          const headers = 'staff_pass_id,team_name,redeemed_at';
          const csvData = rows.map(row => Object.values(row).slice(1).join(','));
          csvData.unshift(headers);
          fs.writeFile('./data/redeemed.csv', csvData.join('\n'), (err) => {
            if (err) {
              return callback({
                code: this.grpc.status.UNAUTHENTICATED,
                message: 'Error creating CSV file'
            });
            } else {
                const res = JSON.stringify(rows);
                resp.setUrresp(res);
                callback(null, resp);
            }
          });
        }
    });
}
    
processCSV().then(() => {
    redeemed_db.all("SELECT * FROM redeemed", (err, rows) => {
        if (err) {
            console.error(err.message);
            exit(1);
        }
        else {
            console.log(rows);
        }
    });



}).catch(() => {
    console.error('Error processing CSV file');
    exit(1);
})

let address = '0.0.0.0:50051';
    server.addService(services.backendServiceService, {
        getTeam: getTeam,
        getGifts: getGifts,
        redeemGift: redeemGift,
        checkHistory: checkHistory,
        updateCreate: updateCreate,
        updateRedeemed: updateRedeemed
    });
server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log("Server running at " + address);
});

// // accessing the team_id from the created database using the staff_pass_id
// created_db.all("SELECT team_name FROM created WHERE staff_pass_id = '" + staff_pass_id + "'", (err: Error, row: [createRecord]) => {
//   if (err) {
//     console.error(err.message);
//     exit(1);
//   }
//   else if (row.length < 1) {
//     console.error('Staff pass ID not found');
//     exit(1);
//   } else {
//     // accessing all entries with the team_id from the created database
//     created_db.all("SELECT * FROM created WHERE team_name = '" + row[0]['team_name'] + "'", (err: Error, row: [createRecord]) => {
//       if (err) {
//         console.error(err.message);
//         exit(1);
//       } else {
//           // inserting the entries into the redeemed database
//             for (let i in row) {
//               redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row[i].staff_pass_id, row[i].team_name, Math.floor(Date.now())]);
//               created_db.run("DELETE FROM created WHERE staff_pass_id = '" + row[i].staff_pass_id + "'");
//             }
//             redeemed_db.all("SELECT * FROM redeemed", (err: Error, rows: []) => {
//               if (err) {
//                 console.error(err.message);
//                 exit(1);
//               } else {
//                 const headers = 'staff_pass_id,team_name,redeemed_at';
//                 const csvData = rows.map(row => Object.values(row).slice(1).join(','));
//                 csvData.unshift(headers);
//                 fs.writeFile('redeemed.csv', csvData.join('\n'), (err: Error) => {
//                   if (err) {
//                     console.error(err.message);
//                     exit(1);
//                   } else {
//                     console.log('redeem CSV file updated successfully');
//                   }
//                 });
//               }
//             });
//           });
//         } else {
//           // inserting the entries into the redeemed database
//           for (let i in row) {
//             redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row[i].staff_pass_id, row[i].team_name, Math.floor(Date.now())]);
//             created_db.run("DELETE FROM created WHERE staff_pass_id = '" + row[i].staff_pass_id + "'");
//           }
//           redeemed_db.all("SELECT * FROM redeemed", (err: Error, rows: []) => {
//             if (err) {
//               console.error(err.message);
//               exit(1);
//             } else {
//               const headers = 'staff_pass_id,team_name,redeemed_at';
//               const csvData = rows.map(row => Object.values(row).slice(1).join(','));
//               csvData.unshift(headers);
//               fs.writeFile('redeemed.csv', csvData.join('\n'), (err: Error) => {
//                 if (err) {
//                   console.error(err.message);
//                   exit(1);
//                 } else {
//                   console.log('redeem CSV file created successfully');
//                 }
//               });
//             };
//           });
//         }
//         //deleting the entries from the created database
//         created_db.all("SELECT * FROM created", (err: Error, rows: []) => {
//           if (err) {
//             console.error(err.message);
//             exit(1);
//           } else {
//             const headers = 'staff_pass_id,team_name,redeemed_at';
//             const csvData = rows.map(row => Object.values(row).slice(1).join(','));
//             csvData.unshift(headers);
//             fs.writeFile('staff-id-to-team-mapping.csv', csvData.join('\n'), (err: Error) => {
//               if (err) {
//                 console.error(err.message);
//                 exit(1);
//               } else {
//                 console.log('create CSV file updated successfully');
//               }
//             });
//           }
//         });
//       });
