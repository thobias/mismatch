angular.module('mismatchResources').factory('experiment', ['$http', 'trial', function($http, trial) {

  // Generate a trial
  var getTrial = function(id, manipulated) {
    return trial({
      'id': id,
      'userId': userId,
      'experimentId': experimentId,
      'manipulated': manipulated || false
    });
  };

  // Random number generator using Mersenne Twister algo
  var engine = Random.engines.mt19937().autoSeed();

  // Generate user and experiment id
  var userId = Date.now() + Random.uuid4(engine),
      experimentId = 2;

  // 8 potentially manipulated trials
  var available = [getTrial('006', true), getTrial('007', true), getTrial('008', true), getTrial('009', true), getTrial('010', true), getTrial('011', true), getTrial('012', true), getTrial('013', true)];
  // Pick 4 of them and shuffle the order
  var chosen = Random.shuffle( engine, Random.sample(engine, available, 4) );
  // 20 ordinary trials (non-manipulated) (four will get replaced with manipulated ones)
  var ordinaryTrials = [getTrial('014'), getTrial('015'), getTrial('016'), getTrial('017'), getTrial('018'), getTrial('019'), getTrial('020'), getTrial('021'), getTrial('022'), getTrial('023'), getTrial('024'), getTrial('025'), getTrial('026'), getTrial('027'), getTrial('028'), getTrial('029'), getTrial('030'), getTrial('031'), getTrial('032'), getTrial('033')];
  //var ordinaryTrials = [getTrial('014'), getTrial('015'), getTrial('016'), getTrial('017')];
  // Save a copy to be used in post trials
  var originalTrials = angular.copy(ordinaryTrials);
  // Shuffle the trials
  var trials = Random.shuffle(engine, ordinaryTrials);
  // Splice in our manipulated trials at random places but avoiding back-to-back manipulations
  var validIndexes = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
  $.each(chosen, function() {
    var index = Random.pick( engine, validIndexes );

    // Replace a normal trial with one of the manipulated ones
    trials.splice(index, 1, this);
    // Remove chosen index and the ones surrounding it from validIndexes
    // (ie. if the value 12 is chosen, remove 11, 12 and 13)

    // Remove the first two validIndexes if we chose the first index in validIndexes
    if(validIndexes.indexOf(index) === 0) {
      validIndexes.splice(0, 2);
      return;
    }

    // Remove the last two validIndexes if we chose the last index in validIndexes
    if(validIndexes.indexOf(index)+1 === validIndexes.length) {
      validIndexes.splice(-2, 2);
      return;
    }

    // Remove the chosen validIndex and the adjacent ones
    validIndexes.splice( validIndexes.indexOf(index), 1);
    validIndexes.splice( validIndexes.indexOf(index-1), 1);
    validIndexes.splice( validIndexes.indexOf(index+1), 1);

  });

  // Choose post-trials
  var postTrials = Random.sample( engine, originalTrials, 4);
  // Add chosen manipulated trials
  postTrials = postTrials.concat( chosen );
  // Create new objects for the trials to make sure they are not linked from before
  $.each(postTrials, function(i) {
    postTrials[i] = trial({
      'id': postTrials[i].id,
      'userId': postTrials[i].userId,
      'experimentId': postTrials[i].experimentId,
      'manipulated': postTrials[i].manipulated || false,
      'type': 'post',
      'onlyChoose': true
    });
  });
  // Shuffle
  postTrials = Random.shuffle( engine, postTrials );

  // Choose pre-trials
  //var preTrials = [getTrial('001'), getTrial('002'), getTrial('003'), getTrial('004'), getTrial('005')];
  var preTrials = [getTrial('001')];
  // Shuffle
  preTrials = Random.shuffle( engine, preTrials );

  var out = '';
  $.each(trials, function(i, trial) {
    out = out + i + ', ' + trial.id + ', ' + (trial.manipulated ? '1' : 0) + '\n';
  });
  console.log(out);

  // Complete experiment object
  var experiment = {
    'userId': userId,
    'experimentId': experimentId,
    'user': {
      'sex': 'female',
      'age': 25,
      'device': 'mouse',
      'devicePosition': 'right',
      'hand': 'right',
      'screen': {
        'width': screen.width,
        'height': screen.height
      }
    },
    'preTrials': preTrials,
    'trials': trials,
    'postTrials': postTrials,
    save: function() {
      $http.post('/experiments', experiment).
        success(function(data) {
          experiment._id = data._id;
          console.log(data);
        }).
        error(function(data) {
          console.log(data);
        });
    },
    finish: function() {
      var update = {
        'initialFeedback': experiment.initialFeedback,
        'noticed': experiment.noticed,
        'debriefedFeedback':experiment.debriefedFeedback
      };

      $http.put('/experiments/'+experiment._id, update).
        success(function(data) {
          console.log(data);
        }).
        error(function(data) {
          console.log(data);
        });
    }
  };
  console.log(experiment.trials.length);
  console.log(experiment.postTrials.length);
  console.log(experiment);
  return experiment;
}]);
