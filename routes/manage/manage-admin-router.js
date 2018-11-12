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
const learnDataUpload = router.post( '/', async (req, res) => {
    const data = await req.body
    const lengths = await data.length - 1
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++\n',data)
    for(let i = 0; i < lengths; i++){
     await   manageAdmin.learnDataUpload(data[i])
    }
    res.json(200,'success')


})

module.exports = { getAmin, editAdmin, changePass, learnDataUpload }