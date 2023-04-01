const sqlite3 = require('sqlite3').verbose();
let instance = null;

function getInstance() {
  if (!instance) {
    instance = new sqlite3.Database('drones.sqlite');
  }
  intitalQueries(instance)
  return instance;
}

function intitalQueries(db) {
  const CREATE_DRONES = `CREATE TABLE IF NOT EXISTS drones (
    serial TEXT(100) NOT NULL PRIMARY KEY,
    model TEXT NOT NULL,
    weight_limit DECIMAL(5,2) NOT NULL CHECK(weight_limit < 500 and weight_limit > 0),
    battery INTEGER NOT NULL CHECK(battery < 100 and battery > 0),
    state TEXT NOT NULL CHECK(state IN ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING'))
  ) `;

  const CREATE_MEDICATIONS = `CREATE TABLE IF NOT EXISTS medications (
    code TEXT PRIMARY KEY CHECK(code GLOB '[A-Z0-9_]*'),
    name TEXT CHECK(name GLOB '[A-Za-z0-9_-]*'),
    weight DECIMAL(5,2) CHECK(weight >= 0),
    image TEXT CHECK(image LIKE 'http://%'),
  )`;

  const CREATE_PAYLOADS = `CREATE TABLE IF NOT EXISTS medications (
    drone_serial TEXT(100) NOT NULL,
    medication_code  TEXT CHECK(code GLOB '[A-Z0-9_]*'), 
    delivered BOOLEAN DEFAULT 0
  )`;
  db.run(`${CREATE_DRONES};${CREATE_MEDICATIONS};${CREATE_PAYLOADS};`, (err) => {
    if (err) {
      throw err;
    }
    console.log("database tables are created(if not exists) succsfully");
  })
}

module.exports = getInstance();