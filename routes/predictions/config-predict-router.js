const express = require('express');
const router = express.Router();
const { configPredict } = require('../../service/predictions/config-predict-service')
const getConfig = router.get('/', (req, res) => {
    configPredict.getConfig((err, row) => {
        if (err) {
            res.json(err)
        } else {
            res.json(row[0])
        }
    })
})

const editConfig = router.put('/', (req, res) => {
    data = req.body
    configPredict.editConfig(data, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    })
})

module.exports = { getConfig, editConfig }