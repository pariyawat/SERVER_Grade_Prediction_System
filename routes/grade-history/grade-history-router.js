const express = require('express');
const router = express.Router();
const auth = require('../../auth/autentication')
const addGradControl = require('../../controller/grade-history/add-grade-student');
const getGradeControl = require('../../controller/grade-history/get-grade-student-control');

const addGrade = router.post('/', (req, res, next) => {
    const data = req.body
    const user = auth.getUserByToken(req);
    addGradControl.addGradeStudent(data, user.ID, res);

})

const getGrade = router.get('/:id', (req, res, next) => {
    let id = req.params.id
    getGradeControl.getGrade(id, res)
});


module.exports = {
    addGrade,
    getGrade
};