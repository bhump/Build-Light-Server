const spawn = require('child_process').spawn;
const path = require('path')

function Display(project, stage, status, result){
    var dataToSend;
    var scriptPath = path.resolve('BuildApp/e-paper/display.py');

    console.log(scriptPath);

    if(result == undefined){
        result = 'not available'
    }

    const python = spawn('python', [scriptPath, project, stage, status, result]);
    
    python.stdout.on('data', (data) => {
      console.log('Pipe data from python script ...');
      dataToSend += data;
     });

     python.stdout.on('end', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
        console.log(dataToSend);
      });
}

module.exports = {
    Display
}