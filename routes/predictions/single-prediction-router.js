const express = require('express');
const router = express.Router();
const subject = require('../../controller/predictions/subject-prediction-control')
const singlePredict = require('../../controller/predictions/single-prediction-control');


const getGrade = router.get('/', (req, res, next) => {
    subject.getSubject(req, res);
})

const prediction = router.post('/', (req, res, next) => {
    data = req.body
    res.json(data)
   let a = singlePredict.predict()
   console.log(JSON.stringify(a))
})

module.exports = {
    getGrade,
    prediction
};