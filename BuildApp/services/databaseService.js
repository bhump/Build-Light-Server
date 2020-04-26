require('dotenv').config({path:__dirname+'/./../../.env'});
var notifier = require('../notifier')
var mongoose = require("mongoose");

var mongoDbConnection = process.env.DB_CONNECTION;

mongoose.Promise = global.Promise;
mongoose.connect(mongoDbConnection, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

var webhookSchema = new mongoose.Schema({
    hookUrl: String,
    isEnabled: Boolean
});

var pollingSchema = new mongoose.Schema({
    pollingUrl: String,
    accessToken: String,
    isEnabled: Boolean
});

var Webhook = mongoose.model("Webhook", webhookSchema);
var Poll = mongoose.model("Poll", pollingSchema);

async function SaveNewWebhook(item) {
    var hookToAdd = Webhook(item);
    try {
        await hookToAdd.save();
        console.log("item saved");
        notifier.emit('newWebHookAdded', item);
        return "item saved";
    } catch (err) {
        console.log("Failed to add item: " + err);
        return err;
    }
};

async function SaveNewPolling(item) {
    var pollToAdd = Poll(item);
    try {
        await pollToAdd.save();
        console.log("item saved");
        return "item saved"
    } catch (err) {
        console.log("Failed to add time: " + err);
        return err;
    }
};

async function GetWebhooks() {
    const query = Webhook.find();
    query instanceof mongoose.Query;
    const hooks = await query;
    return hooks;
};

async function GetPolling() {
    const query = Poll.find();
    query instanceof mongoose.Query;
    const polls = await query;
    return polls;
};

async function DeleteWebhook(itemId) {
    try {
        await Webhook.findByIdAndDelete(itemId);
        return 'delete successful';
    } catch (err) {
        return err;
    }
};

async function DeletePoll(itemId) {
    try {
        await Poll.findByIdAndDelete(itemId);
        return 'delete successful';
    } catch (err) {
        return err;
    }
};

module.exports = {
    SaveNewWebhook,
    SaveNewPolling,
    GetWebhooks,
    GetPolling,
    DeleteWebhook,
    DeletePoll
}