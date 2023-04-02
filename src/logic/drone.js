const Drone = require('../model/drone');

let register = async function (drone) {
    return await Drone.register(drone);
}

module.exports = {
    register
}