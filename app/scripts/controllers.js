'use strict';

angular.module('mismatchControllers').controller('StartCtrl', ['$scope', function ($scope) {

  var mousePosition = {'x': 0, 'y': 0};

  // In ms
  var updatingFrequency = 17;

  $scope.calibration = function() {
    var delta = 0,
        deltaSum = 0,
        deltaSamples = 0;

    document.onmousemove = function(event) {
      delta = window.performance.now() - delta;

      if(delta < 1000) {
        deltaSum += delta;

        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;

        delta = window.performance.now();
        deltaSamples++;
      }

      if(deltaSamples >= 50) {
        document.onmousemove = null;

        updatingFrequency = deltaSum/deltaSamples;

        console.log('Updating frequency set to ' + updatingFrequency + ' ms (' + 1000/updatingFrequency + ' hz)');
        //alert(1000/updatingFrequency + ' hz');
      }

    };

  };

  $scope.startTracking = function() {
    var tracking,
        trackingData = '';

    document.onmousemove = function(event) {
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
    };

    tracking = setInterval(function () {
     trackingData += mousePosition.x + ', ' + mousePosition.y + ', ' + window.performance.now() + '\n';
    }, updatingFrequency);

    $scope.stopTracking = function() {
      console.log(trackingData);
      clearInterval(tracking);
      document.onmousemove = null;
    };

  };


}]);
