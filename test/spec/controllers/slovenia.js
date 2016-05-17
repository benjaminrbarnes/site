'use strict';

describe('Controller: SloveniaCtrl', function () {

  // load the controller's module
  beforeEach(module('siteApp'));

  var SloveniaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SloveniaCtrl = $controller('SloveniaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SloveniaCtrl.awesomeThings.length).toBe(3);
  });
});
