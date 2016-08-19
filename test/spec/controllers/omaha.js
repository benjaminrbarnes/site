'use strict';

describe('Controller: OmahaCtrl', function () {

  // load the controller's module
  beforeEach(module('siteApp'));

  var OmahaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OmahaCtrl = $controller('OmahaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OmahaCtrl.awesomeThings.length).toBe(3);
  });
});
