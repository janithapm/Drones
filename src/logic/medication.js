const droneModel = require('../model/drone');
const medicationModel = require('../model/medication');

let getIdleDroneBySerial = async function (serial) {
    try {
        const drone = await droneModel.getIdleDroneBySerial(serial);
        return true;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    getIdleDroneBySerial
}