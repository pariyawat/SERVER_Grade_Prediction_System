const db = require('../../config/dbconnection');


const manageAdmin = {
    getAdmin: (admin_id, callback) => {
        const getSQL = ` SELECT admin_id, first_name, last_name, email_address FROM admin WHERE admin_id = '${admin_id}'`

        return db.query(getSQL, callback)
    },
    editAdmin: (data, callback) => {

        editSQL = `UPDATE admin 
        SET admin_id = '${data.admin_id}', first_name = '${data.first_name}', last_name = '${data.last_name}', email_address = '${data.email_address}'
        WHERE admin_id = '${data.admin_ido}'`
        return db.query(editSQL, callback)
    },

    changePassAdmin: (data, callback) => {
        changeSQL = `UPDATE admin 
            SET pass_word = '${data.passwordControl}'
            WHERE admin_id = '${data.admin_id}'`
        return db.query(changeSQL, callback)
    }
}

module.exports = { manageAdmin }

