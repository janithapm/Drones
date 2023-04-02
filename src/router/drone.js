const express = require('express');
const router = express.Router();
router.use(express.json());

const Drone = require('../logic/drone');

router.post('/register', async (req, res) => {
    try {
        const drone = req.body;
        let resp = await Drone.register(drone);
        if (resp.succues) {
            return res.send({ drone });
        }
        return res.status(400).send(resp.error);
    }
    catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;