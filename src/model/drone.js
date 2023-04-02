const db = require('../database/sqlite_init');

let add = function (drone = {}) {
    return new Promise((resolve, reject) => {
        const droneData = [drone.serial, drone.model, drone.weight_limit, drone.battery, 'IDLE'];

        const INSERT_DRONES = 'INSERT INTO drones (serial, model, weight_limit, battery, state) VALUES (?, ?, ?, ?, ?)';

        return db.run(INSERT_DRONES, droneData, (error) => {
            if (error) {
                return reject({ success: false, error:error.code });
            }
            return resolve({ success: true, error: null });
        });
    });
}

let getCount = function() {
    return new Promise((resolve, reject) => {
        const COUNT_QUERY = 'SELECT COUNT(*) as count FROM drones';

        return db.get(COUNT_QUERY, (error, row) => {
            if (error) {
                return reject({ success: false, error });
            }
            return resolve({success:true, count:row.count});
        });
    });
}

let getBatteryLog = function() {
    return new Promise((resolve, reject) => {
        const query = `SELECT serial as SERIAL,battery as BATTERY FROM drones`;
        db.all(query, (err, row) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(row);
            }
        });
    });
}

let getDroneBySerial = function(serial) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM drones where serial = '${serial}'`;
        db.get(query, (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

let updateDroneState = function(serial, state) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE drones SET state = ? WHERE serial = ?`;
        db.run(query, [state, serial], (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}


module.exports = {
    add,
    getCount,
    getBatteryLog,
    getDroneBySerial,
    updateDroneState,
}