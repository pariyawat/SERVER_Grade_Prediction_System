const db = require('../../config/dbconnection');
const subject = {
    getCourseByID: (id, callback) => {
        let subjectSQL = `
        SELECT subject_id${id} AS S_ID , subject_name AS S_Name , credit AS Credit FROM subject_${id}
        `;
        return db.query(subjectSQL, callback);
    }
}

module.exports = subject;