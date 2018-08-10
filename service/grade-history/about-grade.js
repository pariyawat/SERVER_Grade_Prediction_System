const db = require('../../config/dbconnection');
const aboutGrade = {


    addGrade: (data, userID) => {
        const studentID = userID.substring(0, 4);
        let ID = '';
        if (studentID >= 1158) {
            ID = '58'
        } else if (studentID >= 1153) {
            ID = '53'
        } else if (studentID >= 1150) {
            ID = '50'
        }
        return new Promise((resolve, reject) => {


            const deleteGrade = `
            DELETE FROM grade_history WHERE student_id = '${userID}' AND subject_id = '${data.subject_id}'; 
            `
            db.query(deleteGrade)

            const addGradeList = `
            INSERT INTO grade_history (student_id, subject_cpe, subject_id, subject_name, course_id, grade) 
            SELECT '${userID}',T1.subject_cpe, T1.subject_id, T1.subject_name, T1.course_id, '${data.grade}' 
            FROM (SELECT subject_cpe, subject.subject_id${ID} AS subject_id, subject_name,course_id  FROM subject LEFT JOIN subject_${ID}   
            ON subject.subject_id${ID} = subject_${ID}.subject_id${ID} 
            WHERE subject_${ID}.subject_id${ID} ='${data.subject_id}') T1; 
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
    },

    deleteGrade: (data) => {
        return new Promise((resolve, reject) => {
            const deleteGradeSQL = `DELETE FROM grade_history WHERE student_id = '${data.userID}' AND subject_id = '${data.subID}'`
            
            db.query(deleteGradeSQL, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
    },

    editGrade: (data) => {
        return new Promise((resolve, reject) => {
            const editGradeSQL = `UPDATE grade_history SET grade = '${data.GRADE}' WHERE student_id = '${data.userID}' AND subject_id = '${data.SUB_ID}'`

            db.query(editGradeSQL, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = aboutGrade;