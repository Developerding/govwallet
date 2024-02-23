const grpc = require('@grpc/grpc-js')
const backendServices = require('./proto/backend_grpc_pb')
const backendMessages = require('./proto/backend_pb')


var express = require("express");
var app = express();
const cors = require("cors");
var allowedOrigins = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "*"
];
app.use(
  express.json(),
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.get("/check/:staffPassId", (req, res) => {
    const client = new backendServices.backendServiceClient('localhost:50051', grpc.credentials.createInsecure());
    let gifts = []
    // Read function
    let getTeam = new backendMessages.GetTeamRequest();
    getTeam.setStaffPassId(req.params.staffPassId);
    client.getTeam(getTeam, function(err, response) {
        if (err) {
            res.send(err.message);
        }
        else {
            let checkHistory = new backendMessages.HistoryRequest();
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
                let getGifts = new backendMessages.GetGiftsRequest();
                getGifts.setTeamName(responseArray['team_name']);
                client.getGifts(getGifts, function(err, response) {
                    if (err) {
                        res.send(err.message);
                    }
                    else if (response.getGiftList().length > 0) {
                        let redeemGift = new backendMessages.RedeemRequest();
                        for(i in response.getGiftList()) {
                            let gift = new backendMessages.Gift();
                            gift.setStaffPassId(response.getGiftList()[i].getStaffPassId());
                            gift.setTeamName(response.getGiftList()[i].getTeamName());
                            gift.setTime(response.getGiftList()[i].getTime());
                            gifts.push(gift);
                        }
                        redeemGift.setGiftList(gifts);
                        client.redeemGift(redeemGift, function(err, response) {
                            console.log(gifts);  
                            if (err) {
                                res.send(err.message);
                            }
                        });
                        
                        let updateCreate = new backendMessages.UpdateCreateRequest();
                        client.updateCreate(updateCreate, function(err, response) {
                            if (err) {
                                res.send(err.message);
                            }
                        });
            
                        let updateRedeemed = new backendMessages.UpdateRedeemedRequest();
                        client.updateRedeemed(updateRedeemed, function(err, response) {
                            if (err) {
                                res.send(err.message);
                            }
                            else {
                                console.log(gifts);
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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

module.exports.app = app;
