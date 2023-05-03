const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(':memory:');

// Create table
let createTable = `CREATE TABLE meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transcription TEXT,
    summary TEXT
)`;

db.run(createTable, function(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log('Table created');
});

// Insert data
let insertData = `INSERT INTO meetings (transcription, summary) VALUES (?, ?)`;

db.run(insertData, ['Transcription', 'Summary'], function(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Rows inserted ${this.changes}`);
});

// Select data
let selectData = `SELECT * FROM meetings`;

db.all(selectData, [], function(err, rows) {
    if (err) {
        return console.error(err.message);
    }
    console.log(rows);
});