var R = require("js-call-r");
const groupPrediction = {
    predict: (data, res) => {


        console.log('>>>>>>'+JSON.stringify(data)) 
        
        // R.call(__dirname+'./Rscript/predict.R', {data})
        // .then((result) => {
        //     console.log(JSON.stringify(result));
        //     res.json(result); 
            
        // })
        // .catch(err => {
        //     console.log('err = ', err);
        //     res.status(404);
        //     res.json(err);
        // });
    }
}

module.exports = groupPrediction;