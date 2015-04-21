'use strict';

angular.module('mismatchControllers')
  .controller('StartCtrl', ['$rootScope', 'experiment', function($rootScope, experiment) {
    $rootScope.experiment = experiment;
  }])
  .controller('TrialCtrl', ['$scope', function($scope) {
    var saved = false,
        started = false;

    var getTrial = function(index) {
      return $scope.experiment.trials[index] || false;
    };

    var startTrial = function() {

      if(!saved) {
        $scope.experiment.save();
        saved = true;
      }

      if(started) { return; }

      started = true;

      $scope.trial.start().then(function(data) {
        $scope.trial.data = data;
        $scope.trial.save();
        $scope.currentTrialIndex++;

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;
          started = false;
          return true;
        }

        $scope.trial = getTrial($scope.currentTrialIndex);
        started = false;
      });

    };

    $scope.currentTrialIndex  = 0;
    $scope.trial              = getTrial($scope.currentTrialIndex);
    $scope.startTrial         = startTrial;
    $scope.finished           = false;

    $scope.$on('mouseOut',function() {
      $scope.trial.data.mouseOut = true;
    });

  }])
  .controller('ViewDataCtrl', ['$scope', function($scope) {
    $scope.input = '';
    $scope.result = '';

    $scope.process = function() {
      var experiments = JSON.parse($scope.input);
      var result = 'x, y, t, rt, r, tid, eid, m, d\n';

      $.each(experiments, function() {

        var experiment = this;

        $.each(experiment.postTrials, function() {
          var trial = this;
          if(trial.id !== 2) {
            return;
          }
          var rows = trial.data.tracking.split('\n');

          var firstTime = false;
          var firstX = false;
          var firstY = false;

          $.each(rows, function() {
            var column = this.split(', ');

            firstTime = firstTime ? firstTime : column[2];

            // 500ms delay, 600ms animation, 2000 ms dislay time, 600ms animation
            if(column[0] && column[1] && column[2] && column[2] - firstTime > 3700.0) {
              firstX = firstX ? firstX : column[0];
              firstY = firstY ? firstY : column[1];
              //result = result + (column[0] - firstX) + ', ' + (firstY - column[1]) + ', ' + (column[2] - firstTime) + ', ' + (trial.data.timing.choice - trial.data.timing.start) + ', ' + trial.data.rating + ', ' + trial.id + ', ' + experiment.id + ', ' + (trial.manipulated ? 1 : 0) + ', ' + (trial.data.reason == "other" ? 1 : 0) + '\n';
              result = result + (column[0]) + ', ' + (column[1]) + ', ' + (column[2] - firstTime) + ', ' + (trial.data.timing.choice - trial.data.timing.start) + ', ' + trial.data.rating + ', ' + trial.id + ', ' + experiment.id + ', ' + (trial.id === 2 ? 1 : 0) + ', ' + (experiment.trials[4].data.reason === 'other' ? 1 : 0) + '\n';
            }
          });
        });

      });


      $scope.result = result;
    };


  }])
  .controller('PreTrialCtrl', ['$scope', 'mouseTracking', function($scope, mouseTracking) {

    var getTrial = function(index) {
      return $scope.experiment.preTrials[index] || false;
    };

    var startTrial = function() {

      mouseTracking.calibration().then(function(updatingFrequency) {
        mouseTracking.setUpdatingFrequency(updatingFrequency);
        // Save to experiment?
        console.log('Updating frequency set to ' + mouseTracking.updatingFrequency + ' ms (' + 1000/mouseTracking.updatingFrequency + ' hz)');
      });

      $scope.trial.start().then(function() {
        $scope.currentTrialIndex++;

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;
          return true;
        }

        $scope.trial = getTrial( $scope.currentTrialIndex );
      });

    };

    $scope.currentTrialIndex  = 0;
    $scope.trial              = getTrial($scope.currentTrialIndex);
    $scope.startTrial         = startTrial;
    $scope.started            = false;
    $scope.finished           = false;

  }])
  .controller('PostTrialCtrl', ['$scope', '$location', function($scope, $location) {
    var started = false;

    var getTrial = function(index) {
      var myTrial = $scope.experiment.postTrials[index] || false;
      if(!myTrial) {return false;}

      var detected = false;
      var previous = false;

      $.each($scope.experiment.trials, function() {
        if(this.id == myTrial.id) {
          detected = this.data.detected;
          previous = this.data.choiceId;
          return;
        }
      });

      myTrial.data.detected = detected;
      myTrial.data.previous = previous;

      return myTrial;
    };

    var startTrial = function() {
      if(started) { return; }
      started = true;

      $scope.trial.start().then(function(data) {

        $scope.trial.data = angular.copy(data);
        $scope.trial.save();

        $scope.currentTrialIndex++;

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;
          started = false;
          return true;
        }

        $scope.trial = getTrial( $scope.currentTrialIndex );
        started = false;
      });

    };

    var completeExperiment = function() {
      console.log($scope.experiment);
      // Save extra input data
      $scope.experiment.finish();
      // Contact Mechanical Turk
      $location.path('/start');
    };

    $scope.currentTrialIndex  = 0;
    $scope.trial              = getTrial($scope.currentTrialIndex);
    $scope.startTrial         = startTrial;
    $scope.started            = false;
    $scope.finished           = false;
    $scope.completeExperiment = completeExperiment;

  }])
  .controller('ExperimentCtrl', ['$scope', '$http', 'id', function($scope, $http, id) {
    $http.get('/experiments/'+id).success(function(experiment) {
      console.log(experiment);
    });
  }]);
