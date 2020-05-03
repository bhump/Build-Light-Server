require('dotenv').config({
    path: __dirname + '/./../../.env'
});
var axios = require('axios').default;
var notifier = require('../notifier');
var databaseService = require('../services/databaseService');
var ledService = require('../services/ledService');
var encrpytionService = require('../services/encryptionService.js');
var blinkstick = require('blinkstick');

let isLsStatusCheckEnabled = false;
let latestBuildStatus = '';
//var firstLed = blinkstick.findFirst();

async function InitializePollingBuilds() {

    var pollingList = await databaseService.GetPolling();

    pollingList.forEach(item => {
        var url = item.pollingUrl;
        var decryptedAccessToken = encrpytionService.Decrypt(item.accessToken);
        var pollingInterval = item.pollingInterval;
        //let response = '';
        if (item.isEnabled) {
            SetPoll(url, decryptedAccessToken, pollingInterval);
        }
    });
};

function SetPoll(url, token, interval){
    var auth = 'Basic ' + Buffer.from("username" + ":" + token).toString('base64');
    setInterval(async function () {
        await axios.get(url, {
            headers: {
                'Authorization': auth
            }
        }).then(response => {
            latestBuildStatus = response;

            var buildStatus = response.data.value[0].status;
            var buildResult = response.data.value[0].result;

            ledService.BuildLight(buildStatus, buildResult);

            notifier.emit('newBuildStatus', response)
        });
    }, interval);
}

function SetCheckEnabled(isCheckEnabled) {
    isStatusCheckEnabled = isCheckEnabled;
};

module.exports = {
    InitializePollingBuilds,
    SetPoll,
    SetCheckEnabled
};