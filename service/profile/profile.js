const db = require("../../config/dbconnection");
const createError = require('http-errors')
const Profile = {
  getProfile: (id, role, callback) => {
    let SQLTeacher;
    SQLTeacher = "SELECT teacher.teacher_id as TeacherID,CONCAT(teacher.first_name, ' ',teacher.last_name) ";
    SQLTeacher += "as Name, teacher.email_address as Email, teacher.role as Role,";
    SQLTeacher += "group_cpe.group_name as GroupName FROM teacher JOIN group_cpe ON teacher.teacher_id ";
    SQLTeacher += "= group_cpe.teacher_id WHERE teacher.teacher_id=" + "'" + id + "'";

    let SQLStudent;
    SQLStudent = "SELECT student.student_id AS StudentID, concat(student.first_name,' ',student.last_name) ";
    SQLStudent += "as Name, student.email_address AS Email, student.role AS Role, student.group_name AS GroupName, ";
    SQLStudent += "CONCAT(teacher.first_name, ' ', teacher.last_name) as TeacherName FROM student JOIN group_cpe ";
    SQLStudent += "ON student.group_name = group_cpe.group_name JOIN teacher ON teacher.teacher_id = group_cpe.teacher_id WHERE student.student_id =" + "'" + id + "'";


    let SQLAdmin;
    SQLAdmin = "SELECT admin_id AS AdminID, concat(first_name,' ',last_name) as Name, email_address ";
    SQLAdmin += "AS Email, role AS Role FROM admin WHERE admin_id =" + "'" + id + "'";

    if (role === "Student") {
      return db.query(SQLStudent, callback);
    } else if (role === "Teacher") {
      return db.query(SQLTeacher, callback);
    } else if (role === "Administrator") {
      return db.query(SQLAdmin, callback);
    } else {
      return callback(new createError(404));
    }
  },

  changeEmail: (data, callback) => {
    let emailSQL = ` 
    UPDATE student
    SET email_address = '${data.email}'
    WHERE student_id = '${data.ID}'
    `
    return db.query(emailSQL, callback)
  },

  changePassword:(data, callback) => {
    let emailSQL = `
    UPDATE student
    SET pass_word = '${data.password}'
    WHERE student_id = '${data.ID}'
    `
    return db.query(emailSQL, callback)
  }
};

module.exports = Profile;