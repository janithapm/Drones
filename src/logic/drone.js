const Drone = require('../model/drone');

let register = async function (drone = {}) {
    const addAllowed = await hasFleetLimitExceeded();
    if (!addAllowed) {
        return { success: false, error: "LIMIT_EXCEEDED" };
    }

    const { serial, model, weight_limit, battery } = drone;
    if (typeof drone !== "object" || (!serial || !model || !weight_limit || !battery)) {
        return { success: false, error: "INVALID_PARAMETER" };
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