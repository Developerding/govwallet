const messages = require('./proto/backend_pb');

module.exports = class API {
    constructor(db, grpc) {
        this.db = db;
        this.grpc = grpc;
    }

    getTeam(call, callback) {
        const staffId = call.request.getStaffid(); 
        let resp = new messages.getTeamResponse();
        const query = 'SELECT team_id FROM created WHERE staff_pass_id = ' + staffId;
        this.db.run(query, (err, rows) => {
            if (err) {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "No staff found"
                });
            } else {
                const res = JSON.stringify(rows);
                resp.setTeamResponse(res);
                callback(null, resp);
            }
        });
    }
}