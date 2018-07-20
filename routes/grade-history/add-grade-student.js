const express = require('express');
const router = express.Router();
const grade = require('../../service/grade-history/about-grade');

router.post('/', (req, res, next) => {
    const data = req.body

    let resData = [];

    for (let i = 0; i <= data.length; i++) {
        const id = data[i].subject_id || null;
        if (id !== null) {
            grade.addGradeStudent(data[i], (err, row) => {
                if (err) {
                    resData.push(false)
                } else {
                    resData.push(true)
                }





            })
        }

        if (i + 1 === data.length) {
            res.send(true);
        }


    }


});

module.exports = router;