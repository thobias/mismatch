angular.module('mismatchResources').factory('experiment', [function() {
  // Generate on runtime
  return {
    'id': Date.now(),
    'user': {
      'sex': 'm',
      'age': 25,
      'device': 'mouse',
      'devicePosition': 'right',
      'hand': 'right'
    },
    'preTrials': [
      {
        'id': 1,
        'image1': 'images/faces/012AA.jpg',
        'image2': 'images/faces/012BB.jpg',
        'manipulated': false
      },
      {
        'id': 2,
        'image1': 'images/faces/013AA.jpg',
        'image2': 'images/faces/013BB.jpg',
        'manipulated': false
      },
      {
        'id': 3,
        'image1': 'images/faces/015AA.jpg',
        'image2': 'images/faces/015BB.jpg',
        'manipulated': false
      },
    ],
    'trials': [
      {
        'id': 1,
        'image1': 'images/faces/001AA.jpg',
        'image2': 'images/faces/001BB.jpg',
        'manipulated': false
      },
      {
        'id': 2,
        'image1': 'images/faces/002AA.jpg',
        'image2': 'images/faces/002BB.jpg',
        'manipulated': false
      },
      {
        'id': 3,
        'image1': 'images/faces/003AA.jpg',
        'image2': 'images/faces/003BB.jpg',
        'manipulated': true
      },
      {
        'id': 4,
        'image1': 'images/faces/004AA.jpg',
        'image2': 'images/faces/004BB.jpg',
        'manipulated': false
      },
      {
        'id': 5,
        'image1': 'images/faces/005AA.jpg',
        'image2': 'images/faces/005BB.jpg',
        'manipulated': true
      },
      {
        'id': 6,
        'image1': 'images/faces/006AA.jpg',
        'image2': 'images/faces/006BB.jpg',
        'manipulated': false
      }
    ],
    'postTrials': [
      {
        'id': 1,
        'image1': 'images/faces/001AA.jpg',
        'image2': 'images/faces/001BB.jpg',
        'manipulated': false
      },
      {
        'id': 2,
        'image1': 'images/faces/005AA.jpg',
        'image2': 'images/faces/005BB.jpg',
        'manipulated': false
      },
      {
        'id': 3,
        'image1': 'images/faces/004AA.jpg',
        'image2': 'images/faces/004BB.jpg',
        'manipulated': false
      }
    ]
  };

}]);
