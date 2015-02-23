'use strict';

angular.module('mismatchServices').factory('mouseTracking', ['$q', function($q) {

  var tracker = {
    position: {
      'x': 0,
      'y': 0
    },
    trackingTimer: null,
    trackingData: "",
    updatingFrequency: 17.0,
    setUpdatingFrequency: function(updatingFrequency) {
      tracker.updatingFrequency = updatingFrequency;
      return tracker.updatingFrequency;
    },
    calibration: function() {
      var deltaTime = 0,      // Time between (deltas) updates in ms
          deltaTimeSum = 0,   // Sum of all sampled deltas
          deltaSamples = 0,   // Number of sampled deltas
          defer = $q.defer();

      document.onmousemove = function(event) {
        // Calculate delta
        deltaTime = window.performance.now() - deltaTime;

        // Remove deltas above one second
        if(deltaTime < 1000) {
          deltaTimeSum += deltaTime;

          // Mock processing
          tracker.position.x = event.clientX;
          tracker.position.y = event.clientY;

          deltaTime = window.performance.now();
          deltaSamples++;
        }

        // Stop calibration after 50 samples
        if(deltaSamples >= 50) {
          document.onmousemove = null;
          // Caclulate mean delta and return
          defer.resolve( deltaTimeSum/deltaSamples );
        }

      };

      return defer.promise;
    },
    startTracking: function() {
      console.log('Tracking at ' + 1000/tracker.updatingFrequency + ' hz');

      document.onmousemove = function(event) {
        tracker.position.x = event.clientX;
        tracker.position.y = event.clientY;
      };

      tracker.trackingTimer = setInterval(function () {
        tracker.trackingData += tracker.position.x + ', ' + tracker.position.y + ', ' + window.performance.now() + '\n';
      }, tracker.updatingFrequency);

    },
    stopTracking: function() {
      tracker.result        = tracker.trackingData;
      tracker.trackingData  = "";

      clearInterval(tracker.trackingTimer);
      document.onmousemove = null;

      return tracker.result;
    }
  };

  return tracker;


}]);
