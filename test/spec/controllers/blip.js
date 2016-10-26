'use strict';

describe('Controller: BlipCtrl', function () {

  // load the controller's module
  beforeEach(module('siteApp'));

  var BlipCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BlipCtrl = $controller('BlipCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BlipCtrl.awesomeThings.length).toBe(3);
  });
});
