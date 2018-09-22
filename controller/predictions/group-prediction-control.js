var R = require("js-call-r");
const getsName = require('../../service/predictions/group-prediction-service')
const groupPrediction = {
    predict: async (data, res) => {


        console.log('>>>>>>' + JSON.stringify(data))

        let stdID = new Array
        let sss

      await  R.call(__dirname + './Rscript/predict-group.R', { data })
            .then((result) => {

                let data = result.result[0]
                sss = data
                res.json(data);

            })
            .catch(err => {
                console.log('err = ', err);
                res.status(404);
                res.json(err);
            });
    }
}

// const getName = {
//     getStdName: (id) => {
//         return getsName.getStdName(id)
//     }
// }


module.exports = groupPrediction;