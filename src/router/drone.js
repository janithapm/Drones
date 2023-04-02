const express = require('express');
const router = express.Router();
router.use(express.json());

const Drone = require('../logic/drone');

router.post('/register', async (req, res) => {
    try {
        const drone = req.body;

        const { serial, model, weight_limit, battery } = req.body;
        if (!serial || !model || !weight_limit || !battery) {
            return res.status(400).send({ success:false, error:{code:"INVLAID_PARAMETER"}});
          }

        let resp = await Drone.register(drone);
        if (resp.success) {
            return res.send(resp);
        }
        return res.status(400).send(resp.error);
    }
    catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;