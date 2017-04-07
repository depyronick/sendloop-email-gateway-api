var needle = require('needle');
var extend = require('extend');

var Message = require('./models/Message');

function Sendloop(config) {
    this.apiUrl = "https://app.sendloop.com/api/v4/mta.json";

    this.config = extend({
        apiKey: "",
        userAgent: "Sendloop-PHP/1.2.0",
        timeout: 500,
        connectTimeout: 40
    }, config);

    if (typeof this.config.apiKey !== "string") {
        throw new Error("API key must be a string.");
    } else if (typeof this.config.apiKey === "undefined") {
        throw new Error("Invalid API Key. API key must be defined.")
    } else if (this.config.apiKey == "") {
        throw new Error("API key cannot be empty.");
    }
}

Sendloop.prototype.send = function(emailAddress, message, customArgs, mergeVars, options, callback) {
    var self = this;

    self.defaultOptions = {
        trackOpens: false,
        trackClicks: false,
        trackECommerce: false,
        trackGA: false,
        tags: []
    };

    options = options || self.defaultOptions;

    if(!(message instanceof Message)) {
        throw new Error('message is not an instance of Message');
    }

    var fromData = message.getFrom();
    var fromName = fromData[0];
    var fromEmail = fromData[1];

    var replyToData = message.getReplyTo();
    var replyToName = replyToData[0];
    var replyToEmail = replyToData[1];

    if(replyToEmail == null) {
        replyToName = fromName;
        replyToEmail = fromEmail;
    }

    var toName;
    var toEmail;
    if(emailAddress instanceof Array && emailAddress.length === 2) {
        toName = emailAddress[0];
        toEmail = emailAddress[1];
    } else {
        toEmail = emailAddress;
        toName = "";
    }

    var requestParameters = {
        From: fromEmail,
        FromName: fromName,
        To: toEmail,
        ToName: toName,
        ReplyTo: replyToEmail,
        ReplyToName: replyToName,
        Subject: message.getSubject(),
        TextBody: message.getTextContent(),
        HTMLBody: message.getHTMLContent(),
        MergeVars: JSON.stringify(mergeVars),
        CustomArgs: JSON.stringify(customArgs),
        TrackOpens: options.trackOpens,
        TrackClicks: options.trackClicks,
        TrackECommerce: options.trackECommerce,
        TrackGA: options.trackGA,
        Tags: JSON.stringify(options.tags)
    };

    needle.request("POST", self.apiUrl, requestParameters, {
        json: false,
        headers: self.getRequestHeaders()
    }, function(error, response) {
        if(error) {
            throw error;
        } else {
            if(response.statusCode == 401) {
                throw new Error("Invalid API Key.");
            }

            var decodedResponse;
            if(response) {
                try {
                    decodedResponse = JSON.parse(response.body);
                } catch (exception) {
                    throw new Error("Unable to decode JSON response from Sendloop API");
                }
            } else {
                throw new Error("Unable to get response from Sendloop API");
            }

            var flooredStatusCode = Math.floor(response.statusCode / 100);

            if(flooredStatusCode >= 4) {
                throw new Error(decodedResponse.Status ? decodedResponse.Status : "");
            }

            callback(decodedResponse.MessageID);
        }
    })

};

Sendloop.prototype.getRequestHeaders = function() {
    return {
        "Authorization" : "Basic " + new Buffer(this.apiKey + ":X").toString('base64')
    }
};



module.exports = Sendloop;