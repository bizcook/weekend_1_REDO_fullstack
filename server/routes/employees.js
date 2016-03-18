var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var employees = express.Router();
var pg = require('pg');
var app = express();

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/forms';
}


employees.put('/', function(req, res) {
  console.log('body: ', req.body);
  var employee = req.body.id;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('INSERT INTO employees (first_name, last_name, employee_id, job_title, salary) VALUES ($1, $2, $3, $4, $5) ' +
                                'RETURNING id, first_name, last_name, employee_id, job_title, salary', [first_name, last_name, employee_id, job_title, salary]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

employees.post('/', function(req, res) {
  console.log('body: ', req.body);
  var first_name = req.body.employeeFirst;
  var last_name = req.body.employeeLast;
  var employee_id = req.body.employeeID;
  var job_title = req.body.jobTitle;
  var salary = req.body.salary;

  //connect to the database
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO employees (first_name, last_name, employee_id, job_title, salary) VALUES ($1, $2, $3, $4, $5) ' +
                                'RETURNING id, first_name, last_name, employee_id, job_title, salary', [first_name, last_name, employee_id, job_title, salary]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

employees.get('/', function(req, res) {

  var first_name = req.body.employeeFirst;
  var last_name = req.body.employeeLast;
  var employee_id = req.body.employeeID;
  var job_title = req.body.jobTitle;
  var salary = req.body.salary;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('SELECT * FROM employees ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


//this prepares it to be brought over to the server app.js
module.exports = employees;
