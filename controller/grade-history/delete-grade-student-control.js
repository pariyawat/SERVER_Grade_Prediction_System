const gradeService = require('../../service/grade-history/about-grade');
const studentDeleteGrade = {
    deleteGrade: (data, res) => {
        gradeService.deleteGrade(data)
            .then((response) => {
                res.status(200)
                res.json(response)
            })
            .catch((error) => {
                res.status(500)
                res.json(error);
            })
    }
}

module.exports = studentDeleteGrade;