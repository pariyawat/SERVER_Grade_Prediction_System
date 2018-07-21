const db = require('../../../config/dbconnection');

const Subject = {
    getSubject: (id) => {
        return new Promise((resolve, reject) => {
            const getSubjectSQL = `
            SELECT subject_cpe, subject.subject_id58 , subject_name
            FROM subject  JOIN subject_58 ON subject.subject_id58  = subject_58.subject_id58
            `
            console.log(db.query(getSubjectSQL))
            resolve(db.query(getSubjectSQL));
        })
    }
}
module.exports = Subject;