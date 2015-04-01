var express = require('express')
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    fs = require('fs');

// Experiment
var experimentSchema = new mongoose.Schema({
  'userId': String,
  'experimentId': String,
  'debriefedFeedback': String,
  'initialFeedback': String,
  'noticed': Boolean,
  'user': {
    'sex': String,
    'age': Number,
    'device': String,
    'devicePosition': String,
    'hand': String,
    'screen': {
      'width': Number,
      'height': Number
    },
  },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});
var Experiment = mongoose.model('Experiment', experimentSchema);

// Trial
var trialSchema = new mongoose.Schema({
  'id': Number,
  'userId': String,
  'experimentId': String,
  'manipulated': Boolean,
  'type': String,
  'data': {
    'tracking': {},
    'detected': Boolean,
    'choiceId': String,
    'rating': Number,
    'reason': String,
    'timing': {
      'start': Number,
      'choice': Number,
      'feedback': Number
    }
  },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});
var Trial = mongoose.model('Trial', trialSchema);

// Server
app.use(express.static('app'));
app.use(bodyParser.json({'limit': '50mb'}));

var server = app.listen(3000, function() {
  mongoose.connect('mongodb://localhost/mismatch');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () { console.log('Yay'); });

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// Add new experiment
app.post('/experiments', function (req, res) {
  Experiment.create(req.body, function(err, newExperiment) {
    console.log(err);
    res.send(201, newExperiment);
  });
});

app.put('/experiments/:id', function (req, res) {
  var id = req.params.id;

  req.body.updatedAt = Date.now();

  Experiment.findByIdAndUpdate(id, req.body, function(err, entity) {
    console.log(err);
    res.status(200).send(entity);
  });

});

// Add new trial
app.post('/trials', function (req, res) {
  console.log(req.body);
  var myTrial = new Trial(req.body);

  myTrial.save(function(err, newTrial) {
    console.log(err);
    res.status(201).send(newTrial);
  });

});
