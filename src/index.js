var OBDReader = require('../lib/obd.js');
var btOBDReader = new OBDReader();
var dataReceivedMarker = {};

btOBDReader.on('connected', function () {
    //this.requestValueByName("vss"); //vss = vehicle speed sensor

    this.addPoller("vss");
    this.addPoller("rpm");
    this.addPoller("temp");
    this.addPoller("load_pct");
    this.addPoller("map");
    this.addPoller("frp");

    this.startPolling(1000); //Request all values each second.
});

btOBDReader.on('debug', function (data) {
    console.log("DEBUG:" + data);
});

btOBDReader.on('dataReceived', function (data) {
    console.log(data);
    dataReceivedMarker = data;
});

console.log('Connecting...')
// Use first device with 'obd' in the name
btOBDReader.autoconnect('obd');
