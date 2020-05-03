var blinkstick = require('blinkstick');

function BuildLight(status, result, led) {
    let buildStatus = status;
    let buildResult = result;

    var display = spawn('python', ['/Users/humpy/Workspace/Build\ Light/BuildApp/e-paper/testDisplay.py', 'first', 'second', 'third', 'fourth']);

    //TODO: Enable once blinksticks are connected
    if (buildStatus === "inProgress" || buildStatus === "running") {
        //TODO: Add Build Light logic here for in motion builds
        console.log("**Blinking Yellow");
        //led.blink('yellow');
    } else if (buildStatus === "completed" && buildResult === "succeeded") {
        //TODO: Add success status light here (green)
        console.log("**Solid Green");
        //led.setColor('green');
    } else if (buildStatus === "completed" && buildResult === "failed") {
        //TODO: Add failure status light here (red)
        console.log("**Solid Red");
        //led.setColor('red');
    }
}

module.exports = {
    BuildLight
}