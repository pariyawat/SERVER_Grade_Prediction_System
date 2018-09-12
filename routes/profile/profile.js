const express = require('express')
const router = express.Router();
const Profile = require('../../service/profile/profile');
const auth = require('../../auth/autentication')

const getProfile = router.get('/:id/:role', (req, res) => {
    let dataId = req.params.id
    let dataRole = req.params.role
    Profile.getProfile(dataId, dataRole, (err, row) => {
        if (err) {
            res.json(err);
        } else {
            res.json(row);
        }
    });

});

const changeEmail = router.put('/', (req, res) => {
    let email = req.body.email;
    let user = auth.getUserByToken(req)

    if (user.Role === 'Teacher') {
        Profile.changeEmailTeacher({
            email: email,
            ID: user.ID
        }, (err, row) => {
            if (err) {
                res.json(err);
            } else {
                res.json(row)
            }
        })
    } else {

        Profile.changeEmail({
            email: email,
            ID: user.ID
        }, (err, row) => {
            if (err) {
                res.json(err);
            } else {
                res.json(row)
            }
        })
    }



})

const changePass = router.post('/', (req, res) => {
    let password = req.body.password;
    let user = auth.getUserByToken(req);

    if (user.Role === 'Teacher') {
        Profile.changePasswordTeacher({
            password: password,
            ID: user.ID
        }, (err, row) => {
            if (err) {
                res.json(err);
            } else {
                res.json(row)
            }
        })
    } else {
        Profile.changePassword({
            password: password,
            ID: user.ID
        }, (err, row) => {
            if (err) {
                res.json(err);
            } else {
                res.json(row)
            }
        })
    }
})


module.exports = {
    getProfile,
    changeEmail,
    changePass
}