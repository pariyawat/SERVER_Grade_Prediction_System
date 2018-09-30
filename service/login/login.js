const db = require('../../config/dbconnection');
const user = {

    toStudent: (dataReq, callback) => {
        const ID = dataReq.id
        const PW = dataReq.password

        let studentSQL;
        studentSQL = "SELECT student_id As ID, first_name AS FirstName, last_name AS LastName, role AS Role FROM student ";
        studentSQL += "WHERE student_id = '" + ID + "' AND pass_word = '" + PW + "'; ";

        return db.query(studentSQL, callback)
    },

    toTeacher: (dataReq, callback) => {
        const ID = dataReq.id
        const PW = dataReq.password

        let teacherSQL;
        teacherSQL = "SELECT teacher_key As ID, first_name AS FirstName, last_name AS LastName, role AS Role FROM teacher ";
        teacherSQL += "WHERE teacher_id = '" + ID + "' AND pass_word = '" + PW + "'; ";

        return db.query(teacherSQL, callback)
    },

    toAdmin: (dataReq, callback) => {
        const ID = dataReq.id
        const PW = dataReq.password
       
        let adminSQL;
        adminSQL = "SELECT admin_id As ID, first_name AS FirstName, last_name AS LastName, role AS Role FROM admin ";
        adminSQL += "WHERE admin_id = '" + ID + "' AND pass_word = '" + PW + "'; ";
        
        return db.query(adminSQL, callback)
    }

}

module.exports = user;