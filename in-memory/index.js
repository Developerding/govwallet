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
        const query = "SELECT team_name FROM created WHERE staff_pass_id = '" + staffId + "'";
        created_db.all(query, (err, rows) => {
            if (err) {
                return callback({
                    code: grpc.status.UNAUTHENTICATED,
                    message: err.message
                });
            }else if(rows.length == 0){
                const query2 = "SELECT team_name FROM redeemed WHERE staff_pass_id = '" + staffId + "'";
                redeemed_db.all(query2, (err, rows) => {
                    if (err) {
                        return callback({
                            code: grpc.status.UNAUTHENTICATED,
                            message: 'Staff ID not found'
                        });
                    } else if(rows.length == 0){
                        return callback({
                            code: grpc.status.UNAUTHENTICATED,
                            message: 'Staff ID not found'
                        });
                    }else{
                        const teamName = JSON.stringify({'table': 'redeemed', 'team_name': rows[0]['team_name']});
                        resp.setGtresp(teamName);
                        callback(null, resp);
                    }
                });
            } else{
                const teamName = JSON.stringify({'table': 'created', 'team_name': rows[0]['team_name']});
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
        } else if (rows.length == 0) {
            return callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'No previous gifts redeemed for this team'
            });
        }else{
            for (let i in rows) {
                console.log(rows[i]);
                let gift = new messages.Gift();
                gift.setStaffPassId(rows[i]['staff_pass_id']);
                gift.setTeamName(rows[i]['team_name']);
                gift.setTime(rows[i]['redeemed_at']);
                resp.addGift(gift);
            }
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
    
processCSV()

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
