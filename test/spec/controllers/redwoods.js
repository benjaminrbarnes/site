'use strict';

describe('Controller: RedwoodsCtrl', function () {

  // load the controller's module
  beforeEach(module('siteApp'));

  var RedwoodsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RedwoodsCtrl = $controller('RedwoodsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RedwoodsCtrl.awesomeThings.length).toBe(3);
  });
});
