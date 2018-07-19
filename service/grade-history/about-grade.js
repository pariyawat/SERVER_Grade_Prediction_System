const db = require('../../config/dbconnection');
const aboutGrade = {
    addGradeStudent: (data, callback) => {
        console.log(">>>>>>>>>>>>>>>",data);
        return callback("Callback");
    }

}

module.exports = aboutGrade;