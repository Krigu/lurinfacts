'use strict';

describe('Controller: FactsCtrl', function() {

  // load the controller's module
  beforeEach(module('lurinfacts'));

  var FactsCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    FactsCtrl = $controller('FactsCtrl', {
      $scope: scope
    });
  }));

  it('should set name to FactsCtrl', function() {
    expect(scope.name).toBe('FactsCtrl');
  });
});
