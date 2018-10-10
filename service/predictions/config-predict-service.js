const db = require('../../config/dbconnection');
const configPredict = {
    getConfig: (callback) => {

        getSQL = `SELECT * FROM asso_config WHERE config_id = '1'`
        return db.query(getSQL, callback)

    },
    editConfig: (data, callback) => {
        console.log(data)
        editSQL = ` UPDATE asso_config 
        SET support = '${data.support}' ,confidence = '${data.confidence}'
        WHERE config_id = '${data.config_id}'`
        return db.query(editSQL, callback)
    }
}

module.exports = { configPredict }