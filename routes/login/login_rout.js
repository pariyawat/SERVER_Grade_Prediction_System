const express = require('express');
const router = express.Router();
const auth = require('../../auth/autentication')
const login = require('../../service/login/login');


router.post('/', (req, res, next) => {
    let dataReq = req.body;

    login.toLogin(dataReq, (err, row) => {
        if (err) {
            res.json(401, err)
        } else if (row.length <= 0) {
            res.json(401, "Can not login")
        } else {
            let dataRes = row[0]
            let token = auth.createToken(dataRes.ID)
            dataRes['Token'] = token;
            res.json(dataRes);
            console.log(dataRes)
        }
    })

});

module.exports = router;