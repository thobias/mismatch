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
        'image1': 'http://www3.centerpartiet.se/Global/lokal/Hassleholm/bilder/Lars-G%C3%B6ran%20Wiberg%20liten.jpg',
        'image2': 'http://www.kalleblomster.com/images/Evert%20Ljusberg%20Look-a-like.JPG',
        'manipulated': false
      },
      {
        'id': 2,
        'image1': 'http://www.ais.uni-bonn.de/behnke/images/Sven_Behnke.jpg',
        'image2': 'http://images.forbes.com/media/lists/10/2009/ingvar-kamprad.jpg',
        'manipulated': true
      },
      {
        'id': 3,
        'image1': 'http://vegetarianstar.com/wp-content/uploads/2010/11/michael_greger.jpg',
        'image2': 'http://www.cs.cmu.edu/~maxion/roy.jpg',
        'manipulated': false
      },
      {
        'id': 4,
        'image1': 'http://www1.idrottonline.se/ImageVaultFiles/id_99425/cf_83127/B-20apr-2008.jpg',
        'image2': 'http://y.cdn-expressen.se/images/44/85/44852104472235e90b77fe7b21bde97f/645@70.jpg',
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
