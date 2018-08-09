const R = require("r-script");
const prediction = {
    predict: () => {
        let out = R("ex-r.R")
            .data()
            .callSync()
        console.log('---------------------' + out);
        return out
    }
}

module.exports = prediction;