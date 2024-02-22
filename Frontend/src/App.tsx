import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  
  const [staffPassId, setStaffPassId] = useState('');
  const [gifts, setGifts] = useState([]);
  const [status, setStatus] = useState(0);
  const [errMessage, setErrMessage] = useState('');
  const [time, setTime] = useState('');

  function validate(staffPassId: string) {
    axios.get('http://localhost:3000/check/' + staffPassId).then((res) => {
      if(res.data.message === 'Gifts redeemed successfully') {
        setTime(Date.now().toString());
        setGifts(res.data.gifts);
        setStatus(1);
      } else if(res.data.message === 'No new gifts') {
        setStatus(2);
        setGifts(res.data.gifts);
        setStaffPassId(res.data.gifts.slice(-1)[0][0]);
        setTime(res.data.gifts.slice(-1)[0][2]);
      } else {
        setStatus(3);
        setErrMessage(res.data.message);
      }
    });
  }

  let inputTime = new Date(parseInt(time) + 28800000);
  let timeString = inputTime.toUTCString();
  timeString = timeString.slice(0, 22) + " SGT"
  
  return (
    <>
      <h1>Gift Redemption Counter</h1>
      <div className="card">
        <input type="text" value={staffPassId} onChange={(e) => setStaffPassId(e.target.value)} />
        <button onClick={() => validate(staffPassId)}>
          Redeem!
        </button>
        {status === 1 && (
          <div>
            {gifts.length == 1 ? (<p>1 gift was redeemed by: {staffPassId} at {timeString}</p>) :
            (<p>{gifts.length} gifts were redeemed by: {staffPassId} at {timeString}</p>)}
          </div>
        )}
        {status === 2 && (
          <div>
            <p id='Redeemed'>Gifts for {gifts.slice(-1)[0][1]} was last redeemed by: {staffPassId} at {timeString}</p>
          </div>
        )}
        {status === 3 && (
          <p>Error faced: {errMessage}</p>
          )}
      </div>
    </>
  )
}

export default App
