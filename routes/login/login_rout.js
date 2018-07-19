const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const auth = require('../../auth/autentication')
const login = require('../../service/login/login');


router.post('/', (req, res, next) => {

    const dataReq = req.body;

    login.toStudent(dataReq, (studenError, studentRow) => {
        if (studenError) {
            res.json(studenError);
        } else if (studentRow.length <= 0) {
            login.toTeacher(dataReq, (teacherError, teacherRow) => {
                if (teacherError) {
                    res.json(teacherError);
                } else if (teacherRow <= 0) {
                    login.toAdmin(dataReq, (adminError, adminRow) => {
                        if (adminError) {
                            res.json(adminError)
                        } else if (adminRow <= 0) {
                            res.json(401, "Can not login");
                        } else {
                            let dataAdmin = adminRow[0];
                            let token = auth.createToken(dataAdmin.ID);
                            dataAdmin['Token'] = token;
                            res.json(dataAdmin);
                        }
                    });
                } else {
                    let dataTeacher = teacherRow[0];
                    let token = auth.createToken(dataTeacher.ID);
                    dataTeacher['Token'] = token;
                    res.json(dataTeacher);
                }
            });
        } else {
            let dataStuden = studentRow[0];
            let token = auth.createToken(dataStuden.ID);
            dataStuden['Token'] = token;
            res.json(dataStuden);
        }
    });

});

module.exports = router;