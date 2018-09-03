const grade = require('../../service/grade-history/about-grade');
const chalk = require('chalk');


const addGrade = (list, userID) => {
    return new Promise((resolve, reject) => {

        let res = {
            success: 0,
            error: 0,
            errorItem:[],
            total: 0,
        };

        list.forEach(item => {
            const sibjectID = item.subject_id || null;
            if (sibjectID !== null) {
                grade.addGrade(item, userID)
                    .then(response => {
                        if (response.affectedRows == 1) {
                            res.success++;
                        } else if (response.affectedRows == 0) {
                            res.error++;
                            res.errorItem.push(sibjectID)
                        }
                    }).catch((error) => {
                        reject(error);
                    })
            } else {
                res.error++;
            }
        });

        res.total = list.length;
        console.log(res)
        setTimeout(() => {
            resolve(res)
            // console.log(res)
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