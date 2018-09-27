var R = require("js-call-r");
const chalk = require('chalk');
const getsName = require('../../service/predictions/group-prediction-service')
const groupPrediction = {
    predict: (data, res) => {


        console.log(chalk.magenta(JSON.stringify(data)))

        R.call(__dirname + './Rscript/predict-group.R', { data })
            .then(async (result) => {
                let datum = result.result[0]
                console.log(chalk.blue(JSON.stringify(datum)))
                res.json(datum);
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