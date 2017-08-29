(function () {
    'use strict';
    
    /* Defining velocity angular controller */
    angular
        .module('app.vel', [])
        .controller('velocityController', function ($scope, $rootScope, $mdToast, $mdDialog, utilityService) {
            $scope.scores = $rootScope.velocityScoresArray;
            $scope.thrown = false;
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

            /* Velocity game logic */
            $scope.velocityGame = function () {
                /* Defining starting values */
                var accArray = [];
                $scope.velocity = 0;
                $scope.score = '';
                $scope.finished = false;
                $scope.velocityStarted = true;
                $scope.thrown = false;
                $scope.inTen = true;
                var startTime, endTime, hangTIme;
                var started = false;
                var ended = false;
                /* Starting setInterval function for measuring movement */
                startMeasuring = setInterval(function () {
                    if ($scope.quarterbackTrainer.spinning) {
                        /* If moving and game not started, taking start time here */
                        if (!started) {
                            started = true;
                            startTime = quarterbackTrainer.agmTime;
                        }
                        /* If moving and game was started, adding movement data into array */
                        if (started) {
                            accArray.push(Math.abs((utilityService.sumOfVectors($scope.quarterbackTrainer.data.accGyroMag.acc.x, $scope.quarterbackTrainer.data.accGyroMag.acc.y, $scope.quarterbackTrainer.data.accGyroMag.acc.z)) - 1));
                        }
                    } else if (started) {
                        /* If not moving and game was started, taking end time here and calculating velocity */
                        endTime = quarterbackTrainer.agmTime;
                        var maxAcc = Math.max.apply(null, accArray);
                        var accMPS = maxAcc * 9.80665;
                        var time = (endTime - startTime) / 125;
                        $scope.velocityStarted = false;
                        var vel = Math.round(accMPS * endTime - accMPS * startTime) / 1250;
                        $scope.velocity = Math.round(vel * 2.236936 * 10) / 10;
                        /* Checking if there is enough movement for storing the score */
                        if (time > 1.2 && $scope.velocity > 5) {
                            clearInterval(startMeasuring);
                            $scope.lastTime = $scope.velocity;
                            /* Storing the current score */
                            utilityService.saveResult($scope, 'velocityScoreboard', $scope.velocity);
                        }
                        clearInterval(startMeasuring);
                        ended = true;
                        started = false;
                        startTime = undefined;
                        endTime = undefined;
                        /* Starting the function again, for listening for new movement */
                        $scope.velocityGame();
                    }
                }, 10)
            };

            /* Storing score into local storage */
            $scope.saveChanges = function () {
                localStorage.velocityScoreboard = [];
                localStorage.velocityScoreboard = JSON.stringify($scope.scores);
            };

            /* Clearing all the scores */
            $scope.clearScores = function () {
                localStorage.velocityScoreboard = JSON.stringify([]);
                $rootScope.velocityScoresArray = [];
                $scope.scores = [];
                $mdDialog.cancel();
            };

            /* Starting the game for the first time */
            var startGame = setInterval(function () {
                if ($scope.quarterbackTrainer.agmEnabled && !gameStarted) {
                    gameStarted = true;
                    $scope.velocityGame();
                    clearInterval(startGame);
                }
            }, 10);

        })
})();


