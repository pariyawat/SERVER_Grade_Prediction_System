const express = require('express');
const router = express.Router();
const grade = require('../../service/grade-history/about-grade');

router.post('/', (req, res, next) =>{
    const dataReq = req.body
    console.log(dataReq)
    grade.addGradeStudent(dataReq,(err, row) => {
        if(err){
            res.json(err)
        }else {
            res.json(row)
        }
    })
});

module.exports = router;