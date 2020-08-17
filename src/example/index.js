var config = require('dotenv').config();
var OBDReader = require('../../lib/obd.js');
var btOBDReader = new OBDReader();
var dataReceivedMarker = {};

btOBDReader.on('connected', function () {
        this.write("ATE1");
        this.write('ATH1');

        //this.addPoller("temp");
        //this.addPoller("catemp11");
        this.addPollerString("2101")
        this.addPollerString("2102")
        this.addPollerString("21E4")
        this.addPollerString("21E0")

        this.startPolling(1000); //Request all values each second.
});

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

// btOBDReader.on('dataReceived', function (data) {
//     if (Object.keys(data).length !== 0) {
//       console.log(data);
//     }
//     dataReceivedMarker = data;
// });

// btOBDReader.on('messageReceived', function (data) {
//     console.log("MSG: " + data);
// });

btOBDReader.on('responseReceived', function (data) {
    console.log("Msgs (" + data.length + "): " + "***" + data + "***");
});

console.log('Connecting...')
btOBDReader.connect(process.env.OBD_ADDRESS, process.env.OBD_CHANNEL);
