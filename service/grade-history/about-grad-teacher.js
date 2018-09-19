const db = require('../../config/dbconnection');
const gradeTeacher = {

    editGrade: (data, callback) => {
        console.log(data)
        const editGradeSQL = `
        UPDATE grade_history SET grade = '${data.GRADE}' WHERE student_id = '${data.STD_ID}' AND subject_id = '${data.SUB_ID}'
        `
        return db.query(editGradeSQL, callback)
    },

    deleteGrade: (data, callback) => {
        const deleteGradeSQL = `
        DELETE FROM grade_history WHERE student_id = '${data.STD_ID}' AND subject_id = '${data.SUB_ID}'
        `
        return db.query(deleteGradeSQL, callback)
    }
}

module.exports = gradeTeacher