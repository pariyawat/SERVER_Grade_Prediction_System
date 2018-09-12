const db = require('../../config/dbconnection');
const groupPredictService = {

    getGroupByTeacher: (teacherID, callback) => {

        getGroupSQL = ` SELECT group_name FROM group_cpe WHERE teacher_id = '${teacherID}'`
        return db.query(getGroupSQL, callback);
    },

    getStudentByGroup: (group, callback) => {
        getStdSQL = `
        SELECT STD.student_id AS STD_ID, CONCAT(STD.first_name,' ',STD.last_name) AS STD_NAME,
        STD.group_name AS STD_GROUP, COUNT(GH.subject_cpe) AS ACT_SUB  
        FROM student AS STD  LEFT JOIN grade_history AS GH  ON GH.student_id = STD.student_id
        WHERE STD.group_name = '${group}' GROUP BY STD.student_id
        `
        return db.query(getStdSQL, callback)
    },

    getSubjectByGroup: (stdGroup, callback) => {
        let str = stdGroup.substring(3, 5);
        let course = '';
        if (str >= 58) {
            course = '58'
        } else if (str >= 53) {
            course = '53'
        } else if (str >= 50) {
            course = '50'
        } else {
            course = '50'
        }

        const getSubSQL = `SELECT subject_cpe AS SUB_CPE, subject.subject_id${course} AS SUB_ID, subject_name AS SUB_NAME
        FROM subject  JOIN subject_${course} ON subject.subject_id${course}  = subject_${course}.subject_id${course}`

        return db.query(getSubSQL,callback)
    }
}

module.exports = groupPredictService;