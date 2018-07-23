const predicService = require('../../service/predictions/subject-prediction-service');
const singlePredict = {
    getSubject: (req, res) => {

        predicService.getSubject()
            .then((data) => {
                res.json(data);
            }).catch((err) => {
                res.status(500)
                res.json(err)
            })
    }
}
module.exports = singlePredict;