const sqlite3 = require('sqlite3').verbose();
let instance = null;

function getInstance() {
  if (!instance) {
    instance = new sqlite3.Database('drones.sqlite');
  }
  intitalQueries(instance);
  return instance;
}

function intitalQueries(db) {
  const CREATE_DRONES = `CREATE TABLE IF NOT EXISTS drones (
    serial TEXT(100) NOT NULL PRIMARY KEY,
    model TEXT NOT NULL CHECK(model IN ('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight')),
    weight_limit DECIMAL(5,2) NOT NULL CHECK(weight_limit <= 500 and weight_limit > 0),
    battery INTEGER NOT NULL CHECK(battery <= 100 and battery >= 0),
    state TEXT CHECK(state IN ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING'))
  ) `;

  const CREATE_MEDICATIONS = `CREATE TABLE IF NOT EXISTS medications (
    code TEXT PRIMARY KEY CHECK(code GLOB '[A-Z0-9_]*'),
    name TEXT CHECK(name GLOB '[A-Za-z0-9_-]*'),
    weight DECIMAL(5,2) CHECK(weight >= 0),
    image TEXT CHECK(image LIKE 'https://%')
  ) `;

  const CREATE_PAYLOADS = `CREATE TABLE IF NOT EXISTS payloads (
    drone_serial TEXT(100) NOT NULL,
    medication_code  TEXT CHECK(medication_code GLOB '[A-Z0-9_]*'), 
    weight DECIMAL(5,2) NOT NULL CHECK(weight >= 0),
    delivered BOOLEAN DEFAULT 0
  ) `;

  const TABLES = [CREATE_DRONES, CREATE_MEDICATIONS, CREATE_PAYLOADS];

  TABLES.forEach(TABLE => {
    db.run(`${TABLE};`, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
    });
  });
  setTimeout(() => {
    insertMedications(db);
    insertDrones(db);
  }, 10000);

}

function insertMedications(db) {
  const medicationData = [
    ['A1', 'name1', 5000.0, 'https://picsum.photos/200'],
    ['B1', 'name2', 500.0, 'https://picsum.photos/200'],
    ['C1', 'name3', 10.7, 'https://picsum.photos/200']
  ];

  const INSERT_MEDICATIONS = 'INSERT INTO medications (code, name, weight, image) VALUES (?, ?, ?, ?)';

  medicationData.forEach((row) => {
    db.run(INSERT_MEDICATIONS, row, (err) => {
      if (err) {
        //console.error(row, err);
      }
    });
  });
}

function insertDrones(db) {
  const droneData = [
    ['qwe341q2w3e', 'Lightweight', 10, 100, 'IDLE'],
    ['23fdfdfgdfered', 'Cruiserweight', 420, 100, 'IDLE'],
    ['23fdfdfgdfered2', 'Heavyweight', 495, 95, 'IDLE']
  ];

  const INSERT_DRONES = 'INSERT INTO drones (serial, model, weight_limit, battery, state) VALUES (?, ?, ?, ?, ?)';

  droneData.forEach((row) => {
    db.run(INSERT_DRONES, row, (err) => {
      if (err) {
        //console.error(row, err.message);
      }
    });
  });
}

module.exports = getInstance();