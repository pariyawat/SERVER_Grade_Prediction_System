const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const auth = require('./auth/autentication');
const loginRouter = require('./routes/login/login_rout');
const subjectRouter = require('./routes/subjects/subjects');
const profileRouter = require('./routes/profile/profile');
const gradeHistoryRouter = require('./routes/grade-history/grade-history-router');
const gradeHistoryTeacherRouter = require('./routes/grade-history/grade-history-teacher-router');
const singlePredictRouter = require('./routes/predictions/single-prediction-router');
const groupPredictRouter = require('./routes/predictions/group-prediction-router');
const manageTeacherRouter = require('./routes/manage/manage-tacher-router')
const manageGroupRouter = require('./routes/manage/manage-group-router')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/login', loginRouter);

// ตรวจ Token
// app.use((req, res, next) => {
//   auth.verifyToken(req.headers['authorization'], next);
//   next();
// })


app.use('/api/subject', subjectRouter);
app.use('/api/profile', profileRouter.getProfile);
app.use('/api/profile/change-email', profileRouter.changeEmail);
app.use('/api/profile/change-password', profileRouter.changePass);

app.use('/api/grade-history/student/', gradeHistoryRouter.getGrade);
app.use('/api/grade-history/student/add', gradeHistoryRouter.addGrade);
app.use('/api/grade-history/student/delete', gradeHistoryRouter.deleteGrade);
app.use('/api/grade-history/student/edit', gradeHistoryRouter.editGrade);
app.use('/api/grade-history/teacher/add', gradeHistoryTeacherRouter.teacherAddrade);
app.use('/api/grade-history/teacher/edit', gradeHistoryTeacherRouter.teacherEditGrade)
app.use('/api/grade-history/teacher/delete', gradeHistoryTeacherRouter.teacherDeleteGrade);

app.use('/api/prediction/single/get-subject', singlePredictRouter.getSubject);
app.use('/api/prediction/single/std-predict', singlePredictRouter.prediction);
app.use('/api/prediction/group/get-group', groupPredictRouter.getGroup);
app.use('/api/prediction/group/get-student', groupPredictRouter.getStudent);
app.use('/api/prediction/group/get-subject', groupPredictRouter.getSubject);
app.use('/api/prediction/group/prediction', groupPredictRouter.prediction);

app.use('/api/manage/teacher', manageTeacherRouter.getTeacher);
app.use('/api/manage/teacher/add', manageTeacherRouter.addTeacher);
app.use('/api/manage/teacher/change-pass', manageTeacherRouter.changePass);
app.use('/api/manage/teacher/edit', manageTeacherRouter.editTeacher);
app.use('/api/manage/teacher/delete', manageTeacherRouter.deleteTeacher);
app.use('/api/manage/group', manageGroupRouter.getGroup);
app.use('/api/manage/group/add', manageGroupRouter.addGroup);
app.use('/api/manage/group/delete', manageGroupRouter.deleteGroup);
app.use('/api/manage/group/edit', manageGroupRouter.editGroup);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;