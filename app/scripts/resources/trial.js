'use strict';

angular.module('mismatchResources').factory('trial', ['mouseTracking', function(mouseTracking) {

  return function(spec) {
    return {
      id: spec.id,
      images: [
        {
          'url': spec.image1,
          'show': false
        },
        {
          'url': spec.image2,
          'show': false
        },
      ],
      mainpulate: spec.manipulate,
      waiting: false,
      showScale: true,
      data: {},
      toggleImages: function(show) {
        images[0].show = show;
        images[1].show = show;
      },
      showImage: function(imageIndex) {
        images[imageIndex].show = true;
      },
      start: function() {
        trial.toggleImages(true);
      },
      startChoice: function() {
        // Wait 2s
        trial.waiting = true;
        mouseTracking.startTracking();
      },
      choiceMade: function(choiceIndex) {
        var results = mouseTracking.stopTracking();

        trial.data.tracking   = angular.copy(results);
        trial.data.choice     = choiceIndex;

        trial.toggleImages(false);
        trial.showScale = true;
      },
      rate: function(rating) {
        trial.data.rating = rating;

        if( !tracking.manipulated ) {
          showImage( trial.data.image );
        }

      }
    }
  };

}]);


var showImage = function(image) {

};

var rate = function(rating) {
  $scope.experiment.data[$scope.trial].rating = rating;
  showImage( $scope.experiment.data[$scope.trial].choice );
};

var showScale = function() {
  $scope.showScale = true;
  $scope.rate = rate(rating);

};

var choiceMade = function(choice) {
  var results = mouseTracking.stopTracking();
  $scope.experiment.data[$scope.trial].tracking = angular.copy(results);
  $scope.experiment.data[$scope.trial].choice = choice;
  flipImages().then(showScale);
};

var choice = function() {
  mouseTracking.startTracking;
  // Wait
  $scope.choiceMade = choiceMade(choice);
};

var startTrial = function() {
  // Wait
  flipImages().then(choice);

};