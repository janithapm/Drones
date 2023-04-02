const db = require('../database/sqlite_init');

function Drone(serial, model, weight_limit, battery, state) {
    this.serial = serial;
    this.model = model;
    this.weight_limit = weight_limit;
    this.battery = battery;
    this.state = state;
}


let register = function (drone = {}) {
    return new Promise((resolve, reject) => {
        const droneData = [drone.serial, drone.model, drone.weight_limit, drone.battery, 'IDLE'];

        const INSERT_DRONES = 'INSERT INTO drones (serial, model, weight_limit, battery, state) VALUES (?, ?, ?, ?, ?)';

        return db.run(INSERT_DRONES, droneData, (err) => {
            if (err) {
                return resolve({ success: false, error: err });
            }
            return reject({ success: true, error: null });
        });
    });



}


module.exports = {
    Drone,
    register
}