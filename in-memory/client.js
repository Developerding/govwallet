const grpc = require('@grpc/grpc-js')
const backendServices = require('./proto/backend_grpc_pb')
const backendMessages = require('./proto/backend_pb')

function main() {
    const client = new backendServices.backendServiceClient('localhost:50051', grpc.credentials.createInsecure());
    let gifts = []
    // Read function
    let getTeam = new backendMessages.GetTeamRequest();
    getTeam.setStaffPassId("BOSS_T000000001P");
    client.getTeam(getTeam, function(err, response) {
        if (err) {
            let checkHistory = new backendMessages.HistoryRequest();
            checkHistory.setGetteamid("RUST");
            client.checkHistory(checkHistory, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.array);
                }
            });
        }
        else {
            console.log(typeof response.getGtresp());
        }
    });

    let getGifts = new backendMessages.GetGiftsRequest();
    getGifts.setTeamName("RUST");
    client.getGifts(getGifts, function(err, response) {
        if (err) {
            console.log(err.message);
            let checkHistory = new backendMessages.HistoryRequest();
            checkHistory.setGetteamid("RUST");
            client.checkHistory(checkHistory, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.getGiftList());
                }
            });
        }
        else if (response.getGiftList().length > 0) {
            let redeemGift = new backendMessages.RedeemRequest();
            for(i in response.getGiftList()) {
                let gift = new backendMessages.Gift();
                gift.setStaffPassId(response.getGiftList()[i].getStaffPassId());
                gift.setTeamName(response.getGiftList()[i]);
                gift.setTime(response.getGiftList()[i][2]);
                gifts.push(gift);
            }
            redeemGift.setGiftList(gifts);
            client.redeemGift(redeemGift, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.getRresp());
                }
            });
            
            let updateCreate = new backendMessages.UpdateCreateRequest();
            client.updateCreate(updateCreate, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.getUcresp());
                }
            });

            let updateRedeemed = new backendMessages.UpdateRedeemedRequest();
            client.updateRedeemed(updateRedeemed, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.getUrresp());
                }
            });
        } else {

        }
    });
}
main();