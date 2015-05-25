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
  'timesFeedback': String,
  'initialFeedback': String,
  'noticed': Boolean,
  'completed': Boolean,
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
  'target': Boolean,
  'type': String,
  'data': {
    'tracking': [
      {
        'x': String,
        'y': String,
        't': String
      }
    ],
    'detected': Boolean,
    'switched': Boolean,
    'choice': Number,
    'choiceId': String,
    'rating': Number,
    'reason': String,
    'mouseOut': Boolean,
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

var server = app.listen(8081, function() {
  mongoose.connect('mongodb://localhost/mismatch');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () { console.log('Yay'); });

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

/*
  Routes
*/

// Add new experiment
app.post('/experiments', function (req, res) {
  Experiment.create(req.body, function(err, newExperiment) {
    console.log(err);
    res.send(201, newExperiment);
  });
});

// Get experiment
app.get('/experiments/:id', function (req, res) {
  var id = req.params.id;
  Experiment.find({'experimentId': id, 'completed': true}, function(err, entity) {
    console.log(err);
    res.send(entity);
  });
});

app.get('/experiments/:id/trials', function (req, res) {
  var id = req.params.id;
  var out = "userId,id,x,y,t,manipulated,detected,switched,rating,rt,right,type,handedness,screenHeight,noticed,noticedNr\n";
  res.set({'Content-Disposition':'attachment; filename="allData.csv"'});

  Experiment.find({'experimentId': id}, function(err, experimentObj) {

    Trial.find({'experimentId': id, 'target': true}, function(err, trials) {
      trials.forEach(function(trial) {
        trial.data.tracking.forEach(function(row) {
          out = out + trial.userId + "," + trial.id + "," + row.x + "," + row.y + "," + row.t + "," + trial.manipulated + "," + trial.data.detected + "," + trial.data.switched + "," + trial.data.rating + "," + trial.data.timing.choice + "," + trial.data.choice + "," + trial.type + "," + experimentObj[0].user.hand + "," + experimentObj[0].user.screen.height + "," + experimentObj[0].noticed + "," + experimentObj[0].timesFeedback + "\n";
        });
      });
      res.send(out);
    });
  });

});

app.get('/experiments/:id/trials/:user', function (req, res) {
  var id = req.params.id;
  var user = req.params.user;
  var out = "userId,id,x,y,t,manipulated,detected,switched,rating,rt,right,type,handedness,screenHeight,noticed,noticedNr\n";
  res.set({'Content-Disposition':'attachment; filename="'+user+'.csv"'});

  Experiment.find({'experimentId': id, 'userId': user, 'completed': true}, function(err, experimentObj) {

    Trial.find({'experimentId': id, 'target': true, 'userId': user}, function(err, trials) {
      trials.forEach(function(trial) {
        trial.data.tracking.forEach(function(row) {
          //if(row.t > 3700) {
            out = out + trial.userId + "," + trial.id + "," + row.x + "," + row.y + "," + row.t + "," + trial.manipulated + "," + trial.data.detected + "," + trial.data.switched + "," + trial.data.rating + "," + trial.data.timing.choice + "," + trial.data.choice + "," + trial.type + "," + experimentObj[0].user.hand + "," + experimentObj[0].user.screen.height + "," + experimentObj[0].noticed + "," + experimentObj[0].timesFeedback + "\n";
          //}
        });
      });

      res.send(out);

    });
  });

});

// Update experiment
app.put('/experiments/:id', function (req, res) {
  var id = req.params.id;

  req.body.updatedAt = Date.now();
  console.log(req.body);

  Experiment.findByIdAndUpdate(id, req.body, function(err, entity) {
    console.log(err);
    res.status(200).send(entity);
  });

});

// Get user with experiment and all trials
app.get('/users/:id', function (req, res) {
  var id = req.params.id;

  Experiment.find({'userId': id}, function(err, experiment) {
    //console.log(err);
    res.send(experiment);
  });

});

app.get('/trials/:id', function(req, res) {
  var id = req.params.id;

  Trial.find({'userId': id, 'target': true, 'data.mouseOut': false}, function(err, trials) {
    //console.log(err);
    res.send(trials);
  });
});

// Add new trial
app.post('/trials', function (req, res) {
  console.log(req.body);
  var myTrial = new Trial(req.body);

  myTrial.save(function(err, newTrial) {
    //console.log(err);
    res.status(201).send(newTrial);
  });

});
