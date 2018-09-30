const express = require('express');
const router = express.Router();
const { manageGroup } = require('../../service/manage/manage-group-service')

const addGroup = router.post('/', (req, res) => {
    data = req.body
    manageGroup.addGroup(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})

const getGroup = router.get('/', (req, res) => {
    manageGroup.getGroup((err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})

const deleteGroup = router.delete('/:group_name/:teacher_key', (req, res) => {
    group_name = req.params.group_name
    teacher_key = req.params.teacher_key
    manageGroup.deleleGroup(group_name, teacher_key, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})

const editGroup = router.put('/', (req, res) => {
    const data = req.body
    manageGroup.editGroup(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})

module.exports = { addGroup, getGroup, deleteGroup, editGroup };