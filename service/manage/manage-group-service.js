const db = require('../../config/dbconnection');

const manageGroup = {
    addGroup: (data, callback) => {
        const SQL = `INSERT INTO group_cpe(group_name, teacher_key)
        VALUES('${data.groupName}', '${data.teacher_key}');`

        return db.query(SQL, callback)
    },

    getGroup: (callback) => {
        const getSQL = `
        SELECT GP.group_name AS group_name, TC.teacher_key AS teacher_key, CONCAT(TC.first_name, ' ', TC.last_name ) AS teacher_name
        FROM group_cpe GP LEFT JOIN teacher TC  ON GP.teacher_key = TC.teacher_key`

        return db.query(getSQL, callback)
    },

    deleleGroup: (group_name, teacher_key, callback) => {

        delSQL = `DELETE FROM group_cpe WHERE group_name = '${group_name}' AND teacher_key = '${teacher_key}';`
        return db.query(delSQL, callback)
    },

    editGroup: (data, callback) => {

        editSQL = `
        UPDATE group_cpe
        SET group_name = '${data.group_name}', teacher_key = '${data.teacher_key}'
        WHERE group_name = '${data.group_oldname}' AND teacher_key = '${data.teacher_oldkey}'`
        return db.query(editSQL, callback)
    },

}


module.exports = { manageGroup }