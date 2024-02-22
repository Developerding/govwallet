const axios = require('axios');
const fs = require('fs');
const {processCSV} = require('../index');

const firstStaffPassId = 'STAFF_H123804820G';
const secondStaffPassId = 'MANAGER_T999888420B';
const thirdStaffPassId = 'BOSS_T000000001P';

describe('Success', () => {
  beforeEach(async () => {
    await processCSV();
  });
  test('Able to redeem gifts', async () => {
    axios.get('http://localhost:3000/check/' + firstStaffPassId).then((response) => {
        expect(response.data.message).toBe('Gifts redeemed successfully');
        expect(response.data.gifts.length).toBe(1);
        })
  });
    test('Able to redeem gifts by 2nd team', async () => {
        axios.get('http://localhost:3000/check/' + secondStaffPassId).then((response) => {
            expect(response.data.message).toBe('Gifts redeemed successfully');
            expect(response.data.gifts.length).toBe(1);
            })
    });
    test('No new gifts', async () => {
        axios.get('http://localhost:3000/check/' + thirdStaffPassId).then((response) => {
            expect(response.data.message).toBe('No new gifts');
            expect(response.data.gifts.length).toBe(0);
            })
    });
});
