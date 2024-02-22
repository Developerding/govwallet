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
        console.log(res.data.gifts);
        setTime(Date.now().toString());
        setStatus(1);
      } else if(res.data.message === 'No new gifts') {
        setStatus(2);
        setGifts(res.data.gifts);
        setStaffPassId(res.data.gifts.slice(-1)['staff_pass_id']);
        setTime(res.data.gifts.slice(-1)['staff_pass_id'])
      } else {
        setStatus(3);
        setErrMessage(res.data.message);
      }
    });
  
  }
  
  return (
    <>
      <h1>Gift Redemption Counter</h1>
      <div className="card">
        <input type="text" value={staffPassId} onChange={(e) => setStaffPassId(e.target.value)} />
        <button onClick={() => validate(staffPassId)}>
          Redeem!
        </button>
        {/* <ol>
          {gifts.map((gift, index) => (
            <li key={index}>{gift}</li>
          ))}
        </ol> */}
        {status === 1 && (
          <div>
            <p>Gifts was redeemed by: {staffPassId} at {time}</p>
            <ol>
              {gifts.map((gift, index) => (
                <li key={index}>{gift}</li>
              ))}
            </ol>
          </div>
        )}
        {status === 2 && (
          <div>
            <p>Gift was last redeemed by: {staffPassId} at {time}</p>
            <ol>
              {gifts.map((gift, index) => (
                <li key={index}>{gift}</li>
              ))}
            </ol>
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
