const express = require('express');
const router = express.Router();
const auth = require('../../auth/autentication')
const predictService = require('../../service/predictions/group-prediction-service')
const predictionControl = require('../../controller/predictions/group-prediction-control')

const getGroup = router.get('/', (req, res) => {

    let user = auth.getUserByToken(req)

    predictService.getGroupByTeacher(user.ID, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    });
})


const getStudent = router.get('/:group', (req, res) => {
    let group = req.params.group
    predictService.getStudentByGroup(group, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row)
        }
    })

})

const getSubject = router.get('/t/:group', (req, res) => {
    let group = req.params.group
    predictService.getSubjectByGroup(group, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row)
        }
    })
})

const prediction = router.post('/', (req, res) => {
    let data = req.body;
    predictionControl.predict(data, res)

})



module.exports = {
    getGroup,
    getStudent,
    getSubject,
    prediction
};