angular.module('mismatchResources').factory('experiment', ['$http', 'trial', function($http, trial) {

  // Generate a trial
  var getTrial = function(id, target) {
    return trial({
      'id': id,
      'userId': userId,
      'experimentId': experimentId,
      'target': target || false,
      'manipulated': false
    });
  };

  // Random number generator using Mersenne Twister algo
  var engine = Random.engines.mt19937().autoSeed();

  // Generate user and experiment id
  var userId = Date.now() + Random.uuid4(engine),
      experimentId = 2015042002;

  // 12 potentially manipulated trials in pairs (targets)
  var pairs1 = [getTrial('024', true), getTrial('006', true), getTrial('047', true), getTrial('0015', true), getTrial('049', true), getTrial('011', true)];
  var pairs2 = [getTrial('027', true), getTrial('005', true), getTrial('038', true), getTrial('0019', true), getTrial('048', true), getTrial('009', true)];
  var manipulatedTargets = [];
  var nonManipulatedTargets = [];

  // Set one in the pair as manipulated and the other not
  $.each(pairs1, function(i) {
    this.manipulated = Random.bool()(engine);
    pairs2[i].manipulated = !this.manipulated;

    manipulatedTargets.push( (this.manipulated ? this : pairs2[i]) );
    nonManipulatedTargets.push( (!this.manipulated ? this : pairs2[i]) );
  });

  // Mash together
  targets = pairs1.concat( pairs2 );

  // 24 ordinary trials (non-manipulated)
  var ordinaryTrials = [getTrial('001'), getTrial('002'), getTrial('003'), getTrial('013'), getTrial('008'), getTrial('007'), getTrial('020'), getTrial('021'), getTrial('022'), getTrial('004'), getTrial('025'), getTrial('012'), getTrial('028'), getTrial('031'), getTrial('032'), getTrial('033'), getTrial('034'), getTrial('036'), getTrial('037'), getTrial('040'), getTrial('042'), getTrial('043'), getTrial('044'), getTrial('046')];

  // Add non-manipulated targets to ordinary trials
  ordinaryTrials = ordinaryTrials.concat( nonManipulatedTargets );

  // Shuffle the trials
  var trials = Random.shuffle(engine, ordinaryTrials);
  manipulatedTargets = Random.shuffle(engine, manipulatedTargets);

  // Temporary emtpy array for spreading manipulated trials
  var temp = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];

  // Splice in our manipulated trials at random places but avoiding back-to-back manipulations in the temp array
  var validIndexes = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
  $.each(manipulatedTargets, function() {
    var index = Random.pick( engine, validIndexes );

    // Replace a normal trial with one of the manipulated ones
    temp.splice(index, 1, this);
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

  // Merge the temp array with trials
  $.each(temp, function(i) {
    if(temp[i] !== null) {return;}
    temp[i] = trials.shift();
  });

  // Set our, now filled, temp array as trials
  trials = temp;

  // Choose post-trials (targets)
  var postTrials = angular.copy(targets);

  // Create new objects for the trials to make sure they are not linked from before
  $.each(postTrials, function(i) {
    postTrials[i] = trial({
      'id': postTrials[i].id,
      'userId': postTrials[i].userId,
      'experimentId': postTrials[i].experimentId,
      'manipulated': postTrials[i].manipulated || false,
      'type': 'post',
      'onlyChoose': true,
      'target': postTrials[i].target
    });
  });
  // Shuffle
  postTrials = Random.shuffle( engine, postTrials );

  // Choose pre-trials
  var preTrials = [getTrial('050'), getTrial('051'), getTrial('052')];

  // Shuffle
  preTrials = Random.shuffle( engine, preTrials );

  var out = '';
  $.each(trials, function(i, trial) {
    out = out + i + ', ' + trial.id + ', ' + (trial.target ? '1' : 0) + ' ' + (trial.manipulated ? '1' : 0) + '\n';
  });
  console.log(out);

  var out = '';
  $.each(postTrials, function(i, trial) {
    out = out + i + ', ' + trial.id + ', ' + (trial.target ? '1' : 0) + ' ' + (trial.manipulated ? '1' : 0) + '\n';
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
        'timesFeedback':experiment.debriefedFeedback,
        'completed': true
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
