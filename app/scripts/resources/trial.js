'use strict';

angular.module('mismatchResources').factory('trial', ['mouseTracking', '$q', '$timeout', '$http', function(mouseTracking, $q, $timeout, $http) {

  return function(spec) {
    var trial = {
      id: spec.id,
      experimentId: spec.experimentId,
      userId: spec.userId,
      type: spec.type || 'trial',
      images: [
        {
          'id': spec.id+'AA',
          'url': 'images/faces/'+spec.id+'AA.jpg',
          'show': false,
          'replace': false
        },
        {
          'id': spec.id+'BB',
          'url': 'images/faces/'+spec.id+'BB.jpg',
          'show': false,
          'replace': false
        }
      ],
      manipulated: spec.manipulated || false,
      onlyChoose: spec.onlyChoose || false,
      showScale: false,
      showStart: true,
      showFeedback: false,
      holdMouse: false,
      showButton: false,
      waiting: 0,
      data: {
        'tracking': null,
        'choice': null,
        'choiceId': null,
        'rating': null,
        'reason': null,
        'detected': null,
        'previous': null,
        'switched': false,
        'mouseOut': false,
        'timing': {
          'start': null,
          'choice': null,
          'feedback': null
        }
      },
      defer: $q.defer(),
      start: function() {
        mouseTracking.startTracking();
        trial.showStart = false;
        trial.showButton = true;
        //trial.waiting = 500;
        // Wait 500ms
        $timeout(function() {
          trial.toggleImages(true);
          trial.data.timing.start = window.performance.now();
          trial.waiting = 2600;
          // wait 2000ms + 600ms animation
          trial.holdMouse = true;
          $timeout(function() {
            trial.waiting = 0;
            trial.holdMouse = false;
            trial.showButton = false;
            trial.toggleImages(false);
          }, 2600);
        }, 500);

        return trial.defer.promise;
      },
      toggleImages: function(show) {
        trial.images[0].show = show;
        trial.images[1].show = show;
      },
      showImage: function(imageIndex) {
        trial.images[imageIndex].show = true;
      },
      backImage: (function() {
        if( Math.floor(Math.random() * 2) === 1 ) {
          return ['images/cardback2o.jpg', 'images/cardback1o.jpg'];
        }
        return ['images/cardback1o.jpg', 'images/cardback2o.jpg'];
      }()),
      choiceMade: function(choiceIndex, choiceID) {
        var results = mouseTracking.stopTracking();
        trial.data.timing.choice = window.performance.now() - trial.data.timing.start;

        trial.data.tracking   = angular.copy(results);
        trial.data.choice     = choiceIndex;
        trial.data.choiceId   = choiceID;

        trial.toggleImages(false);

        if(trial.onlyChoose) {
          trial.data.switched = (trial.data.previous != trial.data.choiceId);
          trial.finish();
          return true;
        }

        trial.showScale = true;
      },
      rate: function(rating) {
        trial.data.rating = rating;

        // Wait 7000 ms
        var waitingTime = 7000 - (window.performance.now() - trial.data.timing.choice);
        trial.waiting = waitingTime;

        $timeout(function() {
          if( !trial.manipulated ) {
            trial.showImage( trial.data.choice );
          }
          else {
            trial.images[ trial.data.choice ].url = trial.images[ (trial.data.choice === 1 ? 0 : 1) ].url;
            trial.showImage( trial.data.choice );
          }

          trial.showScale = false;
          trial.showFeedback = true;
          trial.waiting = 0;
        }, waitingTime);


      },
      replaceCards: function(replace) {
        trial.images[0].replace = replace;
        trial.images[1].replace = replace;
      },
      finish: function() {
        trial.waiting = 2000;
        trial.toggleImages(false);
        trial.replaceCards(true);

        // Wait 2000 ms
        $timeout( function() {
          trial.replaceCards(false);
          trial.defer.resolve(trial.data);
          trial.waiting = 0;
        }, 2000);
      },
      feedback: function(reason) {
        trial.data.timing.feedback = window.performance.now();
        trial.data.reason = reason;
        trial.data.detected = (reason === 'other' ? true : false);
        trial.finish();
      },
      save: function() {
        $http.post('/trials', trial).
          success(function(data) {
            console.log(data);
          }).
          error(function(data) {
            console.log(data);
          });
      }
    };
    var engine = Random.engines.mt19937().autoSeed();
    Random.shuffle( engine, trial.images );
    return trial;
  };

}]);
