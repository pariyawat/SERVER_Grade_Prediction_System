const gradeService = require('../../service/grade-history/about-grade');
const GradeControl = {
    editGrade: (data, res) => {
        gradeService.editGrade(data)
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