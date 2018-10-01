const db = require('../../config/dbconnection');

const manageStudent = {

    uploadStudent: async (data, callback) => {
        const { student, group_name, password } = await data
        const result = { success: [], error: [] }
        for (let std of student) {
            let { student_id, first_name, last_name, email_address } = await std
            let SQL =
                `INSERT INTO student (student_id, first_name, last_name, group_name, email_address, pass_word, role)
            VALUES('${student_id}','${first_name}','${last_name}', '${group_name}', '${email_address}', '${password}', 'Student') `
            if (student_id) {

                await db.query(SQL, (err, row) => {
                    if (err) {
                        result.error.push(std)
                    } else {
                        result.success.push(std)
                    }
                })
            }
        }
        setTimeout(() => {
            callback({ results: result })
        }, 500);


    },

    addStudent: (data, callback) => {

        const { student_id, first_name, last_name, passwordControl, email_address, group_name } = data
        const addSQL =
            `INSERT INTO student (student_id, first_name, last_name, group_name, email_address, pass_word, role)
            VALUES('${student_id}','${first_name}','${last_name}', '${group_name}', '${email_address}', '${passwordControl}', 'Student') `

        db.query(addSQL, callback)

    },

    editStudent: (data, callback) => {
        const { student_ido, student_id, first_name, last_name, email_address, group_name } = data
        editSQL = `UPDATE student
        SET student_id = '${student_id}',first_name = '${first_name}', last_name = '${last_name}', group_name= '${group_name}', email_address = '${email_address}'
        WHERE student_id = '${student_ido}'`
        return db.query(editSQL, callback)
    },

    changeSTDPass: (data, callback) => {
        const { passwordControl, student_id } = data
        console.log({ passwordControl, student_id })
        const passSQL =
            `UPDATE student SET pass_word = '${passwordControl}' WHERE student_id = '${student_id}'`

        db.query(passSQL, callback)
    },

    getStudent: (group_name, callback) => {
        const getSQL =
            `SELECT student_id, first_name, last_name, group_name, email_address
            FROM student WHERE  group_name = '${group_name}' `

        db.query(getSQL, callback)

    },

    deleteStudent: (student_id, callback) => {
        delSQL = `DELETE FROM student  WHERE student_id =  '${student_id}';`
        return db.query(delSQL, callback)
    }
}

module.exports = { manageStudent }