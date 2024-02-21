const messages = require('./proto/backend_pb');

module.exports = class API {
    constructor(created_db, redeemed_db, grpc) {
        this.created_db = created_db;
        this.redeemed_db = redeemed_db;
        this.grpc = grpc;
    }

    getTeam(call, callback) {
        const staffId = call.request.getStaffPassId(); 
        let resp = new messages.GetTeamResponse();
        const query = 'SELECT team_id FROM created WHERE staff_pass_id = ' + staffId;
        this.created_db.all(query, (err, rows) => {
            if (err) {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'Staff ID not found'
                });
            } else {
                const teamId = rows[0]['team_name'];
                resp.setGtresp(teamId);
                callback(null, resp);
            }
        });
    }
    getGifts(call, callback) {
        const teamId = call.request.getTeamId();
        let resp = new messages.GetGiftsResponse();
        const query = 'SELECT * FROM created WHERE team_id = ' + teamId;
        this.created_db.all(query, (err, rows) => {
            if (err) {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'No available gifts for this team'
                });
            } else {;
                resp.setGiftResponse(rows);
                callback(null, resp);
            }
        });
    }
    redeemGift(call, callback) {
        let resp = new messages.RedeemResponse();
        this.redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row[i].staff_pass_id, row[i].team_name, Math.floor(Date.now())]);
        this.created_db.run("DELETE FROM created WHERE staff_pass_id = '" + row[i].staff_pass_id + "'");
        resp.setRresp('Gift redeemed successfully');
        callback(null, resp);
    };

    checkHistory(call, callback) {
        const teamName = call.request.getGetteamid();
        let resp = new messages.HistoryResponse();
        const query = 'SELECT * FROM redeemed WHERE teamName = ' + teamName;
        this.redeemed_db.all(query, (err, rows) => {
            if (err) {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'No previous gifts redeemed for this team'
                });
            } else {
                const res = JSON.stringify(rows);
                resp.setHresp(res);
                callback(null, resp);
            }
        });
    }
    
    updateCreate(call, callback) {
        let resp = new messages.UpdateCreateResponse();
        this.created_db.all("SELECT * FROM created", (err, rows) => {
            if (err) {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'No data found'
                });
            } else {
              const headers = 'staff_pass_id,team_name,redeemed_at';
              const csvData = rows.map(row => Object.values(row).slice(1).join(','));
              csvData.unshift(headers);
              fs.writeFile('staff-id-to-team-mapping.csv', csvData.join('\n'), (err) => {
                if (err) {
                  return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'Error creating CSV file'
                });
                } else {
                    const res = JSON.stringify(rows);
                    resp.Ucresp(res);
                    callback(null, resp);
                }
              });
            }
        });
    }

    updateRedeemed(call, callback) {
        let resp = new messages.UpdateRedeemedResponse();
        this.redeemed_db.all("SELECT * FROM redeemed", (err, rows) => {
            if (err) {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'No data found'
                });
            } else {
              const headers = 'staff_pass_id,team_name,redeemed_at';
              const csvData = rows.map(row => Object.values(row).slice(1).join(','));
              csvData.unshift(headers);
              fs.writeFile('staff-id-to-team-mapping.csv', csvData.join('\n'), (err) => {
                if (err) {
                  return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: 'Error creating CSV file'
                });
                } else {
                    const res = JSON.stringify(rows);
                    resp.Urresp(res);
                    callback(null, resp);
                }
              });
            }
        });
    }
}