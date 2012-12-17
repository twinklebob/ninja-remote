'use strict';

yeomanApp.controller('ConfigureDeviceLedCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'NewButtonService', 'UserStore'
  , function($scope, $rootScope, UIEvents, NewButtonService, UserStore) {


    $scope.ButtonName = NewButtonService.Button.Options.name;
    $scope.ButtonValue = NewButtonService.Button.Options.value1;

    /**
     * This page requires a device to be preselected
     */
    $scope.CheckDevice = function() {
      if (NewButtonService.Button.GetDevice() === null) {
        $scope.setRoute('/selectButton');
      }
    };
    $scope.CheckDevice();

    /**
     * Sets the color for the button to actuate
     * @param {[type]} hexColor [description]
     */
    $scope.SetColor = function(hexColor) {
      $scope.ButtonValue = hexColor;
      NewButtonService.Button.GetDevice().Options.value = hexColor;
    };

    /**
     * Test the button
     */
    $scope.Test = function() {
      NewButtonService.Button.GetDevice().Emit(NewButtonService.Button.GetDevice().Options.value);
    };


    /**
     * Save the button to the control panel
     */
    $scope.Save = function() {
      NewButtonService.Button.Options.name = $scope.ButtonName;
      NewButtonService.Button.Options.value1 = $scope.ButtonValue;
      UserStore.AddButtonConfig(NewButtonService.Button);
      UserStore.Save();
    };



}]);
