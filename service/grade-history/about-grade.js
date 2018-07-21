const db = require('../../config/dbconnection');
const aboutGrade = {


    addGrade: (data) => {
        return new Promise((resolve, reject) => {

            const addGradeList = `
            INSERT INTO grade_history (student_id, subject_cpe, subject_name, course_id, grade) 
            SELECT '${data.student_id}',T1.subject_cpe, T1.subject_name, T1.course_id, '${data.grade}' 
            FROM (SELECT subject_cpe, subject_name,course_id  FROM subject LEFT JOIN subject_58   
            ON subject.subject_id58 = subject_58.subject_id58 
            WHERE subject_58.subject_id58 ='${data.subject_id}') T1; 
            `
            resolve(db.query(addGradeList));

        })
    }
}

module.exports = aboutGrade;