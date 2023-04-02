const Drone = require('../model/drone');

let register = async function (drone) {
    try {
        return await Drone.register(drone);
    }
    catch (e) {
        return ({ succues: false, error: e });
    }
}

module.exports = {
    register
}