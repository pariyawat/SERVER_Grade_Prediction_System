const db = require('../../config/dbconnection');
const user = {
    toLogin: (dataReq, callback) => {
        let ID = dataReq.id
        let PW = dataReq.password

        let loginSQL;
        loginSQL = "SELECT member_id As ID, first_name AS FirstName, last_name AS LastName, role AS Role FROM member "
        loginSQL += "WHERE member_id = '" + ID + "' AND pass_word = '" + PW + "'; "

        return db.query(loginSQL, callback);
    }
}

module.exports = user;