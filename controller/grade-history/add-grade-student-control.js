const grade = require('../../service/grade-history/about-grade');
const chalk = require('chalk');
const { Subject } = require('rxjs')




addGrade = (list, userID) => {
    let output = { error: [], success: [] }
    return new Promise((resolve, reject) => {

        // ตัวแปล Subject
        // const subject = new Subject();

        list.forEach(item => {
            const sibjectID = item.subject_id
            if (sibjectID) {
                grade.addGrade(item, userID)
                    .then(response => {
                        console.log(response)
                        if (response.affectedRows) {
                            output.success.push(item)
                        } else if (!response.affectedRows) {
                            output.error.push(item)
                        }
                    }).catch((error) => {
                        reject(error);
                    })
            }
        });

        setTimeout(() => {
            console.log(output)
            resolve(output)
        }, 500);
    })


}

const gradeHistory = {

    addGradeStudent: (data, userID, callback) => {
        addGrade(data, userID)
            .then((list) => {
                callback.status(200)
                callback.json(list);
            }).catch((error) => {
                callback.status(500)
                callback.json(error);
            });
    },
}


module.exports = gradeHistory;