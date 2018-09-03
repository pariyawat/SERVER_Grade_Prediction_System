const predicService = require('../../service/predictions/single-prediction-service');
const singlePredict = {
    getSubject: (userID, res) => {

        predicService.getSubject(userID)
            .then((data) => {
                res.json(data);
            }).catch((err) => {
                res.status(500)
                res.json(err)
            })
    }
}
module.exports = singlePredict;