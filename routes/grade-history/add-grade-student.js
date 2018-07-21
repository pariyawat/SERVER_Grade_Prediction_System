const express = require('express');
const router = express.Router();
const gradeModule = require('../../module/grad-history');


router.post('/', async (req, res, next) => {
    const data = req.body

    gradeModule.addGradeStudent(data , res);

});




module.exports = router;