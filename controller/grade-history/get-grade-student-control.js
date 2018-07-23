const gradeService = require('../../service/grade-history/about-grade');
const GradeControl = {
    getGrade: (id, res) => {
        gradeService.getGrade(id)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(500)
                res.json(error);
            });
    }
}
module.exports = GradeControl;