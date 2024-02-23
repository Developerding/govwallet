# govwallet

Instructions:
1. cd in-memory
2. npm install
3. node index.js
4. In a second terminal in the 'in-memory' folder, type node client.js

5. In a third terminal, cd Frontend
6. npm install
7. npm run dev

Assumptions:
1.	I am the only one in charge of the gift distribution
2.	The mapping file will not be changed
3.	The created_at time will be a timestamp that is earlier than the current timestamp
4.	Even if there are additions made to the csv file, there will not be entries that are before the latest timestamp of the current version
5.	Since we only have the created file, then everyone received at least one gift
a.	Everyone in every team receives at least one gift so their unique IDs are all in the create dataset
6.	For function 2, since we are supposed to check against redemption data and filter based on the team, then the staff member collecting gifts will collect all available gifts for his/her team that have been posted in the create dataset that is before the time of collection
a.  A secondary assumption since there are rows with the same timing, that two identical rows can be created also

Tech stack used:
1. grpc
2. sqlite in-memory database
3. express
4. React typescript
