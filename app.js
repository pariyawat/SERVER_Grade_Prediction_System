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
const predictionRouter = require('./routes/predictions/single-prediction-router');

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
app.use((req, res, next) => {
  auth.verifyToken(req.headers['authorization'], next);
  next();
})


app.use('/api/subject', subjectRouter);
app.use('/api/profile', profileRouter.getProfile);
app.use('/api/profile/change-email', profileRouter.changeEmail);
app.use('/api/grade-history/student/', gradeHistoryRouter.getGrade);
app.use('/api/grade-history/student/add', gradeHistoryRouter.addGrade);
app.use('/api/grade-history/student/delete', gradeHistoryRouter.deleteGrade);
app.use('/api/grade-history/student/edit', gradeHistoryRouter.editGrade);
app.use('/api/subject-prediction', predictionRouter.getGrade);
app.use('/api/student-prediction', predictionRouter.prediction);

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