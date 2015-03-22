angular.module('mismatchResources').factory('experiment', [function() {

  // Generate a trial
  var trial = function(id, manipulated) {
    return {
      'id': id,
      'image1': 'images/faces/'+id+'AA.jpg',
      'image2': 'images/faces/'+id+'BB.jpg',
      'manipulated': manipulated || false
    };
  };

  // Random number generator using Mersenne Twister algo
  var engine = Random.engines.mt19937().autoSeed();
  // 8 potentially manipulated trials
  var available = [trial('006', true), trial('007', true), trial('008', true), trial('009', true), trial('010', true), trial('011', true), trial('012', true), trial('013', true)];
  // Pick 4 of them and shuffle the order
  var chosen = Random.shuffle( engine, Random.sample(engine, available, 4) );
  // 16 ordinary trials (non-manipulated)
  var ordinaryTrials = [trial('014'), trial('015'), trial('016'), trial('017'), trial('018'), trial('019'), trial('020'), trial('021'), trial('022'), trial('023'), trial('024'), trial('025'), trial('026'), trial('027'), trial('028'), trial('029')];
  // Shuffle the trials
  var trials = Random.shuffle(engine, angular.copy(ordinaryTrials));
  // Splice in our manipulated trials at random places but avoiding back-to-back manipulations
  var validIndexes = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  $.each(chosen, function() {
    var index = Random.pick( engine, validIndexes );
    trials.splice(index, 0, this);
    // Remove chosen index and the ones surrounding it from validIndexes
    // (ie. if the value 12 is chosen, remove 11, 12 and 13)
    validIndexes.splice( validIndexes.indexOf(index) - 1, 3);
  });

  // Choose post-trials
  var postTrials = Random.sample( engine, ordinaryTrials, 4);
  // Add chosen manipulated trials
  postTrials = postTrials.concat(chosen);
  // Shuffle
  postTrials = Random.shuffle( engine, postTrials );

  // Choose pre-trials
  var preTrials = [trial('001'), trial('002'), trial('003'), trial('004'), trial('005')];
  // Shuffle
  preTrials = Random.shuffle( engine, preTrials );

  // Complete experiment object
  var experiment = {
    'userId': Date.now() + Random.uuid4(engine),
    'experimentId': 1,
    'user': {
      'sex': 'male',
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
    'postTrials': postTrials
  };
  console.log(experiment);
  return experiment;
}]);
