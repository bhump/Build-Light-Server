const spawn = require('child_process').spawn;
const path = require('path');
var databaseService = require('../services/databaseService');

var scriptPath = path.resolve('e-paper/display.py');
var testScriptPath = path.resolve('e-paper/testDisplay.py');
var initializeScriptPath = path.resolve('e-paper/init.py');
var sleepScriptPath = path.resolve('e-paper/sleep.py');

//var scriptPath = path.resolve('BuildApp/e-paper/display.py');
//var testScriptPath = path.resolve('BuildApp/e-paper/testDisplay.py'); //Test Locally
//var initializeScriptPath = path.resolve('BuildApp/e-paper/init.py');
//var sleepScriptPath = path.resolve('BuildApp/e-paper/sleep.py');

var expireDate = new Date;

async function Display(project, stage, status, result) {
    var dataToSend;
    var testDataToSend;
    
    console.log('First Now Date ' + Date.now());
    console.log('First Expire Date' + expireDate);

    expireDate.setMinutes(expireDate.getMinutes() + 30);

    console.log('Expire Date' + expireDate);
    console.log('Now Date ' + Date.now());

    console.log(scriptPath);
    console.log(testScriptPath);

    if (result == undefined) {
        result = 'not available'
    }

    try {
        var settingsResult = await databaseService.GetDisplaySettings();

        if (settingsResult == undefined || settingsResult == false) {
            initialize();
        }
    } catch (err) {
        console.log(err);
    }

    try {
        const python = spawn('python', [scriptPath.toString(), project, stage, status, result]);

        python.stdout.on('data', (data) => {
            console.log('Pipe data from display.py');
            dataToSend += data;
        });

        python.stdout.on('close', (code) => {
            console.log(`dispaly.py child process close all stdio with code ${code}`);
            // send data to browser
            console.log(dataToSend);
        });
    } catch (err) {
        console.log(err);
    }

    try {
        const testPython = spawn('python', [testScriptPath.toString(), project, stage, status, result]);

        testPython.stdout.on('data', (data) => {
            console.log('Pipe data from testDisplay.py ...');
            testDataToSend += data;
        });

        testPython.stdout.on('close', (code) => {
            console.log(`testDisplay.py child process close all stdio with code ${code}`);
            // send data to browser
            console.log(testDataToSend);
        });
    } catch (err) {
        console.log(err);
    }

    var nowDate = new Date();

    if(expireDate < nowDate){
        sleep();
    }

}

function initialize() {
    try {
        var dataToSend;

        const python = spawn('python', [initializeScriptPath.toString()]);

        python.stdout.on('data', (data) => {
            console.log('Pipe data from init.py');
            dataToSend += data;
        });

        python.stdout.on('close', (code) => {
            console.log(`dispaly.py child process close all stdio with code ${code}`);
            // send data to browser
            console.log(dataToSend);
        });

        var item = {
            'displayId': '1',
            'isInitiated': true,
            'dateInitiated': Date.now()
        };

        databaseService.UpdateDisplaySettings(item);

    } catch (err) {
        console.log(err);
    };
};

function sleep() {
    try {
        var dataToSend;

        const python = spawn('python', [sleepScriptPath.toString()]);

        python.stdout.on('data', (data) => {
            console.log('Pipe data from sleep.py');
            dataToSend += data;
        });

        python.stdout.on('close', (code) => {
            console.log(`dispaly.py child process close all stdio with code ${code}`);
            // send data to browser
            console.log(dataToSend);
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    Display
}