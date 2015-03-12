'use strict';

describe('Controller: MapCtrl', function() {

  // load the controller's module
  beforeEach(module('lurinfacts'));

  var MapCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MapCtrl = $controller('MapCtrl', {
      $scope: scope
    });
  }));

  it('should set name to MapCtrl', function() {
    expect(scope.name).toBe('MapCtrl');
  });
});
