var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//object data modeling (ODM) library that provides a modeling environment for mongodb
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//requires MongoDB
var MongoClient = require('mongodb').MongoClient;
//specifies MongoDB path
var url = "mongodb://localhost:27017/";

//connects to MongoDB
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  //specifies db
  var dbo = db.db("assignment");
  //array of objects to insert
  var myobj = [
    {ename: 'Walter', department: 'Support Staff', designation: 'IT', dateofjoining: new Date('01-01-2015'), city: 'Washington DC', salary: 50000},
    {ename: 'Zach', department: 'Support Staff', designation: 'IT', dateofjoining: new Date('01-01-2016'), city: 'Washington DC', salary: 40000},
    {ename: 'Rob', department: 'Support Staff', designation: 'IT', dateofjoining: new Date('01-01-2016'), city: 'Washington DC', salary: 40000},
    {ename: 'Will', department: 'Management Staff', designation: 'Demo Manager', dateofjoining: new Date('01-01-2014'), city: 'Washington DC', salary: 50000},
    {ename: 'Forrest', department: 'Management Staff', designation: 'Outosourcing Manager', dateofjoining: new Date('01-01-2018'), city: 'Washington DC', salary: 40000}
    ];
  //specifies collection
  dbo.collection("employees").insertMany(myobj, function(err, res) {
    if (err) throw err;
    //logs number of documents inserted to console
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
//deletes documents in the collection where designation = 'Developer'
  var myquery = { designation: 'Developer' };
    dbo.collection("employees").deleteMany(myquery, function(err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " document(s) deleted");
      db.close();
    });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
