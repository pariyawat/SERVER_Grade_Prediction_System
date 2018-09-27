const db = require('../../config/dbconnection');

const teachAddGrade = {
    teachAddGrad: (data, group, callback) => {
        const studentID = data.student_id.substring(0, 4);
        let course = '';
        if (studentID >= 1158) {
            course = '58'
        } else if (studentID >= 1153) {
            course = '53'
        } else if (studentID >= 1150) {
            course = '50'
        }
        const deleteGrade = `
        DELETE FROM grade_history WHERE student_id = '${data.student_id}' AND subject_id = '${data.subject_id}'; 
        `

        const addGradeList = `
        INSERT INTO grade_history (student_id, subject_cpe, subject_id, subject_name, course_id, grade) 
        SELECT T2.student_id ,T1.subject_cpe, T1.subject_id, T1.subject_name, T1.course_id, '${data.grade}' 
        FROM (SELECT subject_cpe, subject.subject_id${course} AS subject_id, subject_name,course_id  FROM subject LEFT JOIN subject_${course}   
        ON subject.subject_id${course} = subject_${course}.subject_id${course} 
        WHERE subject_${course}.subject_id${course} ='${data.subject_id}') T1, student T2 WHERE student_id = '${data.student_id}' AND group_name = '${group}';
        `
        db.query(deleteGrade)
       return db.query(addGradeList, callback)
    }
}

module.exports = teachAddGrade
