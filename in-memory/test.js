"use strict";
const fs = require('fs');
const csv = require('csv-parser');
const { exit } = require('process');
const sqlite3 = require('sqlite3').verbose();
function fileExists(filepath) {
    try {
        fs.accessSync(filepath, fs.constants.F_OK);
        return true;
    }
    catch (err) {
        return false;
    }
}
const filepath = 'redeemed.csv';
// creating in-memory database for create data
const created_db = new sqlite3.Database(':memory:');
created_db.serialize(() => {
    created_db.run('CREATE TABLE created (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_name TEXT, created_at INTEGER)');
});
// creating in memory database for redeemed data
const redeemed_db = new sqlite3.Database(':memory:');
redeemed_db.serialize(() => {
    redeemed_db.run('CREATE TABLE redeemed (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_name TEXT, redeemed_at INTEGER)');
});
var result = [];
// const staff_pass_id = 'BOSS_6FDFMJGFV6YM';
const staff_pass_id = 'STAFF_H123804820G';
// const staff_pass_id = 'BOSS_T000000001P';
//parsing the csv file into the database
fs.createReadStream('staff-id-to-team-mapping.csv')
    .pipe(csv())
    .on('data', (row) => {
    // accessing the staff_pass_id variable
    var id = '';
    for (let i in row) {
        id = row[i];
        break;
    }
    created_db.run('INSERT INTO created (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)', [id, row.team_name, parseInt(row.created_at)]);
    result.push(row);
})
    .on('end', () => {
    console.log('CSV file successfully processed');
    // accessing the team_id from the created database using the staff_pass_id
    created_db.all("SELECT team_name FROM created WHERE staff_pass_id = '" + staff_pass_id + "'", (err, row) => {
        if (err) {
            console.error(err.message);
            exit(1);
        }
        else if (row.length < 1) {
            console.error('Staff pass ID not found');
            exit(1);
        }
        else {
            // accessing all entries with the team_id from the created database
            created_db.all("SELECT * FROM created WHERE team_name = '" + row[0]['team_name'] + "'", (err, row) => {
                if (err) {
                    console.error(err.message);
                    exit(1);
                }
                else {
                    // reading from the redeemed csv file if it exists
                    if (fileExists(filepath)) {
                        fs.createReadStream(filepath)
                            .pipe(csv())
                            .on('data', (row) => {
                            redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row.staff_pass_id, row.team_name, row.redeemed_at]);
                        })
                            .on('end', () => {
                            console.log('redeemed CSV file successfully processed');
                            // inserting the entries into the redeemed database
                            for (let i in row) {
                                redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row[i].staff_pass_id, row[i].team_name, Math.floor(Date.now())]);
                                created_db.run("DELETE FROM created WHERE staff_pass_id = '" + row[i].staff_pass_id + "'");
                            }
                            redeemed_db.all("SELECT * FROM redeemed", (err, rows) => {
                                if (err) {
                                    console.error(err.message);
                                    exit(1);
                                }
                                else {
                                    const headers = 'staff_pass_id,team_name,redeemed_at';
                                    const csvData = rows.map(row => Object.values(row).slice(1).join(','));
                                    csvData.unshift(headers);
                                    fs.writeFile('redeemed.csv', csvData.join('\n'), (err) => {
                                        if (err) {
                                            console.error(err.message);
                                            exit(1);
                                        }
                                        else {
                                            console.log('redeem CSV file updated successfully');
                                        }
                                    });
                                }
                            });
                        });
                    }
                    else {
                        // inserting the entries into the redeemed database
                        for (let i in row) {
                            redeemed_db.run('INSERT INTO redeemed (staff_pass_id, team_name, redeemed_at) VALUES (?, ?, ?)', [row[i].staff_pass_id, row[i].team_name, Math.floor(Date.now())]);
                            created_db.run("DELETE FROM created WHERE staff_pass_id = '" + row[i].staff_pass_id + "'");
                        }
                        redeemed_db.all("SELECT * FROM redeemed", (err, rows) => {
                            if (err) {
                                console.error(err.message);
                                exit(1);
                            }
                            else {
                                const headers = 'staff_pass_id,team_name,redeemed_at';
                                const csvData = rows.map(row => Object.values(row).slice(1).join(','));
                                csvData.unshift(headers);
                                fs.writeFile('redeemed.csv', csvData.join('\n'), (err) => {
                                    if (err) {
                                        console.error(err.message);
                                        exit(1);
                                    }
                                    else {
                                        console.log('redeem CSV file created successfully');
                                    }
                                });
                            }
                            ;
                        });
                    }
                    //deleting the entries from the created database
                    created_db.all("SELECT * FROM created", (err, rows) => {
                        if (err) {
                            console.error(err.message);
                            exit(1);
                        }
                        else {
                            const headers = 'staff_pass_id,team_name,redeemed_at';
                            const csvData = rows.map(row => Object.values(row).slice(1).join(','));
                            csvData.unshift(headers);
                            fs.writeFile('staff-id-to-team-mapping.csv', csvData.join('\n'), (err) => {
                                if (err) {
                                    console.error(err.message);
                                    exit(1);
                                }
                                else {
                                    console.log('create CSV file updated successfully');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
})
    .on('error', (error) => {
    console.error('Error:', error);
});
