var express = require('express');
var azureService = require('../services/azureService');
var notifier = require('../notifier')
var router = express.Router();
var isStausCheckEnabled = true;

var newResponse = '';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Lonely Sasquatch Status Hub',
    project: 'Status Hub'
    });
});

router.post('/post', function (req, res) {
  let isEnabled = req.body.isEnabled;
  isStausCheckEnabled = isEnabled;

  azureService.SetLsCheckEnabled(isStausCheckEnabled);

  res.render('index');
});

notifier.on('newBuildStatus', (message) => {
  console.log(message);
  newResponse = message;
  buildStatus = JSON.stringify(message.data.value[0], null, 2);
});

module.exports = router;