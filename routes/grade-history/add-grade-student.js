const express = require('express');
const router = express.Router();
const grade = require('../../service/grade-history/about-grade');

router.post('/', (req, res, next) => {
    const data = req.body

    let response = [];

    for (let i = 0; i <= data.length; i++) {
        if (data[i].subject_id) {
            console.log(data[i].subject_id)
            grade.addGradeStudent(data[i], (err, row) => {
                if (err) {
                    data[i]['isUpdate'] = false;
                    response.push(data[i]);
                    console.log(err)
                } else {
                    data[i]['isUpdate'] = true;
                    response.push(data[i]);
                    console.log(row)
                }
            })
        }
        if (i + 1 === data.length) {
            res.json(response)
        }

    }
    console.log(response)

});

module.exports = router;