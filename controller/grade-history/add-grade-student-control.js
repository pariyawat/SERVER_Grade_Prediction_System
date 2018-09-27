const grade = require('../../service/grade-history/about-grade');
const chalk = require('chalk');
import * as Rx from "rxjs";


 addGrade = (list, userID) => {
    let res = {
        success: 0,
        error: 0,
        errorItem:[],
        total: 0,
    };
    return new Promise((resolve, reject) => {

        // ตัวแปล Subject
        const subject = new Rx.Subject();

        list.forEach(item => {
            const sibjectID = item.subject_id || null;
            if (sibjectID !== null) {
                grade.addGrade(item, userID)
                    .then(response => {
                        if (response.affectedRows == 1) {
                            res.success++;
                            // ส่งข้อมูลให้ตัวแปล และส่งข้อมูลเข้าไป
                            subject.next(res);
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

        // รอฟังตัวแปลมีการเปลี่ยนแปลง
        subject.subscribe((res) => {
            res.total = list.length;
            resolve(res)
        });

        
       
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