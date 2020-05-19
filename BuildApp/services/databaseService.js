require('dotenv').config({
    path: __dirname + '/./../../.env'
});
var encrpytionService = require('../services/encryptionService.js');
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
    accessToken: Object,
    isEnabled: Boolean,
    pollingInterval: Number
});

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password: {
        type: Object,
        required: true,
        minlength: 6
    },
});

var runSchema = new mongoose.Schema({
    runId: String,
    createdDate: Date,
    stageName: String,
    isCompleted: Boolean,
    runCompleteTime: Date,
    dateCreated: Date
});

var displayStateSchema = new mongoose.Schema({
    displayId: String,
    isInitiated: Boolean,
    dateInitiated: Date
});

var Webhook = mongoose.model("Webhook", webhookSchema);
var Poll = mongoose.model("Poll", pollingSchema);
var User = mongoose.model("User", userSchema);
var Run = mongoose.model("Run", runSchema);
var Display = mongoose.model("Display", displayStateSchema);

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
        return true;
    } catch (err) {
        console.log("Failed to add time: " + err);
        return false;
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
        return true;
    } catch (err) {
        return false;
    }
};

async function SaveRun(item){
    try{
        var runToAdd = Run(item);
        await runToAdd.save();
        return true;
    }catch(err){
        return false;
    }
};

async function GetRuns(){
    try{
        var query = Run.find();
        query instanceof mongoose.Query;
        var runs = await query;
        return runs;
    }catch(err){
        console.log(err);
        return null;
    }
};

async function UpdateDisplaySettings(item){
    try{
        var query = {'displayId': '1'};
        
        Display.findOneAndUpdate(query, item, {upsert: true}, function(err, doc){
            return true;
        });
    }catch(err){
        return false;
    }
};

async function GetDisplaySettings(){
    var query = { displayId: '1'};
    var display = Display.findOne(query);
    display instanceof mongoose.Query;
    var results = await display; 
    return results;
};

async function CreateAccount(item) {
    // try {
    //     var emailItem = item.Email;
    //     var passwordHash = encrpytionService.Encrypt(item.password);

    //     var newAccount = {
    //         email = emailItem,
    //         password = passwordHash
    //     }

    //     await User.save(newAccount);
    //     return true;
    // } catch (err) {
    //     console.log(err);
    //     return false;
    // }
};

async function Login(item){
    // try{

    //     return true;
    // }catch(err){
    //     console.log(err);
    //     return false;
    // }
}

module.exports = {
    SaveNewWebhook,
    SaveNewPolling,
    GetWebhooks,
    GetPolling,
    DeleteWebhook,
    DeletePoll,
    CreateAccount,
    SaveRun,
    GetRuns,
    UpdateDisplaySettings,
    GetDisplaySettings
}