var express = require('express');
var azureService = require('../services/azureService');
var databaseService = require('../services/databaseService');
var ledService = require('../services/ledService');
var notifier = require('../notifier');
var router = express.Router();

var newResponse = '';

/* GET home page. */
router.get('/', async function (req, res, next) {

  var hooks = await databaseService.GetWebhooks();

  InitializeWebhookRoutes(hooks);

  var availableHooks = [];

  hooks.forEach(item => {
    var hookItem = {
      'id': item.id,
      'hookUrl': item.hookUrl,
      'isEnabled': item.isEnabled
    }

    availableHooks.push(hookItem);
  });

  res.render('index', {
    title: 'Lonely Sasquatch Status Hub',
    project: 'Status Hub',
    hooks: availableHooks
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

    ledService.BuildLight(buildStatus, buildResult);
  });
});

router.post('/deleteWebhook', async function (req, res) {
  let id = req.body.id;

  var isSuccess = await databaseService.DeleteWebhook(id);

  res.render(isSuccess);
});

router.post('/addNewWebhook', async function (req, res) {
  var item = req.body;

  var isEnabled = false;

  if (item.hookEnabled === 'on') {
    isEnabled = true;
  } else {
    isEnabled = false;
  }

  var hook = {
    'hookUrl': item.webhookUrl,
    'isEnabled': isEnabled
  }

  var isSuccess = await databaseService.SaveNewWebhook(hook);
  res.send(isSuccess);
});

router.post('/addNewPoll', async function(req, res){
  var item = req.body;
  var isEnabled = false;

  if(item.pollEnabled === 'on'){
    isEnabled = true;
  }else {
    isEnabled = false;
  }

  var poll = {
    'pollingUrl': item.pollUrl,
    'accessToken': item.accessToken,
    'isEnabled': isEnabled
  }
  
  var isSuccess = await databaseService.SaveNewPolling(poll);
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
        var status = req.body.resource.stage.state;
        var result = req.body.resource.stage.result;

        ledService.BuildLight(status, result);
      } catch (err) {
        console.log(err);
      }

    });
  });

};

module.exports = router;