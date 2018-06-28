const db = require('../../config/dbconnection');
const subject = {
    getCourseByID: (id, callback) => {
        let courseSQL = "SELECT subject_id50 AS S_ID , subject_name AS S_Name , credit AS Credit FROM subject_" + id;
        return db.query(courseSQL, callback);
    }
}

module.exports = subject;