(function () {
    'use strict';
    /* Defining hangtime angular controller */
    angular
        .module('app.ht', [])
        .controller('hangtimeController', function ($scope, $rootScope, $mdToast, utilityService) {
            /* Defining properties of hangtime controller */
            $scope.scores = $rootScope.htScoresArray;
            $scope.hangTimeStarted = false;
            $scope.thrown = false;
            $scope.finished = false;
            $scope.inTen = true;
            $scope.currentScore = undefined;
            $scope.name = '';
            var gameStarted = false;
            var startMeasuring;

            /* On back button clearing the set interval function */
            $scope.clearInterval = function () {
                window.history.go(-1);
                gameStarted = false;
                if (startMeasuring) {
                    clearInterval(startMeasuring);
                }
            };

            /* Hangtime game logic */
            $scope.hangTimeGame = function () {
                /* Defining starting values */
                $scope.time = 0;
                $scope.score = '';
                $scope.finished = false;
                $scope.hangTimeStarted = true;
                $scope.thrown = false;
                $scope.inTen = true;
                var startTime, endTime, hangTIme;
                var started = false;
                /* Starting setInterval function for measuring movement */
                startMeasuring = setInterval(function () {
                    if (!$scope.quarterbackTrainer.moving) {
                        if ($scope.thrown) {
                            /* If not moving and the ball was thrown, taking end time here */
                            clearInterval(startMeasuring);
                            endTime = new Date();
                            /* Checking if there is enough movement for storing the score */
                            if ($scope.time > 1.2) {
                                /* Storing the score */
                                if ($scope.scores.length > 0) {
                                    $scope.inTen = $scope.time > $scope.scores[$scope.scores.length - 1].score || $scope.scores.length < 10;
                                }
                                $scope.lastTime = $scope.time;
                                /* Storing the current score */
                                utilityService.saveResult($scope, 'htScoreboard', $scope.time);
                                $scope.$apply();
                            }
                            $scope.hangTimeStarted = false;
                            $scope.finished = true;
                            /* Starting the function again, for listening for new movement */
                            $scope.hangTimeGame();
                        }
                    } else {
                        /* If moving and not started yet, taking current time as a starting time */
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
                localStorage.htScoreboard = [];
                localStorage.htScoreboard = JSON.stringify($scope.scores);
            };

            /* Clearing all the scores */
            $scope.clearScores = function () {
                localStorage.htScoreboard = JSON.stringify([]);
                $rootScope.htScoresArray = [];
                $scope.scores = [];
            };

            /* Starting the game for the first time */
            var startGame = setInterval(function () {
                if ($scope.quarterbackTrainer.agmEnabled && !gameStarted) {
                    gameStarted = true;
                    $scope.hangTimeGame();
                    clearInterval(startGame);
                }
            }, 10);
        })
})();


