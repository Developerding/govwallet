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
            console.log(err.message);
        }
        else {
            console.log(response.array[0]);
        }
    });

    let getGifts = new backendMessages.GetGiftsRequest();
    getGifts.setTeamName("RUST");
    client.getGifts(getGifts, function(err, response) {
        if (err) {
            console.log('here')
            let checkHistory = new backendMessages.HistoryRequest();
            checkHistory.setGetteamid("RUST");
            client.checkHistory(checkHistory, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.array[0]);
                }
            });
        }
        else if (response.array[0].length > 0) {
            console.log(response.array[0]);
            let redeemGift = new backendMessages.RedeemRequest();
            for(i in response.array[0]) {
                let gift = new backendMessages.Gift();
                gift.setStaffPassId(response.array[0][i][0]);
                gift.setTeamName(response.array[0][i][1]);
                gift.setTime(response.array[0][i][2]);
                gifts.push(gift);
            }
            redeemGift.setGiftList(gifts);
            client.redeemGift(redeemGift, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.array[0]);
                }
            });
            
            let updateCreate = new backendMessages.UpdateCreateRequest();
            client.updateCreate(updateCreate, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.array[0]);
                }
            });

            let updateRedeemed = new backendMessages.UpdateRedeemedRequest();
            client.updateRedeemed(updateRedeemed, function(err, response) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(response.array[0]);
                }
            });
        } else {

        }
    });

    // console.log(gifts);

    // Post function

    // let putReq = new messages.PutCaseRequest();
    // putReq.setPutid("65a657ce392fe0532914f495");
    // putReq.setCreatedatetime("2021-04-01T00:00:00.000Z")
    // putReq.setInstructionList([putReqInfo]);

    // client.putCase(putReq, function(err, response) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    //     else {
    //         console.log(JSON.parse(response.array[0]));
    //     }
    // });

    // // Delete function
    // let delReq = new messages.DelCaseRequest();
    // delReq.setDelid("65a67ddc42d06def5943b48d");
    // client.delCase(delReq, function(err, response) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    //     else {
    //         console.log(response);
    //     }
    // });
}
main();