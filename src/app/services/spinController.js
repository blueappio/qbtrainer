(function () {
    'use strict';

    /* Defining spin angular controller */
    angular
        .module('app.spin', [])
        .controller('spinController', function ($scope, $rootScope, $mdToast, utilityService) {
            $scope.scores = $rootScope.spinScoresArray;
            $scope.spinningStarted = false;
            $scope.thrown = false;
            $scope.finished = false;
            $scope.inTen = true;
            $scope.name = '';
            var startMeasuring;
            var gameStarted = false;

            /* On back button clearing the set interval function */
            $scope.clearInterval = function () {
                window.history.go(-1);
                gameStarted = false;
                if (startMeasuring) {
                    clearInterval(startMeasuring);
                }
            };

            /* Spin game logic */
            $scope.spinGame = function () {
                /* Defining starting values */
                $scope.time = 0;
                $scope.finished = false;
                $scope.spinStarted = true;
                $scope.thrown = false;
                $scope.inTen = true;
                var startTime, endTime, hangTIme;
                var started = false;
                /* Starting setInterval function for measuring spinning */
                startMeasuring = setInterval(function () {
                    if (!$scope.quarterbackTrainer.spinning) {
                        if ($scope.thrown) {
                            /* If not spinning and the ball was moved, taking end time here */
                            clearInterval(startMeasuring);
                            endTime = new Date();
                            /* Checking if there is enough spinning for storing the score */
                            if ($scope.time > 1.2) {
                                if ($scope.scores.length > 0) {
                                    $scope.inTen = $scope.time > $scope.scores[$scope.scores.length - 1].score || $scope.scores.length < 10;
                                }
                                $scope.lastTime = $scope.time;
                                /* Storing the current score */
                                utilityService.saveResult($scope, 'spinScoreboard', $scope.time);
                                $scope.$apply();
                            }
                            $scope.spinStarted = false;
                            $scope.finished = true;
                            /* Starting the function again, for listening for new spinning */
                            $scope.spinGame();
                        }
                    } else {
                        /* If spinning and not started yet, taking current time as a starting time */
                        $scope.thrown = true;
                        if (started == false) {
                            started = true;
                            startTime = quarterbackTrainer.agmTime;
                        }
                        var currentTime = quarterbackTrainer.agmTime;
                        var time = (currentTime - startTime) / 125;
                        $scope.time = Math.round(time * 10) / 10;
                        $scope.$apply();

                    }
                }, 10);
            };

            /* Storing score into local storage */
            $scope.saveChanges = function () {
                localStorage.spinScoreboard = [];
                localStorage.spinScoreboard = JSON.stringify($scope.scores);
            };

            /* Clearing all the scores */
            $scope.clearScores = function () {
                localStorage.spinScoreboard = JSON.stringify([]);
                $rootScope.spinScoresArray = [];
                $scope.scores = [];
            };

            /* Starting the game for the first time */
            var startGame = setInterval(function () {
                if ($scope.quarterbackTrainer.agmEnabled && !gameStarted) {
                    gameStarted = true;
                    $scope.spinGame();
                    clearInterval(startGame);
                }
            }, 10);
        })
})();


