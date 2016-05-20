'use strict';

describe('Controller: SloveniaPart2Ctrl', function () {

  // load the controller's module
  beforeEach(module('siteApp'));

  var SloveniaPart2Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SloveniaPart2Ctrl = $controller('SloveniaPart2Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SloveniaPart2Ctrl.awesomeThings.length).toBe(3);
  });
});
