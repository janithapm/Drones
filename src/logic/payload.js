const Payload = require('../model/paayload');

let getPayloadsByDrone = async function (serial) {
    try {
        const drone = await Payload.get(serial);
        return drone;
    }
    catch (error) {
       throw error;
    }
}

module.exports = {
    getPayloadsByDrone
}