const db = require('../../config/dbconnection');
const aboutGrade = {

    addGradeStudent: async (data, callback) => {

        // let addGradeList;
        // for (let i = 0; i <= data.length; i++) {
        //     if (data[i].subject_id) {
        const addGradeList = `
                INSERT INTO grade_history (student_id, subject_cpe, subject_name, course_id, grade) 
                SELECT '${data.student_id}',T1.subject_cpe, T1.subject_name, T1.course_id, '${data.grade}' 
                FROM (SELECT subject_cpe, subject_name,course_id  FROM subject LEFT JOIN subject_58   
                ON subject.subject_id58 = subject_58.subject_id58 
                WHERE subject_58.subject_id58 ='${data.subject_id}') T1; 
                `
        // }
        // }
        // console.log(addGradeList);
        // return callback(false, "Calllllll");
        // console.log(addGradeList)
        return await db.query(addGradeList, callback)
    },

    addGrade: function (data) {
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

    // exFunction : (data)=>{

    // }
}

module.exports = aboutGrade;