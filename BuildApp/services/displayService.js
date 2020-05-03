const spawn = require('child_process').spawn;
const path = require('path')

function Display(project, stage, status, result) {
    var dataToSend;
    var testDataToSend;
    var scriptPath = path.resolve('/e-paper/display.py');
    var testScriptPath = path.resolve('/e-paper/testDisplay.py');

    console.log(scriptPath);
    console.log(testScriptPath);

    if (result == undefined) {
        result = 'not available'
    }

    try {
        const python = spawn('python', [scriptPath.toString(), project, stage, status, result]);

        python.stdout.on('data', (data) => {
            console.log('Pipe data from python script ...');
            dataToSend += data;
        });

        python.stdout.on('end', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            console.log(dataToSend);
        });
    } catch (err) {
        console.log(err);
    }

    try {
        const testPython = spawn('python', [testScriptPath.toString(), project, stage, status, result]);

        testPython.stdout.on('data', (data) => {
            console.log('Pipe data from python script ...');
            testDataToSend += data;
        });

        testPython.stdout.on('end', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            console.log(testDataToSend);
        });
    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    Display
}