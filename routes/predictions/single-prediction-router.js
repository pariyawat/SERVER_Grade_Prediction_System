const express = require('express');
const router = express.Router();
const auth = require('../../auth/autentication')
const subject = require('../../controller/predictions/subject-prediction-control')
const singlePredict = require('../../controller/predictions/single-prediction-control');


const getSubject = router.get('/:STD_ID?', (req, res, next) => {
    let STD_ID = req.params.STD_ID
    if (STD_ID) {
        subject.getSubject(STD_ID, res);
    } else {

        let user = auth.getUserByToken(req)
        subject.getSubject(user.ID, res);
    }

})

const prediction = router.post('/', (req, res, next) => {
    let data = req.body
    data = req.body
    user = auth.getUserByToken(req)
 
   singlePredict.predict(data, res)

})

module.exports = {
    getSubject,
    prediction
};