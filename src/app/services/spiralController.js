(function () {
    'use strict';

    /* Defining spiral angular controller */
    angular
        .module('app.sp', [])
        .controller('spiralController', function ($scope, $rootScope, $mdToast, utilityService) {
            $scope.spiralStarted = false;
            $scope.scores = $rootScope.spiralScoresArray;
            $scope.finished = false;
            $scope.inTen = true;
            $scope.currentScore = undefined;
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

            /* Spiral game logic */
            $scope.spiralGame = function () {
                /* Defining starting values */
                $scope.spiralEff = 0;
                var spiralArrayX = [];
                var spiralArrayY = [];
                var spiralArrayZ = [];

                $scope.score = '';
                $scope.spiralStarted = true;
                $scope.inTen = true;
                $scope.finished = false;
                var startTime, endTime, hangTIme;
                var started = false;
                /* Starting setInterval function for measuring spinning */
                startMeasuring = setInterval(function () {
                    if ($scope.quarterbackTrainer.moving) {
                        /* If moving and game not started, taking start time here */
                        if (!started) {
                            started = true;
                            startTime = quarterbackTrainer.agmTime;
                        }
                        /* If moving and game was started, adding spiral data into array */
                        if (started) {
                            spiralArrayX.push(Math.abs($scope.quarterbackTrainer.q22));
                        }
                    } else if (started) {
                        /* If not moving and game was started, taking end time here */
                        endTime = quarterbackTrainer.agmTime;
                        var time = (endTime - startTime) / 125;
                        /* Checking if there is enough movement for storing the score */
                        if ((time) > 1.2) {
                            $scope.finished = true;

                            var sum = 0;
                            for (var i = 0; i < spiralArrayX.length; i++) {
                                sum += spiralArrayX[i];
                            }

                            var avg = sum / spiralArrayX.length;

                            if (avg > 0.5) {
                                $scope.spiralEff = 0;
                            } else {
                                $scope.spiralEff = Math.round((100 - (200 * avg)) * 10) / 10;
                            }
                            $scope.spiralStarted = false;
                            $scope.finished = true;
                            $scope.lastTime = $scope.spiralEff;
                            /* Storing the current score */
                            utilityService.saveResult($scope, 'spiralScoreboard', $scope.spiralEff);
                            $scope.$apply();
                        }
                        clearInterval(startMeasuring);
                        started = false;
                        startTime = undefined;
                        endTime = undefined;
                        /* Starting the function again, for listening for new movement */
                        $scope.spiralGame();
                    }
                }, 10);
            };

            /* Storing score into local storage */
            $scope.saveChanges = function () {
                localStorage.spiralScoreboard = [];
                localStorage.spiralScoreboard = JSON.stringify($scope.scores);
            };

            /* Clearing all the scores */
            $scope.clearScores = function () {
                localStorage.spiralScoreboard = JSON.stringify([]);
                $rootScope.spiralScoresArray = [];
                $scope.scores = [];
            };

            /* Starting the game for the first time */
            var startGame = setInterval(function () {
                if ($scope.quarterbackTrainer.agmEnabled && !gameStarted) {
                    gameStarted = true;
                    $scope.spiralGame();
                    clearInterval(startGame);
                }
            }, 10);
        })
})();


