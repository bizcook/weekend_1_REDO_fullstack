//server application
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var employees = require('./routes/employees');

//add additional routes to new modules here as variables

var app = express();

var port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/employees', employees);

var connectionString;

//figuring out which connection to use. local database or heroku
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/forms';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS employees (' +
                              'id SERIAL PRIMARY KEY,' +
                              'first_name varchar(30) NOT NULL,' +
                              'last_name varchar(30) NOT NULL,'+
                              'employee_id int NOT NULL,' +
                              'job_title varchar(30) NOT NULL,'+
                              'salary int NOT NULL);'
    );

    query.on('end', function(){
      console.log('Successfully ensured schema exists');
      done();
    });

    query.on('error', function(error) {
      console.log('Error creating schema!', error);
      //TODO exit(1)
      done();
    });
  }
});



app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename));
});

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
