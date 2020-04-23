require('dotenv').config();
var axios = require('axios').default;
var notifier = require('../notifier')
var blinkstick = require('blinkstick');
var lsAccessToken = "wu63wfmqjhrnsl3lic4p6c6tg3f5cgwsmxi4cbrw6y5vl6rersvq";
var lsUrl = "https://dev.azure.com/lonelysasquatch/roasted/_apis/build/builds?=1&api-version=5.1";
var lsAuth = 'Basic ' + Buffer.from("username" + ":" + lsAccessToken).toString('base64');

let isLsStatusCheckEnabled = true;
let latestBuildStatus = '';
//var firstLed = blinkstick.findFirst();

async function PollBuilds() {
    let response = '';
    setInterval(async function () {
        if (isLsStatusCheckEnabled) {

            response = await axios.get(lsUrl, {
                headers: {
                    'Authorization': lsAuth
                }
            });

            latestBuildStatus = response;

            var buildStatus = response.data.value[0].status;
            var buildResult = response.data.value[0].result;

            BuildLight(buildStatus, buildResult);

            notifier.emit('newBuildStatus', response)
        }
    }, 20000);
};

function SetCheckEnabled(isCheckEnabled) {
    isStatusCheckEnabled = isCheckEnabled;
};

function BuildLight(status, result, led) {
    let buildStatus = status;
    let buildResult = result;

    //TODO: Enable once blinksticks are connected
    if (buildStatus === "inProgress") {
        //TODO: Add Build Light logic here for in motion builds
        console.log("**Blinking Yellow");
        //led.blink('yellow');
    } else if (buildStatus === "completed" && buildResult === "succeeded") {
        //TODO: Add success status light here (green)
        console.log("**Solid Green");
        //led.setColor('green');
    } else if (buildStats === "completed" && buildResult === "failed") {
        //TODO: Add failure status light here (red)
        console.log("**Solid Red");
        //led.setColor('red');
    }
}

module.exports = {
    PollBuilds,
    SetCheckEnabled
};