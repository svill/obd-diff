var config = require('dotenv').config();
var OBDReader = require('../lib/obd.js');
var btOBDReader = new OBDReader();
var dataReceivedMarker = {};

btOBDReader.on('connected', function () {
    this.addPoller("temp");
    this.startPolling(1000); //Request all values each second.
});

btOBDReader.on('dataReceived', function (data) {
    if (Object.keys(data).length !== 0) {
      console.log(data);
    }
    dataReceivedMarker = data;
});

btOBDReader.on('messageReceived', function (data) {
    console.log("MSG: " + data);
});

console.log('Connecting...')
btOBDReader.connect(process.env.OBD_ADDRESS, process.env.OBD_CHANNEL);
