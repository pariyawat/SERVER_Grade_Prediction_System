const express = require('express');
const router = express.Router();
const grade = require('../../service/grade-history/about-grade');

router.post('/', (req, res, next) =>{
    const dataReq = req.body
    console.log(dataReq)

    const res = [];

    for (let i = 0; i <= data.length; i++) {
    grade.addGradeStudent(data[i],(err, row) => {
        if(err){
            data[i]['isUpdate'] = false;
            res.push(data[i])
        }else {
            data[i]['isUpdate'] = true;
            res.push(data[i])
        }
    })

}
});

module.exports = router;