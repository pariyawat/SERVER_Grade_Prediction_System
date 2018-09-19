const express = require('express');
const router = express.Router();
const teacherGradeService = require('../../service/grade-history/about-grad-teacher')

const teacherEditGrade = router.put('/',(req, res) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaa');
    data =  req.body
    teacherGradeService.editGrade(data, (err, row) =>{
        if(err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
});

const teacherDeleteGrade = router.delete('/:STD_ID/:SUB_ID', (req, res) => {
    let data = {
        STD_ID: req.params.STD_ID,
        SUB_ID: req.params.SUB_ID
    }
    
    teacherGradeService.deleteGrade(data, (err, row) => {
        if(err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})

module.exports = {
    teacherEditGrade,
    teacherDeleteGrade
}