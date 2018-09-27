const express = require('express');
const router = express.Router();
const teacherGradeService = require('../../service/grade-history/about-grad-teacher')
const addGradeService = require('../../service/grade-history/teacher-add-grade-service')

const teacherEditGrade = router.put('/', (req, res) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaa');
    data = req.body
    teacherGradeService.editGrade(data, (err, row) => {
        if (err) {
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
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})



const teacherAddrade = router.post('/', async (req, res, next) => {

    let output = { error: [], success: [] }
    data = req.body.data
    group = req.body.group
    console.log(data)

    for (const std of data) {
        if (std.student_id) {
            await addGradeService.teachAddGrad(std, group, (err, row) => {
                if (err) {
                    output.error.push(std)

                } else if (row.affectedRows <= 0) {
                    output.error.push(std)
                } else {
                    output.success.push(std)
                }
            })

        }
    }
    setTimeout(() => {
        res.json(output)
    }, 500);


})



module.exports = {
    teacherEditGrade,
    teacherDeleteGrade,
    teacherAddrade
}