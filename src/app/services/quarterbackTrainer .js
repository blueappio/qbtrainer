"use strict";

var QuarterbackTrainer = function () {
    /* Defining services and characteristics UUIDs */
    var SENSOR_SERVICE = "00000000-0001-11e1-9ab4-0002a5d5c51b";
    var ACC_GYRO_MAG = "00e00000-0001-11e1-ac36-0002a5d5c51b";
    var BATTERY = "00020000-0001-11e1-ac36-0002a5d5c51b";
    var SENSOR_FUSION = "00000100-0001-11e1-ac36-0002a5d5c51b";
    var DEVICE_NAME = 'BM2V210';

    var self;

    function QuarterbackTrainer(bluetooth) {
        self = this;
        self.bluetooth = bluetooth;
        self.initialize();
    }

    /* Initializing properties for QuarterbackTrainer class */
    QuarterbackTrainer.prototype.initialize = function () {
        var self = this;
        self.bluetoothDevice = undefined;
        self.connected = false;
        self.server = undefined;
        self.agmEnabled = false;
        self.data = {
            accGyroMag: {
                acc: {}, gyro: {}, mag: {}, accVector: '', gyroVector: '', magVector: '', motionStatus: ''
            }
        };
        self.util = new Utility();
        self.peripheral = {};
        self.accArrayX = [];
        self.accArrayY = [];
        self.accArrayZ = [];
        self.gyroArrayX = [];
        self.gyroArrayY = [];
        self.gyroArrayZ = [];
        self.spinning = false;
        self.disconnected = false;
    };

    /* Defining function for connecting to the device */
    QuarterbackTrainer.prototype.connect = function () {
        var options = {filters: [{name: 'BM2V210'}, {name: 'BM2V220'}, {services: [SENSOR_SERVICE]}]};
        if (navigator.bluetooth) {
            return navigator.bluetooth.requestDevice(options)
            /* Connecting to the device */
                .then(function (device) {
                    self.bluetoothDevice = device;
                    return device.gatt.connect();
                })
                .then(function (server) {
                    console.log("Discovering services");
                    self.server = server;
                    self.connected = true;
                    self.connectState(true);
                    /* Adding disconnection listener */
                    // self.bluetoothDevice.on("gattserverdisconnected", function (event) {
                    //     console.log("Device disconnected");
                    //     self.onError('Device disconnected');
                    //     self.connected = false;
                    //     self.connectState(false);
                    //     self.onDisconnect();
                    //     self.initialize();
                    //     // self.disconnectIndicator();
                    // });
                    /* Getting sensor service */
                    return server.getPrimaryService(SENSOR_SERVICE)
                        .then(function (service) {
                            Promise.all([
                                /* Getting accelerometer/gyroscope/magnetometer characteristic */
                                service.getCharacteristic(ACC_GYRO_MAG)
                                    .then(function (characteristic) {
                                        return characteristic.startNotifications()
                                            .then(function () {
                                                self.agmEnabled = true;
                                                characteristic.addEventListener('characteristicvaluechanged', function (value) {
                                                    /* Calling function for using motion data */
                                                    extractAccGyroMagData(self, parseResponse(value.target.value.buffer));
                                                    checkFreeFall();
                                                    checkSpinning();
                                                    checkMoving();
                                                    quarterbackTrainer.updateUI();
                                                });
                                            });
                                    }),
                                /* Getting sensor fusion characteristic */
                                service.getCharacteristic(SENSOR_FUSION)
                                    .then(function (characteristic) {
                                        return characteristic.startNotifications()
                                            .then(function () {
                                                QuarterbackTrainer.sensorFusionReady = true;
                                                var dataReceived = false;
                                                setTimeout(function () {
                                                    if (QuarterbackTrainer.fusionLicenseEnabled == undefined) {
                                                        QuarterbackTrainer.fusionLicenseEnabled = false;
                                                    }
                                                }, 5000);
                                                characteristic.addEventListener('characteristicvaluechanged', function (value) {
                                                    if (!dataReceived) {
                                                        QuarterbackTrainer.fusionLicenseEnabled = true;
                                                        dataReceived = true;
                                                    }
                                                    extractSensorFusionData(self, parseResponse(value.target.value.buffer));
                                                    QuarterbackTrainer.updateUI();
                                                });
                                            });
                                    }),
                                /* Getting battery characteristic */
                                service.getCharacteristic(BATTERY)
                                    .then(function (characteristic) {
                                        return characteristic.startNotifications()
                                            .then(function () {
                                                characteristic.addEventListener('characteristicvaluechanged', function (value) {
                                                    extractBatteryData(parseResponse(value.target.value.buffer));
                                                    QuarterbackTrainer.updateUI();
                                                });
                                            });
                                    })
                            ]).catch(function (err) {
                                console.log(err);
                            });
                        });
                    /* Error handling function */
                }, function (error) {
                    console.warn('Service not found ' + error);
                    self.onError('Timed out');
                    Promise.resolve(true);
                })
        } else {
            console.log('Bluetooth not available');
        }
    };
    window.quarterbackTrainer = new QuarterbackTrainer();

}();

/* Function for handling accelerometer/gyroscope/magnetometer readout data */
var extractAccGyroMagData = function (self, value) {
    /* Parsing motion data and storing into data object */
    self.agmTime = self.util.twosComplementFromData(value.slice(0, 2));
    self.data.accGyroMag.acc.x = self.util.twosComplementFromData(value.slice(2, 4)) / 1000;
    self.data.accGyroMag.acc.y = self.util.twosComplementFromData(value.slice(4, 6)) / 1000;
    self.data.accGyroMag.acc.z = self.util.twosComplementFromData(value.slice(6, 8)) / 1000;
    self.data.accGyroMag.gyro.x = self.util.twosComplementFromData(value.slice(8, 10)) / 10;
    self.data.accGyroMag.gyro.y = self.util.twosComplementFromData(value.slice(10, 12)) / 10;
    self.data.accGyroMag.gyro.z = self.util.twosComplementFromData(value.slice(12, 14)) / 10;
    self.data.accGyroMag.mag.x = self.util.twosComplementFromData(value.slice(14, 16));
    self.data.accGyroMag.mag.y = self.util.twosComplementFromData(value.slice(16, 18));
    self.data.accGyroMag.mag.z = self.util.twosComplementFromData(value.slice(18, 20));
};

var recipNorm;

/* Function for handling sensor fusion readout data */
var extractSensorFusionData = function (self, value) {
    /* Parsing sensor fusion data and storing into data object */
    self.q11 = self.util.hex2SingleFloat(value.slice(14,16).join('')) / 10000;
    self.q22 = self.util.hex2SingleFloat(value.slice(16,18).join('')) / 10000;
    self.q33 = self.util.hex2SingleFloat(value.slice(18,20).join('')) / 10000;
    self.q00 = getQs(self.q11, self.q22, self.q33);
    self.sum = self.q11 + self.q22 + self.q33;
};

/* Function for handling battery readout data */
var extractBatteryData = function (value) {
    /* Parsing battery data and storing into data object */
    quarterbackTrainer.batteryLevel = self.util.hex2SingleFloat(value.slice(2,4).join('')) / 10;

};

/* Helper function for checking free fall event */
var checkFreeFall = function () {
    quarterbackTrainer.freeFall = (quarterbackTrainer.util.calculateAvgAccX() && quarterbackTrainer.util.calculateAvgAccY() && quarterbackTrainer.util.calculateAvgAccZ());
};

/* Helper function for checking spinning event */
var checkSpinning = function () {
    quarterbackTrainer.spinning = !(quarterbackTrainer.util.calculateAvgGyroX() && quarterbackTrainer.util.calculateAvgGyroY() && quarterbackTrainer.util.calculateAvgGyroZ());
};

/* Helper function for checking movement event */
var checkMoving = function () {
    quarterbackTrainer.moving = !(quarterbackTrainer.util.calculateAvgGyroX_ht() && quarterbackTrainer.util.calculateAvgGyroY_ht() && quarterbackTrainer.util.calculateAvgGyroZ_ht());
};

/* Helper function for getting quaternion value */
var getQs = function (q1, q2, q3) {
    return (1 - (q1 * q1 + q2 * q2 + q3 * q3)) > 0 ? (Math.sqrt((1 - (q1 * q1 + q2 * q2 + q3 * q3)))) : 0;
};

var parseResponse = function (response) {
    var tmpArray = new Uint8Array(response);
    var result = '';
    for (var i = 0; i < tmpArray.length; i++) {
        var hex = tmpArray[i].toString(16);
        if (hex.length == 1) {
            hex = '0' + hex;
        }
        result = result + hex;
    }
    var data_array = result.match(/.{1,2}/g);
    var numOfData = parseInt(data_array[0], 16);
    return data_array;
};
