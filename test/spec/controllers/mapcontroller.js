'use strict';

describe('Controller: MapControllerCtrl', function() {

  // load the controller's module
  beforeEach(module('lurinfacts'));

  var MapControllerCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MapControllerCtrl = $controller('MapControllerCtrl', {
      $scope: scope
    });
  }));

  it('should set name to MapControllerCtrl', function() {
    expect(scope.name).toBe('MapControllerCtrl');
  });
});
