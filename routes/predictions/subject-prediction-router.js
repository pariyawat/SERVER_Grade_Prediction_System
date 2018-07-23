const express = require('express');
const router = express.Router();
const pridicContron = require('../../controller/predictions/subject-prediction-control')
router.get('/',(req, res, next) =>{
    pridicContron.getSubject(req, res);
})
module.exports = router;