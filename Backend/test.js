"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const sqlite3_1 = __importDefault(require("sqlite3"));
// creating in-memory database
const db = new sqlite3_1.default.Database(':memory:');
db.run('CREATE TABLE created (id INTEGER PRIMARY KEY, staff_pass_id TEXT, team_id TEXT, created_at INTEGER)');
//parsing the csv file into the database
fs.createReadStream('staff-id-to-team-mapping.csv')
    .pipe((0, csv_parser_1.default)())
    .on('data', (row) => {
    // accessing the staff_pass_id variable
    var id = '';
    for (let i in row) {
        id = row[i];
        break;
    }
    db.run('INSERT INTO created (staff_pass_id, team_id, created_at) VALUES (?, ?, ?)', [id, row.team_name, parseInt(row.created_at)]);
})
    .on('end', () => {
});
//querying the database
db.all("SELECT * FROM created", (err, rows) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log(rows);
    }
})
    .on('error', (error) => {
    console.error('Error:', error);
});
