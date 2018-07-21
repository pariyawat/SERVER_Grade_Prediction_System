const predicService = require('../../../service/predictions/single/single-prediction-service');
const singlePredic = {
    getSubject: (callback) => {
            predicService.getSubject()
            .then((response)=>{
                // console.log(response)
                callback.status(200)
                callback.json(response);
            })
            .catch((error) => {
                // console.log(error)
                callback.status(500)
                callback.json(error)
            })

    }
}
module.exports = singlePredic;