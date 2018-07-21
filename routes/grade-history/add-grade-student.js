const express = require('express');
const router = express.Router();
const gradeModule = require('../../controller/grade-history/add-grade-student');

router.post('/', async (req, res, next) => {
    const data = req.body

    gradeModule.addGradeStudent(data , res);

});

module.exports = router;