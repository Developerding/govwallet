require('dotenv').config();
const grpc = require('@grpc/grpc-js');
// const { MongoClient } = require("mongodb");
const services = require('./proto/backend_grpc_pb');
const API = require("./api");
// const dbClient = new MongoClient(process.env.DB_URI);
let api = null;
async function connectDB() {
    try {
        await dbClient.connect();
        let db = await dbClient.db(process.env.DB_NAME);
        db.command({ ping: 1 });
        console.log("Connected successfully to mongo server");
        // Init api
        api = new API(db, grpc);
    } catch (e) {
        console.error(e);
    }
}

async function main() {
//   await connectDB().catch(console.dir);
  let server = new grpc.Server();
  server.addService(services.backendServiceService, {
      getTeam: api.getTeam,
    //   getGift: api.postCase,
    //   delCase: api.delCase
  });
  let address = '0.0.0.0' + ':' + '50051';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
      server.start();
      console.log("Server running at " + address);
  });
}

main();