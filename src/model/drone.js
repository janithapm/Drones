const db = require('../database/sqlite_init');

function Drone(serial, model, weight_limit, battery, state) {
    this.serial = serial;
    this.model = model;
    this.weight_limit = weight_limit;
    this.battery = battery;
    this.state = state;
}


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


module.exports = {
    Drone,
    add,
    getCount,
    getBatteryLog,
}