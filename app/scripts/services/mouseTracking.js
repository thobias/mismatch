'use strict';

angular.module('mismatchServices').factory('mouseTracking', [function () {

    return {
      position: {
        'x': 0,
        'y': 0
      },
      updatingFrequency: 17,
      calibration: function() {

      },
      startTracking: function() {

      },
      stopTracking: function() {

      }
    };

  }
]);
