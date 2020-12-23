# obd-diff

## Prerequisites
- Required libraries for your OS, see: [bluetooth-serial-port GitHub](https://github.com/eelcocramer/node-bluetooth-serial-port).
- An already paired bluetooth ELM327 device, otherwise you will receive a connection error.

## Known Issues
#### Hangs on startup (macOS)
There is an issue with the bluetooth-serial-port library on macOS.
When starting the app, a message will print to console: `instantiateOnDevice for regular` 
indicating connection, but then the app will hang.

Workaround (tested on macOS Catalina 10.15):
1. Run the app with `npm start [pidfile]`.
1. Whilst the app hangs, press and hold Shift+Option and click the Bluetooth icon in the tray.
1. Under the 'Debug' menu, select 'Reset the Bluetooth module' and confirm.
1. The app will throw an exception, terminate the app with Control+C
1. Now run the app again, now it will return responses.
