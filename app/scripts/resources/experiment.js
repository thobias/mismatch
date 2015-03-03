angular.module('mismatchResources').factory('experiment', [function() {

  return {
    'id': 1,
    'user': {
      'sex': 'm',
      'age': 25,
      'device': 'trackpad',
      'devicePosition': 'right',
      'hand': 'right'
    },
    'trials': [
      {
        'id': 1,
        'image1': '/images/faces/001AA.jpg',
        'image2': '/images/faces/001BB.jpg',
        'manipulated': true
      },
      {
        'id': 2,
        'image1': '/images/faces/002AA.jpg',
        'image2': '/images/faces/002BB.jpg',
        'manipulated': true
      },
      {
        'id': 3,
        'image1': '/images/faces/003AA.jpg',
        'image2': '/images/faces/003BB.jpg',
        'manipulated': false
      },
      {
        'id': 4,
        'image1': '/images/faces/004AA.jpg',
        'image2': '/images/faces/004BB.jpg',
        'manipulated': false
      }
    ],
    'data': ['', '', '', '']
  };

  // return function(spec) {
  //   spec = spec || {};

  //   var construct = function(experiment, input) {
  //     experiment.id            = input.id || undefined;
  //     return experiment;
  //   };

  //   return construct(that, spec);
  // };

}]);
