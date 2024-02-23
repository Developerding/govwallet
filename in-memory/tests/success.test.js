const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const grpc = require('@grpc/grpc-js');
const services = require('../proto/backend_grpc_pb');
const messages = require('../proto/backend_pb');
const fs = require('fs');
const csv = require('csv-parser');


const firstStaffPassId = 'STAFF_H123804820G';
const secondStaffPassId = 'MANAGER_T999888420B';
const thirdStaffPassId = 'BOSS_T000000001P';
const invalidStaffPassId = 'fake_id';

describe('Success', () => {
  let created_db;
  let redeemed_db;
  let server;
  let expressApp;

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

  beforeEach((done) => {
    created_db = new sqlite3.Database(':memory:');
    redeemed_db = new sqlite3.Database(':memory:');
    server = new grpc.Server();

    created_db.serialize(() => {
      created_db.run('CREATE TABLE created (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_name TEXT, created_at TEXT)');
    });

    redeemed_db.serialize(() => {
      redeemed_db.run('CREATE TABLE redeemed (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_name TEXT, redeemed_at TEXT)');
    });

    // Process CSV and other setup operations
    processCSV(created_db, redeemed_db).then(() => {
    done();
    });
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
var express = require("express");
var app = express();

app.get("/check/:staffPassId", (req, res) => {
    const client = new services.backendServiceClient('localhost:50051', grpc.credentials.createInsecure());
    let gifts = []
    // Read function
    let getTeam = new messages.GetTeamRequest();
    getTeam.setStaffPassId(req.params.staffPassId);
    client.getTeam(getTeam, function(err, response) {
        if (err) {
            res.send(err.message);
        }
        else {
            let checkHistory = new messages.HistoryRequest();
            let responseArray = JSON.parse(response.getGtresp());
            if(responseArray['table'] == 'redeemed') {
                checkHistory.setGetteamid(responseArray['team_name']);
                client.checkHistory(checkHistory, function(err, response) {
                    if (err) {
                        res.send(err.message);
                    }
                    else {
                        let gift = [];
                        for(i in response.getGiftList()) {
                            gift.push(response.getGiftList()[i].array);
                        }
                        res.send({message: "No new gifts", gifts: gift});
                    }
                });
            } else {
                let getGifts = new messages.GetGiftsRequest();
                getGifts.setTeamName(responseArray['team_name']);
                client.getGifts(getGifts, function(err, response) {
                    if (err) {
                        res.send(err.message);
                    }
                    else if (response.getGiftList().length > 0) {
                        let redeemGift = new messages.RedeemRequest();
                        for(i in response.getGiftList()) {
                            let gift = new messages.Gift();
                            gift.setStaffPassId(response.getGiftList()[i].getStaffPassId());
                            gift.setTeamName(response.getGiftList()[i].getTeamName());
                            gift.setTime(response.getGiftList()[i].getTime());
                            gifts.push(gift);
                        }
                        redeemGift.setGiftList(gifts);
                        client.redeemGift(redeemGift, function(err, response) {
                            if (err) {
                                res.send(err.message);
                            }
                        });
                        
                        let updateCreate = new messages.UpdateCreateRequest();
                        client.updateCreate(updateCreate, function(err, response) {
                            if (err) {
                                res.send(err.message);
                            }
                        });
            
                        let updateRedeemed = new messages.UpdateRedeemedRequest();
                        client.updateRedeemed(updateRedeemed, function(err, response) {
                            if (err) {
                                res.send(err.message);
                            }
                            else {
                                res.send({message: "Gifts redeemed successfully", gifts: gifts});
                            }
                        });
                    } else {
                        res.send("No gifts available for this team");
                    }
                });
            }
        }
    });
});

expressApp = app.listen(3000, () => {
    console.log("Server running on port 3000");
});
// expressApp.close();
  });

  afterEach((done) => {
    let headers = 'staff_pass_id,team_name,redeemed_at';
    fs.createReadStream('./data/staff-id-to-team-mapping copy.csv')
    .pipe(csv())
    .on('data', (row) => { // Corrected parameter name from 'rows' to 'row'
      
      var csvData = Object.values(row).join(','); // 'row' represents a single row
      headers = headers + '\n' + csvData;
      fs.writeFile('./data/staff-id-to-team-mapping.csv', headers, (err) => {
        if (err) {
          console.error(err.message);
        } else {
        }
      });
    });
    if(fileExists('./data/redeemed.csv')) {
        fs.unlink('./data/redeemed.csv', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('redeemed CSV file deleted successfully');
        });
    }
    expressApp.close(() => {
        console.log('Express app closed');
        created_db.close((err) => {
            if (err) {
                console.error('Error closing created_db:', err.message);
            } else {
                console.log('created_db closed');
                redeemed_db.close((err) => {
                    if (err) {
                        console.error('Error closing redeemed_db:', err.message);
                    } else {
                        console.log('redeemed_db closed');
                        server.tryShutdown((err) => {
                            if (err) {
                                console.error('Error closing gRPC server:', err.message);
                            } else {
                                console.log('gRPC server closed');
                                done(); // Call done() after all resources are closed
                            }
                        });
                    }
                });
            }
        });
    });
  });

  // Define gRPC service methods and server setup here

  test('Able to redeem gifts', async () => {
    const response = await axios.get('http://localhost:3000/check/' + firstStaffPassId);
    expect(response.data.message).toBe('Gifts redeemed successfully');
    expect(response.data.gifts.length).toBe(1);
  });

  test('Able to redeem gifts by 2nd team', async () => {
    const response = await axios.get('http://localhost:3000/check/' + secondStaffPassId);
    expect(response.data.message).toBe('Gifts redeemed successfully');
    expect(response.data.gifts.length).toBe(2);
  });

  test('No new gifts', async () => {
    // Make the first request
    const response1 = await axios.get('http://localhost:3000/check/' + secondStaffPassId);
    // Verify the response of the first request
    expect(response1.data.message).toBe('Gifts redeemed successfully');
    expect(response1.data.gifts.length).toBe(2);
  
    // Make the second request
    const response2 = await axios.get('http://localhost:3000/check/' + thirdStaffPassId);
    // Verify the response of the second request
    expect(response2.data.message).toBe('No new gifts');
  });
  test('No such user', async () => {
    const response = await axios.get('http://localhost:3000/check/' + invalidStaffPassId);
    expect(response.data).toBe('16 UNAUTHENTICATED: Staff ID not found');
  });
});

// Helper function to process CSV and other setup operations
function fileExists(filepath) {
    try {
        fs.accessSync(filepath, fs.constants.F_OK);
        return true;
    }
    catch (err) {
        return false;
    }
}

function processCSV(created_db, redeemed_db) {
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
        resolve();
        created_db.all("SELECT * FROM created", (err, rows) => {
        if (err) {
            console.error(err.message);
            reject();
        }
        else {
            resolve();
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
            resolve();
        })
            .on('error', (error) => {
            console.error('Error:', error);
            reject();
        });
    } else {
        fs.writeFile(filepath, 'staff_pass_id,team_name,redeemed_at', (err) => {
            if (err) {
            console.error(err.message);
            reject();
            }
            console.log('redeemed CSV file created successfully');
            resolve();
        });
    }
});
}