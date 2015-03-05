'use strict';

angular.module('mismatchDirectives').directive('countdown', function() {
  return {
    template: '<div class="timer"></div>',
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs) {
      var container = $(element),
          timers = [],
          fill = $('<div class="timer-fill"></div>').appendTo(container),
          current = 0,
          time = 0,
          timer = false;

      container.css({'opacity': 0});

      var render = function(percent) {
        fill.css({'width': percent + '%'});
      };

      var finish = function() {
        timers.pop();
        if(timers.length === 0) {
          clearInterval(timer);
          timer = false;
          container.css({'opacity': 0});
          //render(100);
        }
      };

      var step = function() {
        current = current - 50;
        if(current <= 50) { finish(); }
        render( current/time * 100 );
      };

      scope.$watch( attrs.time , function(val) {
        timers.push(1);
        element.css({'opacity': 1});

        current = val;
        time    = val;
        timer   = timer || setInterval(step, 50);
      });
    }
  };
});
