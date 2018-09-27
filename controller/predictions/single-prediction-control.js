var R = require("js-call-r");
const chalk = require('chalk');
const prediction = {
    predict: (data,res) => {
        // let json = '[{"ID":"115830462007-8", "SUB_CPE":"CPE049"},{"ID":"115830462025-8", "SUB_CPE":"CPE078"}]';
        // obj = JSON.parse(data);

        console.log(chalk.yellow(JSON.stringify(data)))
        
        
        R.call(__dirname+'./Rscript/predict.R', {data})
        .then((result) => {
            console.log(chalk.blue(JSON.stringify(data)))
            res.json(result); 
            
        })
        .catch(err => {
            console.log('err = ', err);
            res.status(404);
            res.json(err);
        });
    }
}

module.exports = prediction;