const express = require('express');
const router = express.Router();
const subject = require('../../service/subject/subject');

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    subject.getCourseByID(id, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    });
});

module.exports = router;