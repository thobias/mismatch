'use strict';

angular.module('mismatchDirectives').directive('countdownButton', function() {
  return {
    template: '<button class="precise-button countdownButton"></button>',
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs) {
      var container = $(element),
          body = $('body'),
          timers = [],
          fill = $('<div class="countdownButton-fill"></div>').appendTo(container),
          current = 0,
          time = 0,
          timer = false,
          alert = $('<h1 class="alert-text">Don\'t move the cursor</h1>').appendTo(body).hide(),
          faces = $('.face');

      container.on('mouseover', function() {
        container.on('mouseout', function() {
          container.css({'cursor': 'none'});
          body.css({'background': '#ff0000'});
          faces.css({'opacity': 0});
          alert.show();
        });
        container.on('mouseover', function() {
          body.css({'background': '#ffffff'});
          container.css({'cursor': 'pointer'});
          faces.css({'opacity': 1});
          alert.hide();
        });
      });

      var render = function(percent) {
        fill.css({'opacity': 1 - percent/100});
      };

      var finish = function() {
        timers.pop();
        if(timers.length === 0) {
          clearInterval(timer);
          timer = false;
        }
        container.off('mouseout');
      };

      var step = function() {
        current = current - 50;
        if(current <= 50) { finish(); }
        render( current/time*100 );
      };

      scope.$watch( attrs.time , function(val) {
        timers.push(1);
        render(100);

        current = val;
        time    = val;
        timer   = timer || setInterval(step, 50);
      });

      scope.$watch( attrs.hold , function(val) {
        if(val) {
          container.on('mouseout', function() {
            body.css({'background': '#ff0000'});
            faces.css({'opacity': 0});
            scope.$emit('mouseOut');
            alert.show();
          });
          container.on('mouseover', function() {
            body.css({'background': '#ffffff'});
            faces.css({'opacity': 1});
            alert.hide();
          });
          container.css({'cursor': 'none'});
        }
        else {
          container.off('mouseout');
          body.css({'background': '#ffffff'});
          container.css({'cursor': 'default'});
          faces.css({'opacity': 1});
          alert.hide();
        }
      });

    }
  };
});
