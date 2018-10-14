var R = require("js-call-r");
const chalk = require('chalk');

const groupPrediction = {
    predict: (data, res) => {


        console.log(chalk.magenta(JSON.stringify(data)))

        R.call(__dirname + './Rscript/predict-group.R', { data })
            .then(async (result) => {
                let datum = result.result
                console.log(chalk.blue(JSON.stringify(datum)))
                res.json(datum);
            })
            .catch(err => {
                console.log('err = ', err);
                res.status(500);
                res.json(err);
            });
    },
    poltGraph: (data, res) => {


        R.call(__dirname + './Rscript/plot-graph.R',  { data })
            .then(async (result) => {
                console.log(chalk.yellow(JSON.stringify(result.result)))
                res.json(result.result);
            })
            .catch(err => {
                console.log('err = ', err);
                res.status(500);
                res.json(err);
            });

    }
}


module.exports = groupPrediction;