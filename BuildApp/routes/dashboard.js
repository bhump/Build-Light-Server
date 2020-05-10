require('dotenv').config({
  path: __dirname + '/./../../.env'
});
var express = require('express');
var encrpytionService = require('../services/encryptionService');
var azureService = require('../services/azureService');
var databaseService = require('../services/databaseService');
var ledService = require('../services/ledService');
var displayService = require('../services/displayService');
var notifier = require('../notifier');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  var hooks = await databaseService.GetWebhooks();
  var pollingList = await databaseService.GetPolling();

  InitializeWebhookRoutes(hooks);
  InitializePolling();

  var availableHooks = [];

  hooks.forEach(item => {
    var hookItem = {
      'id': item.id,
      'hookUrl': item.hookUrl,
      'isEnabled': item.isEnabled
    }

    availableHooks.push(hookItem);
  });

  res.render('dashboard', {
    title: 'Lonely Sasquatch Status Hub',
    project: 'Status Hub',
    hooks: availableHooks,
    polling: pollingList
  });

});

notifier.on('newWebHookAdded', (message) => {
  console.log(message);
  var hookUrl = '/' + message.hookUrl;
  router.post(hookUrl, (req, res) => {
    console.log(req.body);
    res.status(200).end();

    var status = req.body.stage.state;
    var result = req.body.stage.result;

    ledService.BuildLight(status, result);
  });
});

router.post('/deleteWebhook', async function (req, res) {
  let id = req.body.id;
  var isSuccess = await databaseService.DeleteWebhook(id);

  res.send(isSuccess);
});

router.post('/deletePoll', async function (req, res) {
  let id = req.body.id;
  var isSuccess = await databaseService.DeletePoll(id);

  if (isSuccess) {
    res.send(isSuccess);
  }
});

router.post('/addNewWebhook', async function (req, res) {
  var item = req.body;

  var isEnabled = false;

  if (item.isEnabled === 'on') {
    isEnabled = true;
  } else {
    isEnabled = false;
  }

  var hook = {
    'hookUrl': item.hookUrl,
    'isEnabled': isEnabled
  }

  var isSuccess = await databaseService.SaveNewWebhook(hook);

  if (isSuccess) {

    var hooks = await databaseService.GetWebhooks();

    var availableHooks = [];

    hooks.forEach(item => {
      var hookItem = {
        'id': item.id,
        'hookUrl': item.hookUrl,
        'isEnabled': item.isEnabled
      }

      availableHooks.push(hookItem);

    });

    var pollingList = await databaseService.GetPolling();

    res.status(200).send(availableHooks);
  }

});

router.post('/addNewPoll', async function (req, res) {
  var item = req.body;
  var isEnabled = false;

  if (item.isEnabled === 'on') {
    isEnabled = true;
  } else {
    isEnabled = false;
  }

  var encryptedToken = await encrpytionService.Encrypt(item.accessToken);

  var encryptionObject = {
    encryptedData: encryptedToken.encryptedData,
    iv: encryptedToken.iv
  }

  var poll = {
    'pollingUrl': item.pollingUrl,
    'accessToken': encryptionObject,
    'isEnabled': isEnabled,
    'pollingInterval': item.pollingInterval
  }

  var isSuccess = await databaseService.SaveNewPolling(poll);

  if (isSuccess) {
    //azureService.SetPoll(poll.pollingUrl, item.accessToken, poll.pollingInterval);
  }

  res.send(isSuccess);
});

function InitializeWebhookRoutes(hooks) {
  hooks.forEach(item => {

    var isEnabled = item.isEnabled;
    var hookUrl = '/' + item.hookUrl;

    router.post(hookUrl, (req, res) => {
      console.log(req.body);
      res.status(200).end();

      try {

        var project = '';
        var stage = '';
        var status = '';
        var result = '';

        if (req.body.resource.pipeline != undefined) {
          project = req.body.resource.pipeline.name;
          stage = req.body.resource.stage.name;
          status = req.body.resource.stage.state;
          result = req.body.resource.stage.result;
        } else{
          project = req.body.resource.pipeline.name;
          // stage = req.body.resource.run.createdDate;
          status = req.body.resource.run.state;
          result = req.body.resource.run.result;
        }

        displayService.Display(project, stage, status, result);
        ledService.BuildLight(status, result);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

function InitializePolling() {
  azureService.InitializePollingBuilds();
};

module.exports = router;