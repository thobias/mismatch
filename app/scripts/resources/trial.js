'use strict';

angular.module('mismatchResources').factory('trial', ['mouseTracking', '$q', '$timeout', function(mouseTracking, $q, $timeout) {

  return function(spec) {
    var trial = {
      id: spec.id,
      images: [
        {
          'url': spec.image1,
          'show': false,
          'replace': false
        },
        {
          'url': spec.image2,
          'show': false,
          'replace': false
        }
      ],
      manipulated: spec.manipulated || false,
      onlyChoose: spec.onlyChoose || false,
      showScale: false,
      showStart: true,
      showFeedback: false,
      waiting: 0,
      data: {
        'tracking': null,
        'choice': null,
        'rating': null,
        'reason': null,
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
        //trial.waiting = 500;
        // Wait 500ms
        $timeout(function() {
          trial.toggleImages(true);
          trial.data.timing.start = window.performance.now();
          //trial.waiting = 2600;
          // wait 2000ms + 600ms animation
          mouseTracking.startKillMouse();
          $timeout(function() {
            //trial.waiting = 0;
            mouseTracking.stopKillMouse();
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
      choiceMade: function(choiceIndex) {
        var results = mouseTracking.stopTracking();
        trial.data.timing.choice = window.performance.now();

        trial.data.tracking   = angular.copy(results);
        trial.data.choice     = choiceIndex;

        trial.toggleImages(false);

        if(trial.onlyChoose) {
          trial.finish();
          return true;
        }

        trial.showScale = true;
      },
      rate: function(rating) {
        trial.data.rating = rating;

        // Wait 7000 ms
        var waitingTime = 7000 -  (window.performance.now() - trial.data.timing.choice);
        trial.waiting = waitingTime;

        $timeout(function() {
          if( !trial.manipulated ) {
            trial.showImage( trial.data.choice );
          }
          else {
            trial.images[ trial.data.choice ].url = trial.images[ (trial.data.choice === 1 ? 0 : 1) ].url;
            console.log(trial);
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
        trial.finish();
      }
    }
    return trial;
  };

}]);
