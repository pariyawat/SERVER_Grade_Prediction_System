const express = require('express');
const router = express.Router();
const { manageTeacher } = require('../../service/manage/manage-teacher-service')

const getTeacher = router.get('/', (req, res) => {
    manageTeacher.getTeacher((err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})

const addTeacher = router.post('/', (req, res) => {
    const data = req.body
    manageTeacher.addTeacher(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            console.log(row)
            res.json(row);

        }
    })
})

const changePass = router.put('/', (req, res) => {
    const data = req.body
    manageTeacher.changePass(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})

const editTeacher = router.put('/profile', (req, res) => {
    const data = req.body
    manageTeacher.editTeacher(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})

const deleteTeacher = router.delete('/:teacher_id', (req, res) => {
    teacher_id = req.params.teacher_id
    manageTeacher.deleleTeacher(teacher_id, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})

module.exports = { getTeacher, addTeacher, changePass, editTeacher, deleteTeacher }