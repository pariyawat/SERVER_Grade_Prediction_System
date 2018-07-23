const db = require('../../config/dbconnection');
const Subject = {


    getSubject: () => {
        return new Promise((resolve, reject) => {

            const getSubjectSQL = `
            SELECT subject_cpe AS SUB_CPE, subject.subject_id58 AS SUB_ID, subject_name AS SUB_NAME
            FROM subject  JOIN subject_58 ON subject.subject_id58  = subject_58.subject_id58
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