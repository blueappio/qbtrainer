"use strict";

/* Angular module initialization */
var app;
(function(){
  app = angular.module('quarterbackTrainer', ['ngMaterial', 'ngMdIcons','app.ht','app.spin','app.vel','app.sp','ui.router'])
      .config(function($mdThemingProvider) {
          /* Palette setup */
          $mdThemingProvider.definePalette('blue-qb', {
              '50': 'b0bbc1',
              '100': '91afc1',
              '200': '7ba7c1',
              '300': '5b9bc1',
              '400': '3a8ec1',
              '500': '2988c1',
              '600': '0a3b7a',
              '700': '0a3b7a',
              '800': '0a3b7a',
              '900': '2193eb',
              'A100': '0a3b7a',
              'A200': '0a3b7a',
              'A400': '0a3b7a',
              'A700': '0a3b7a',
              'contrastDefaultColor': 'light', // whether, by default, text (contrast)
              // on this palette should be dark or light

              'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                  '200', '300', '400', 'A100'
              ],
              'contrastLightColors': undefined // could also specify this if default was 'dark'
          });

          $mdThemingProvider.definePalette('black-qb', {
              '50': 'dddddd',
              '100': 'a3a3a3',
              '200': '797979',
              '300': '525252',
              '400': '363636',
              '500': '121212',
              '600': '000000',
              '700': '000000',
              '800': '000000',
              '900': '000000',
              'A100': '848484',
              'A200': '848484',
              'A400': '848484',
              'A700': '848484',
              'contrastDefaultColor': 'light', // whether, by default, text (contrast)
              // on this palette should be dark or light

              'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                  '200', '300', '400', 'A100'
              ],
              'contrastLightColors': undefined // could also specify this if default was 'dark'
          });

          $mdThemingProvider.theme('default')
              .primaryPalette('blue-qb', {
                  'default': '600', // by default use shade 400 from the pink palette for primary intentions
                  'hue-1': '900', // use shade 100 for the <code>md-hue-1</code> class
                  'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                  'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
              })
              .accentPalette('black-qb', {
                  'default': '600', // by default use shade 400 from the pink palette for primary intentions
                  'hue-1': '900', // use shade 100 for the <code>md-hue-1</code> class
                  'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                  'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
              });
          $mdThemingProvider.theme('success-toast');
          $mdThemingProvider.theme('error-toast');
          $mdThemingProvider.alwaysWatchTheme(true);
      })
      /* Angular routing setup */
      .config(function ($stateProvider, $urlRouterProvider) {
          $stateProvider
              .state('home', {
                  url: "/home",
                  templateUrl: "app/pages/home.html",
                  controller: ""
              })
              .state('hangtime', {
                  url: "/hangtime",
                  templateUrl: "app/pages/hangtime.html",
                  controller: "hangtimeController",
                  resolve:{
                      "check":function($location, $rootScope){
                          if(!$rootScope.isConnected){
                              $location.path('/');
                          }
                      }
                  }
              })
              .state('velocity', {
                  url: "/velocity",
                  templateUrl: "app/pages/velocity.html",
                  controller: "velocityController",
                  resolve:{
                      "check":function($location, $rootScope){
                          if(!$rootScope.isConnected){
                              $location.path('/');
                          }
                      }
                  }
              })
              .state('spiral', {
                  url: "/spiral",
                  templateUrl: "app/pages/spiral.html",
                  controller: "spiralController",
                  resolve:{
                      "check":function($location, $rootScope){
                          if(!$rootScope.isConnected){
                              $location.path('/');
                          }
                      }
                  }
              })
              .state('footballspin', {
                  url: "/footballspin",
                  templateUrl: "app/pages/footballspin.html",
                  controller: "spinController",
                  resolve:{
                      "check":function($location, $rootScope){
                          if(!$rootScope.isConnected){
                              $location.path('/');
                          }
                      }
                  }
              });
          $urlRouterProvider.otherwise("/home");
      });
})();

app.run(['$document', '$window', function($document, $window) {
    var document = $document[0];
    document.addEventListener('click', function(event) {
        var hasFocus = document.hasFocus();
        if (!hasFocus) $window.focus();
    });
}]);

app.service('utilityService', function () {
    return new Utility();
});

app.controller('mainController', function($scope, $mdDialog, $mdToast, $rootScope, $state, $location){
    $scope.quarterbackTrainer = window.quarterbackTrainer;

    // Disabling the mouse right click event
    document.addEventListener('contextmenu', function(event) {event.preventDefault()});

    /* Function for checking local storage for stored scores */
    var checkForStoredScores = function () {
        if (localStorage.getItem('htScoreboard') == null)   {
            $rootScope.htScoresArray = [];
        } else {
            $rootScope.htScoresArray = JSON.parse(localStorage["htScoreboard"]);
        }
        if (localStorage.getItem('spinScoreboard') == null)   {
            $rootScope.spinScoresArray = [];
        } else {
            $rootScope.spinScoresArray = JSON.parse(localStorage["spinScoreboard"]);
        }
        if (localStorage.getItem('spiralScoreboard') == null)   {
            $rootScope.spiralScoresArray = [];
        } else {
            $rootScope.spiralScoresArray = JSON.parse(localStorage["spiralScoreboard"]);
        }
        if (localStorage.getItem('velocityScoreboard') == null)   {
            $rootScope.velocityScoresArray = [];
        } else {
            $rootScope.velocityScoresArray = JSON.parse(localStorage["velocityScoreboard"]);
        }
        // if (localStorage.getItem('noiseCalibration') == null)   {
        //     $scope.quarterbackTrainer.noiseLevel = 45;
        // } else {
        //     $scope.quarterbackTrainer.noiseLevel = JSON.parse(localStorage["noiseCalibration"]);
        // }
    };

    /* Calling function for checking scores */
    checkForStoredScores();

    /* Accordion listener function */
    var acc = document.getElementsByClassName("accordion");
    var i;
    $scope.quarterbackTrainer.connectState = function (state) {
        $rootScope.isConnected = state;
    };

    $scope.quarterbackTrainer.onDisconnect = function () {
        $location.path('/');
    };

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function () {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }

    /* Defining on success toast */
    $scope.quarterbackTrainer.onSuccess = function (message) {
        $scope.toast = true;
        setTimeout(function () {
            $scope.toast = false;
        },3500);
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .parent(document.querySelectorAll('#toaster'))
                .position('top right')
                .hideDelay(2500)
                .theme("success-toast")
        );
    };

    /* Defining on error toast */
    $scope.quarterbackTrainer.onError = function (message) {
        $scope.toast = true;
        setTimeout(function () {
            $scope.toast = false;
        },3500);
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .parent(document.querySelectorAll('#toaster'))
                .position('top right')
                .hideDelay(2500)
                .theme("error-toast")
        );
    };

    /* Defining on success toast */
    // $scope.quarterbackTrainer.onSuccess = function (message) {
    //     $mdToast.show($mdToast.simple().content(message).parent(document.querySelectorAll('#toaster')).position('top right').hideDelay(2500).theme("success-toast"));
    // };

    // /* Defining on error toast */
    // $scope.quarterbackTrainer.onError = function (message) {
    //     $mdToast.show($mdToast.simple().content(message).parent(document.querySelectorAll('#toaster')).position('top right').hideDelay(2500).theme("error-toast"));
    // };

    function showLoadingIndicator($event, text) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            clickOutsideToClose: false,
            template: '<md-dialog style="width: 250px;top:95px;margin-top: -170px;" aria-label="loadingDialog" ng-cloak>' +
            '<md-dialog-content>' +
            '<div layout="row" layout-align="center" style="padding: 40px;">' +
            '<div style="padding-bottom: 20px;">' +
            '<img src="app/images/loader.gif" width="80px" height="80px">' +
            // '<md-progress-circular md-mode="indeterminate" md-diameter="120" style="right: 10px;bottom: 5px;">' +
            // '</md-progress-circular>' +
            '</div>' +
            '</div>' +
            '<div layout="row" layout-align="center" style="padding-bottom: 20px;">' +
            '<label>' + text + '</label>' +
            '</div>' +
            '</md-dialog-content>' +
            '</md-dialog>',
            locals: {
                items: $scope.items
            },
            controller: DialogController
        });

        function DialogController($scope, $mdDialog, items) {
            $scope.items = items;
            $scope.closeDialog = function () {
                $mdDialog.hide();
            }

        }
    }

            /* Defining function for display update*/
    $scope.quarterbackTrainer.updateUI = function () {
        $scope.$apply();
    };

    /* Defining function for reroute if disconnected */
    $scope.quarterbackTrainer.onDisconnected = function () {
        $location.path('/home');
    };

    /* Reroute function for velocity game */
    $scope.goVelocity = function () {
        if($scope.quarterbackTrainer.agmEnabled && !$scope.quarterbackTrainer.disconnected){
            $location.path('/velocity');
        }
    };

    /* Reroute function for spiral game */
    $scope.goSpiral = function () {
        if($scope.quarterbackTrainer.agmEnabled && !$scope.quarterbackTrainer.disconnected){
            $location.path('/spiral');
        }
    };

    /* Reroute function for hangtime game */
    $scope.goHT = function () {
        if($scope.quarterbackTrainer.agmEnabled && !$scope.quarterbackTrainer.disconnected){
            $location.path('/hangtime');
        }
    };

    /* Reroute function for spin game */
    $scope.goSpin = function () {
        if($scope.quarterbackTrainer.agmEnabled && !$scope.quarterbackTrainer.disconnected){
            $location.path('/footballspin');
        }
    };

    // /* Defining function for loading indicator with custom text */
    // function showLoadingIndicator($mdDialog, $event, text) {
    //     $mdDialog.show({
    //         parent: angular.element(document.body),
    //         targetEvent: $event,
    //         clickOutsideToClose: false,
    //         escapeToClose: false,
    //         template: '<md-dialog style="width: 250px;" aria-label="loading">' +
    //         '<md-dialog-content>' +
    //         '<div layout="row" layout-align="center" style="padding: 25px;">' +
    //
    //         '</div>' +
    //         '<div layout="row" layout-align="center" style="padding-bottom: 40px;">' +
    //         '<label>' + text + '</label>' +
    //         '</div>' +
    //         '</md-dialog-content>' +
    //         '</md-dialog>',
    //         locals: {
    //             items: ''
    //         }
    //     });
    // }

    // /* Defining indicator with disconnected text */
    // $scope.quarterbackTrainer.disconnectIndicator = function () {
    //     showLoadingIndicator($mdDialog, '', 'Device disconnected');
    // };

    /* Calling on success toast for connecting */
    // $scope.quarterbackTrainer.onSuccess('Connecting ....');
    function dismissLoadingIndicator() {
        $mdDialog.cancel();
    }

    $scope.onConnect = function () {
        showLoadingIndicator('', 'Connecting ....');
        $scope.quarterbackTrainer.connect()
            .then(function () {
                dismissLoadingIndicator();
                if($scope.quarterbackTrainer.connected){
                    $scope.quarterbackTrainer.onSuccess('Connected...');
                }
                $scope.$apply();
            })
            .catch(function (error) {
                dismissLoadingIndicator();
                console.error('Argh!', error, error.stack ? error.stack : '');
            });
    };

});
