const express = require('express');
const router = express.Router();
const pridicContron = require('../../../controller/predictions/single/single-prediction-control')
router.get('/',(req, res, next) =>{
    pridicContron.getSubject(res);
})
module.exports = router;