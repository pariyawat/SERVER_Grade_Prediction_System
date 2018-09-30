const db = require('../../config/dbconnection');

const manageTeacher = {
    getTeacher: (callback) => {
        SQL = "SELECT  teacher_key, teacher_id , first_name, last_name, email_address FROM teacher"
        return db.query(SQL, callback)
    },

    addTeacher: (data, callback) => {
        addSQL = `
        INSERT INTO teacher (teacher_id, first_name, last_name, email_address, pass_word, role)
        VALUES ('${data.teacher_id}','${data.first_name}','${data.last_name}','${data.email_address}','${data.passwordControl}','Teacher'); `

        return db.query(addSQL, callback)
    },

    changePass: (data, callback) => {
        changeSQL = `UPDATE teacher SET pass_word = '${data.passwordControl}' WHERE teacher_id = '${data.teacher_id}';`
        return db.query(changeSQL, callback)
    },

    editTeacher: (data, callback) => {

        editSQL = `UPDATE teacher
        SET teacher_id = '${data.teacher_id}',first_name= '${data.first_name}',last_name = '${data.last_name}', email_address= '${data.email_address}'
        WHERE teacher_id = '${data.teacher_ido}';`
        return db.query(editSQL, callback)
    },
    deleleTeacher: (teacher_id, callback) => {

        delSQL = `DELETE FROM teacher  WHERE teacher_id =  '${teacher_id}';`
        return db.query(delSQL, callback)
    }
}

module.exports = { manageTeacher }
