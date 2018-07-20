const db = require('../../config/dbconnection');
const aboutGrade = {

    addGradeStudent: (data, callback) => {
        let addGradeList;
        for (let i = 0; i <= data.length; i++) {
            if (data[i].subject_id) {
                addGradeList = `
                INSERT INTO grade_history (student_id, subject_cpe, subject_name, course_id, grade) 
                SELECT '${data[i].student_id}',T1.subject_cpe, T1.subject_name, T1.course_id, '${data[i].grade}' 
                FROM (SELECT subject_cpe, subject_name,course_id  FROM subject LEFT JOIN subject_58   
                ON subject.subject_id58 = subject_58.subject_id58 
                WHERE subject_58.subject_id58 ='${data[i].subject_id}') T1; 
                `
            }
        }
        console.log(addGradeList);
        return callback(false, "Calllllll");
    },

    exFunction : (data)=>{
        
    }
}

module.exports = aboutGrade;