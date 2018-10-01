const express = require('express');
const router = express.Router();
const { manageStudent } = require('../../service/manage/manage-student.service')

const uploadStudent = router.post('/:one?', async (req, res) => {
    if (req.params.one) {
        const data = req.body
        manageStudent.addStudent(data, (err, row) => {
            if (err) {
                res.json(err);
            } else {
                res.json(row);
            }
        })
    } else {
        const { student, group_name, password } = await req.body
        await manageStudent.uploadStudent({ student, group_name, password }, (err, row) => {
            if (err) {
                res.json(err);
            } else {
                res.json(row);
            }
        })
    }
})

const getStudent = router.get('/:group_name', (req, res) => {
    let group_name = req.params.group_name
    manageStudent.getStudent(group_name, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row)
        }
    })
})

const deleteStudent = router.delete('/:student_id', (req, res) => {
    let student_id = req.params.student_id
    manageStudent.deleteStudent(student_id, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})


const changPassStudent = router.put('/', (req, res) => {

    const data = req.body
    manageStudent.changeSTDPass(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })

})
const editStudent = router.put('/profile', (req, res) => {

    const data = req.body
    manageStudent.editStudent(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })

})


module.exports = { uploadStudent, getStudent, deleteStudent, changPassStudent, editStudent };