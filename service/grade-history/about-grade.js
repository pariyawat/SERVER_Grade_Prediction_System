const db = require('../../config/dbconnection');
const aboutGrade = {


    addGrade:  (data) => {
        return new Promise((resolve, reject) => {

            const addGradeList = `
            INSERT INTO grade_history (student_id, subject_cpe, subject_id, subject_name, course_id, grade) 
            SELECT '${data.student_id}',T1.subject_cpe, T1.subject_id, T1.subject_name, T1.course_id, '${data.grade}' 
            FROM (SELECT subject_cpe, subject.subject_id58 AS subject_id, subject_name,course_id  FROM subject LEFT JOIN subject_58   
            ON subject.subject_id58 = subject_58.subject_id58 
            WHERE subject_58.subject_id58 ='${data.subject_id}') T1; 
            `
            db.query(addGradeList, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
            // resolve(db.query(addGradeList));

        })
    },

    getGrade: (id) => {
        return new Promise((resolve, reject) => {
            const getGradeSQL = `
            SELECT subject_id AS SUB_ID, subject_name AS SUB_NAME ,grade AS GRADE, course_id AS COURSE 
            FROM grade_history WHERE student_id = '${id}' GROUP BY subject_name
            `
            db.query(getGradeSQL, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })
    }
}

module.exports = aboutGrade;