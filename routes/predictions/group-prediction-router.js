const express = require('express');
const router = express.Router();
const auth = require('../../auth/autentication')
const predictService = require('../../service/predictions/group-prediction-service')


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







module.exports = {
    getGroup,
    getStudent,
    getSubject
};