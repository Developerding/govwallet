import { useState } from 'react';
import './App.css';
import * as grpc from '@grpc/grpc-js';
import { backendServiceClient } from './proto/backend_grpc_pb';
import * as backendMessages from './proto/backend_pb';

const validate = (staffPassId: string, client: backendServiceClient) => {
  const [teamName, setTeamName] = useState('');
  const [gifts, setGifts] = useState<backendMessages.Gift[]>([]);
    let getTeam = new backendMessages.GetTeamRequest();
    getTeam.setStaffPassId(staffPassId);
    client.getTeam(getTeam, (err, response: backendMessages.GetTeamResponse | undefined) => {
      if (err) {
        console.log(err.message);
      }
      else {
        console.log(response);
        if (response?.getGtresp() !== undefined) {
          setTeamName(response.getGtresp());
        }
      }
    });

    let getGifts = new backendMessages.GetGiftsRequest();
    getGifts.setTeamName(teamName);
    client.getGifts(getGifts, (err, response: backendMessages.GetGiftsResponse | undefined) => {
        if (err) {
            let checkHistory = new backendMessages.HistoryRequest();
            checkHistory.setGetteamid("RUST");
            client.checkHistory(checkHistory, (err, response: backendMessages.HistoryResponse | undefined) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                  if(response?.getGiftList() !== undefined) {
                    setGifts(response.getGiftList());
                  }
                }
            });
        }
        else if (response?.getGiftList.length !== undefined) {
            let redeemGift = new backendMessages.RedeemRequest();
            for( let i in response.getGiftList()) {
                let gift = new backendMessages.Gift();
                gift.setStaffPassId(response.getGiftList()[i].getStaffPassId());
                gift.setTeamName(response.getGiftList()[i].getTeamName());
                gift.setTime(response.getGiftList()[i].getTime());
                gifts.push(gift);
            }
            redeemGift.setGiftList(gifts);
            client.redeemGift(redeemGift, (err, response: backendMessages.RedeemResponse | undefined) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    if(response?.getRresp() !== undefined) {
                        console.log(response.getRresp());
                    }
                }
            });
            
            let updateCreate = new backendMessages.UpdateCreateRequest();
            client.updateCreate(updateCreate, (err, response: backendMessages.UpdateCreateResponse | undefined) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                  if(response?.getUcresp() !== undefined) {
                    console.log(response.getUcresp());
                }
                }
            });

            let updateRedeemed = new backendMessages.UpdateRedeemedRequest();
            client.updateRedeemed(updateRedeemed, (err, response: backendMessages.UpdateRedeemedResponse | undefined) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                  if(response?.getUrresp() !== undefined) {
                    console.log(response.getUrresp());
                }
                }
            });
        }
    });
}

function App() {
  const [staffPassId, setStaffPassId] = useState('');

  const client = new backendServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  
  return (
    <>
      <h1>Gift Redemption Counter</h1>
      <div className="card">
        <input type="text" value={staffPassId} onChange={(e) => setStaffPassId(e.target.value)} />
        <button onClick={() => validate(staffPassId, client)}>
          count is {staffPassId}
        </button>
      </div>
    </>
  )
}

export default App
