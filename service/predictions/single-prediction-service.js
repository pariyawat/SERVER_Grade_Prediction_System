const db = require('../../config/dbconnection');
const Subject = {


    getSubject: (userID) => {
        const studentID = userID.substring(0, 4);
        let course= '';
        if (studentID >= 1158) {
            course = '58'
        } else if (studentID >= 1153) {
            course = '53'
        } else if (studentID >= 1150) {
            course = '50'
        }
        return new Promise((resolve, reject) => {

            const getSubjectSQL = `
            SELECT subject_cpe AS SUB_CPE, subject.subject_id${course} AS SUB_ID, subject_name AS SUB_NAME
            FROM subject  JOIN subject_${course} ON subject.subject_id${course}  = subject_${course}.subject_id${course}
            WHERE subject.subject_id${course}
			NOT IN (SELECT subject_id FROM grade_history WHERE student_id = '${userID}' ) 
            `

            db.query(getSubjectSQL, function (error, results) {
                if (error) {
                    reject(error)
                } else
                    resolve(results);
            });

        })
    }
}

module.exports = Subject;