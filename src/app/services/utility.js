function Utility() {

    this.calculateAvgAccX = function () {
        quarterbackTrainer.accArrayX.unshift(quarterbackTrainer.data.accGyroMag.acc.x);
        if (quarterbackTrainer.accArrayX.length > 3) {
            quarterbackTrainer.accArrayX.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.accArrayX.length; i++) {
            sum += quarterbackTrainer.accArrayX[i];
        }

        var avg = sum / quarterbackTrainer.accArrayX.length;

        return (avg > -0.1 && avg < 0.1);
    };

    this.calculateAvgAccY = function () {
        quarterbackTrainer.accArrayY.unshift(quarterbackTrainer.data.accGyroMag.acc.y);
        if (quarterbackTrainer.accArrayY.length > 3) {
            quarterbackTrainer.accArrayY.pop();
        }
        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.accArrayY.length; i++) {
            sum += quarterbackTrainer.accArrayY[i];
        }

        var avg = sum / quarterbackTrainer.accArrayY.length;
        return (avg > -0.1 && avg < 0.1);
    };

    this.calculateAvgAccZ = function () {
        quarterbackTrainer.accArrayZ.unshift(quarterbackTrainer.data.accGyroMag.acc.z);
        if (quarterbackTrainer.accArrayZ.length > 3) {
            quarterbackTrainer.accArrayZ.pop();
        }
        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.accArrayZ.length; i++) {
            sum += quarterbackTrainer.accArrayZ[i];
        }

        var avg = sum / quarterbackTrainer.accArrayZ.length;
        return (avg > -0.1 && avg < 0.1);
    };

    this.calculateAvgGyroX = function () {
        quarterbackTrainer.gyroArrayX.unshift(quarterbackTrainer.data.accGyroMag.gyro.x);
        if (quarterbackTrainer.gyroArrayX.length > 3) {
            quarterbackTrainer.gyroArrayX.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.gyroArrayX.length; i++) {
            sum += quarterbackTrainer.gyroArrayX[i];
        }

        var avg = sum / quarterbackTrainer.gyroArrayX.length;

        return (avg > -50 && avg < 50);
    };

    this.calculateAvgGyroY = function () {
        quarterbackTrainer.gyroArrayY.unshift(quarterbackTrainer.data.accGyroMag.gyro.y);
        if (quarterbackTrainer.gyroArrayY.length > 3) {
            quarterbackTrainer.gyroArrayY.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.gyroArrayY.length; i++) {
            sum += quarterbackTrainer.gyroArrayY[i];
        }

        var avg = sum / quarterbackTrainer.gyroArrayY.length;

        return (avg > -50 && avg < 50);
    };

    this.calculateAvgGyroZ = function () {
        quarterbackTrainer.gyroArrayZ.unshift(quarterbackTrainer.data.accGyroMag.gyro.z);
        if (quarterbackTrainer.gyroArrayZ.length > 3) {
            quarterbackTrainer.gyroArrayZ.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.gyroArrayZ.length; i++) {
            sum += quarterbackTrainer.gyroArrayZ[i];
        }

        var avg = sum / quarterbackTrainer.gyroArrayZ.length;

        return (avg > -50 && avg < 50);
    };

    this.calculateAvgGyroX_ht = function () {
        quarterbackTrainer.gyroArrayX.unshift(quarterbackTrainer.data.accGyroMag.gyro.x);
        if (quarterbackTrainer.gyroArrayX.length > 3) {
            quarterbackTrainer.gyroArrayX.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.gyroArrayX.length; i++) {
            sum += quarterbackTrainer.gyroArrayX[i];
        }

        var avg = sum / quarterbackTrainer.gyroArrayX.length;

        return (avg > -30 && avg < 30);
    };

    this.calculateAvgGyroY_ht = function () {
        quarterbackTrainer.gyroArrayY.unshift(quarterbackTrainer.data.accGyroMag.gyro.y);
        if (quarterbackTrainer.gyroArrayY.length > 3) {
            quarterbackTrainer.gyroArrayY.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.gyroArrayY.length; i++) {
            sum += quarterbackTrainer.gyroArrayY[i];
        }

        var avg = sum / quarterbackTrainer.gyroArrayY.length;

        return (avg > -30 && avg < 30);
    };

    this.calculateAvgGyroZ_ht = function () {
        quarterbackTrainer.gyroArrayZ.unshift(quarterbackTrainer.data.accGyroMag.gyro.z);
        if (quarterbackTrainer.gyroArrayZ.length > 3) {
            quarterbackTrainer.gyroArrayZ.pop();
        }

        var sum = 0;
        for (var i = 0; i < quarterbackTrainer.gyroArrayZ.length; i++) {
            sum += quarterbackTrainer.gyroArrayZ[i];
        }

        var avg = sum / quarterbackTrainer.gyroArrayZ.length;

        return (avg > -30 && avg < 30);
    };

    this.dataToArray = function (data) {
        return data.match(/.{1,2}/g);
    };

    this.parseArray = function (array) {
        var lenght = array.length;
        var newArray = [];
        var x = 1;
        for (i = 0; i < lenght; i++) {
            newArray[i] = array[lenght - x];
            x++;
        }
        var str = newArray.join("");
        return parseInt(str, 16);
    };

    this.twosComplementFromData = function (data) {
        var result = this.parseArray(data);
        var value = '';
        if (result > 32767) {
            var dec = parseInt(result.toString(2).replace(/[01]/g, function (n) {
                return 1 - n;
            }), 2);
            return -(dec + 1);
        } else {
            return result;
        }
    };

    this.sumOfVectors = function (x, y, z) {
        return Math.sqrt(x * x + y * y + z * z);
    };

    this.hex2SingleFloat = function (hex) {
        // var array = hex.match(/.{1,2}/g);

        var buffer = new ArrayBuffer(4);
        var bytes = new Int8Array(buffer);
        var single = new Uint16Array(buffer);

        bytes[1] = '0x' + hex.match(/.{1,2}/g)[0];
        bytes[0] = '0x' + hex.match(/.{1,2}/g)[1];

        var int16 = swap16(single[0]);
        return twosComplement(int16);
    };

    var swap16 = function (val) {
        return ((val & 0xFF) << 8)
            | ((val >> 8) & 0xFF);
    };
    var twosComplement = function (result) {
        if (result > 32767) {
            // var dec = parseInt(result.toString(2).replace(/[01]/g,function(n) {return 1-n;}),2);
            return -(parseInt(result.toString(2).replace(/[01]/g, function (n) {
                return 1 - n;
            }), 2) + 1);
        } else {
            return result;
        }
    };

    this.saveResult = function (scope, storage, result) {
        if (scope.inTen) {
            var playerNumber = 1;
            while (checkNumber(scope, playerNumber) == false) {
                playerNumber++
            }
            var user = {name: 'Player ' + playerNumber, score: result, timestamp: new Date()};
            storeData(scope, user);
            if (scope.scores.length > 10) {
                scope.scores.pop();
            }
            localStorage[storage] = JSON.stringify(scope.scores);

        } else {
            scope.currentScore = scope.lastTime;
        }
    };

    function storeData(scope, user) {
        var i = 0;

        if (scope.scores.length > 0) {
            while (i < scope.scores.length) {
                if (scope.scores[i].score > user.score) {
                    if (i + 1 == scope.scores.length) {
                        scope.scores.splice(i + 1, 0, user);
                        scope.currentScore = i + 2;
                        break;
                    }
                    i++;
                } else {
                    scope.scores.splice(i, 0, user);
                    scope.currentScore = i + 1;
                    break;
                }
            }
        } else {
            scope.scores.push(user);
            scope.currentScore = 1;
        }
    }

    var checkNumber = function (scope, number) {
        for (var j = 0; j < scope.scores.length; j++) {
            if (scope.scores[j].name.includes(number)) {
                return false;
            }
        }
        return true;
    };

    return this;
}