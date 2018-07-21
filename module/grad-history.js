const grade = require('../service/grade-history/about-grade');


async function addGrade(list) {
    return new Promise((resolve, reject) => {

        const res = {
            success: 0,
            error: 0,
            total: 0,
        };

        list.forEach(item => {
            const id = item.subject_id || null;
            if (id !== null) {
                grade.addGrade(item).then(response => {
                    res.success++;
                })
            } else {
                res.error++;
               
            }
        })

        res.total = list.length;
        resolve(res)

    })
}

const gradeHistory = {

    addGradeStudent: async (data, callback) => {

        addGrade(data).then(list => {
            // console.log(list)
            callback.status(200)
            callback.json(list);
        }).catch((error)=>{
            callback.status(500)
            callback.json(error);
        });


    },

}

module.exports = gradeHistory;