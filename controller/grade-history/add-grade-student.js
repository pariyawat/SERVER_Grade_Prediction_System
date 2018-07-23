const grade = require('../../service/grade-history/about-grade');


const addGrade = async (list) => {

    return await new Promise((resolve, reject) => {

        let res = {
            success: 0,
            error: 0,
            total: 0,
        };

        list.forEach(item => {
            const id = item.subject_id || null;
            if (id !== null) {
                grade.addGrade(item)
                    .then(response => {
                        if (response.affectedRows == 1) {
                            res.success++;
                            console.log('success---------->' + res.success)
                        } else if (response.affectedRows == 0) {
                            res.error++;
                            console.log('err ------------->' + res.error)
                        }
                    }).catch((error) => {
                        reject(error);
                    })
            } else {
                res.error++;
            }
        });

        res.total = list.length;

        setTimeout(() => {
            console.log(res)
            resolve(res)
        }, 500);
    })


}

const gradeHistory = {

    addGradeStudent: (data, callback) => {
        addGrade(data)
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