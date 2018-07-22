const db = require('../../../config/dbconnection');
const Subject = {


    getSubject: () => {
        return new Promise((resolve, reject) => {

            const getSubjectSQL = `
                        SELECT subject_cpe, subject.subject_id58 , subject_name
                        FROM subject  JOIN subject_58 ON subject.subject_id58  = subject_58.subject_id58
                        `

            db.query(getSubjectSQL, function (error, results, fields) {
                if (error) throw error;
                resolve(JSON.stringify(results));
              });

        })
    }
}

module.exports = Subject;