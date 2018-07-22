const predicService = require('../../../service/predictions/single/single-prediction-service');
const singlePredic = {
    getSubject: (callback) => {

        predicService.getSubject().then(data=>{
            callback.json(data);
        })
    }
}
module.exports = singlePredic;