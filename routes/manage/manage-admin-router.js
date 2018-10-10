const express = require('express');
const router = express.Router();
const { manageAdmin } = require('../../service/manage/manage-admin-service')

const getAmin = router.get('/:admin_id', (req, res) => {
    admin_id = req.params.admin_id
    manageAdmin.getAdmin(admin_id, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row[0]);
        }
    })
})

const editAdmin = router.put('/profile', (req, res) => {
    const data = req.body
    manageAdmin.editAdmin(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})

const changePass = router.put('/', (req, res) => {
    const data = req.body
    manageAdmin.changePassAdmin(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);

        }
    })
})


module.exports = { getAmin, editAdmin, changePass }