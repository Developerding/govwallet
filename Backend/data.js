const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

// creating in-memory database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run('CREATE TABLE created (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_id TEXT, created_at INTEGER)');
});
var result = [];

//parsing the csv file into the database
fs.createReadStream('staff-id-to-team-mapping.csv')
  .pipe(csv())
  .on('data', (row) => {

    // accessing the staff_pass_id variable
    var id = '';
    for(i in row){
        id = row[i];
        break;
    }
    db.run('INSERT INTO created (staff_pass_id, team_id, created_at) VALUES (?, ?, ?)', [id, row.team_name, parseInt(row.created_at)]);
    result.push(row);
    })
  .on('end', () => {
    console.log('CSV file successfully processed');
    db.all("SELECT * FROM created", (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(rows);
      }
    });
  })
  .on('error', (error) => {
    console.error('Error:', error);
  });

// db.close();

//querying the database

// db.all("SELECT * FROM created", (err, rows) => {
//         if (err) {
//           console.error(err.message);
//         } else {
//           console.log(rows);
//         }
//     })
//     .on('error', (error) => {
//       console.error('Error:', error);
//   });

