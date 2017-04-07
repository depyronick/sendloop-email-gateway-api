function Message() {

}

Message.prototype.fromName = "";
Message.prototype.fromEmail = "";
Message.prototype.replyToName = "";
Message.prototype.replyToEmail = "";
Message.prototype.subject = "";
Message.prototype.text = "";
Message.prototype.html = "";

Message.prototype.setFrom = function(fromName, fromEmail) {
    fromName = fromName.trim();
    fromEmail = fromEmail.trim();

    if(fromName == null || fromEmail == null) {
        throw new Error("fromName and fromEmail cannot be empty.");
    }

    this.fromName = fromName;
    this.fromEmail = fromEmail;
};

Message.prototype.getFrom = function() {
    return [
        this.fromName,
        this.fromEmail
    ];
};

Message.prototype.setReplyTo = function(replyToName, replyToEmail) {
    this.replyToName = replyToName.trim();
    this.replyToEmail = replyToEmail.trim();
};

Message.prototype.getReplyTo = function() {
    return [
        this.replyToName,
        this.replyToEmail
    ];
};

Message.prototype.setTextContent = function(text) {
    this.text = text.trim();
};

Message.prototype.getTextContent = function() {
    return this.text;
};

Message.prototype.setHTMLContent = function(html) {
    this.html = html.trim();
};

Message.prototype.getHTMLContent = function() {
    return this.html;
};

Message.prototype.setSubject = function (subject) {
    this.subject = subject.trim();
};

Message.prototype.getSubject = function() {
    return this.subject;
};

module.exports = Message;