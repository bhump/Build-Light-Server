require('dotenv').config({path:__dirname+'/./../../.env'});
var axios = require('axios').default;
var notifier = require('../notifier');
var ledService = require('../services/ledService');
var blinkstick = require('blinkstick');
var lsAccessToken = process.env.LS_TOKEN;
var lsUrl = "https://dev.azure.com/lonelysasquatch/roasted/_apis/build/builds?$top=1&api-version=5.1";
var lsAuth = 'Basic ' + Buffer.from("username" + ":" + lsAccessToken).toString('base64');

let isLsStatusCheckEnabled = false;
let latestBuildStatus = '';
//var firstLed = blinkstick.findFirst();

async function PollBuilds() {
    let response = '';
    setInterval(async function () {
        if (isLsStatusCheckEnabled) {
             await axios.get(lsUrl, {
                headers: {
                    'Authorization': lsAuth
                }
            }).then(response => {
                latestBuildStatus = response;

                var buildStatus = response.data.value[0].status;
                var buildResult = response.data.value[0].result;
    
                ledService.BuildLight(buildStatus, buildResult);
    
                notifier.emit('newBuildStatus', response)
            });
        }
    }, 20000);
};

function SetCheckEnabled(isCheckEnabled) {
    isStatusCheckEnabled = isCheckEnabled;
};

module.exports = {
    PollBuilds,
    SetCheckEnabled
};