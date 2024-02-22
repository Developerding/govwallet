import { useState } from 'react';
import './App.css';
import * as grpc from '@grpc/grpc-js';
import { backendServiceClient } from './proto/backend_grpc_pb';
import * as backendMessages from './proto/backend_pb';

    // let getGifts = new backendMessages.GetGiftsRequest();
    // getGifts.setTeamName("RUST");
    // client.getGifts(getGifts, function(err, response: backendMessages.GetGiftsResponse | undefined) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    //     else if (response.array[0].length > 0) {
    //         console.log(response.array[0]);
    //         let redeemGift = new backendMessages.RedeemRequest();
    //         for(i in response.array[0]) {
    //             let gift = new backendMessages.Gift();
    //             gift.setStaffPassId(response.array[0][i][0]);
    //             gift.setTeamName(response.array[0][i][1]);
    //             gift.setTime(response.array[0][i][2]);
    //             gifts.push(gift);
    //         }
    //         redeemGift.setGiftList(gifts);
    //         client.redeemGift(redeemGift, function(err, response) {
    //             if (err) {
    //                 console.log(err.message);
    //             }
    //             else {
    //                 console.log(response.array[0]);
    //             }
    //         });
            
    //         let updateCreate = new backendMessages.UpdateCreateRequest();
    //         client.updateCreate(updateCreate, function(err, response) {
    //             if (err) {
    //                 console.log(err.message);
    //             }
    //             else {
    //                 console.log(response.array[0]);
    //             }
    //         });

    //         let updateRedeemed = new backendMessages.UpdateRedeemedRequest();
    //         client.updateRedeemed(updateRedeemed, function(err, response) {
    //             if (err) {
    //                 console.log(err.message);
    //             }
    //             else {
    //                 console.log(response.array[0]);
    //             }
    //         });
    //     } else {
    //         let checkHistory = new backendMessages.HistoryRequest();
    //         checkHistory.setGetteamid("RUST");
    //         client.checkHistory(checkHistory, function(err, response) {
    //             if (err) {
    //                 console.log(err.message);
    //             }
    //             else {
    //                 console.log(response.array[0]);
    //             }
    //         });
    //     }
    // });

function App() {
  const [count, setCount] = useState(0);
  const [staffPassId, setStaffPassId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [gifts, setGifts] = useState([]);

  const client = new backendServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  
  const validate = (staffPassId: string) => {
      let getTeam = new backendMessages.GetTeamRequest();
      getTeam.setStaffPassId(staffPassId);
      client.getTeam(getTeam, (err, response: backendMessages.GetTeamResponse | undefined) => {
        if (err) {
          console.log(err.message);
        }
        else {
          console.log(response);
        }
      });
  }
  return (
    <>
      <h1>Gift Redemption Counter</h1>
      <div className="card">
        <input type="text" value={staffPassId} onChange={(e) => setStaffPassId(e.target.value)} />
        <button onClick={() => validate(staffPassId)}>
          count is {staffPassId}
        </button>
        <p >
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
