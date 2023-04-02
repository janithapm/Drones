const Drone = require('../model/drone');

let register = async function (drone) {
    const addAllowed = await hasFleetLimitExceeded();
    if (addAllowed) {
        return { success: false, error: "LIMIT_EXCEEDED" };
    }
    return await Drone.add(drone);
}

let hasFleetLimitExceeded = async () => {
    try {
        let countCheck = await Drone.getCount();
        if (countCheck.success && countCheck.count < 10) {
            return true;
        }
        return false;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    register
}