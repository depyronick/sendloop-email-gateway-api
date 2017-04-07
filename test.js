/**
 * Created by Ali Poder on 7.04.2017.
 */
var Message = require('./lib/models/Message');
var Sendloop = require('./index.js');
var sendLoop = new Sendloop({
    apiKey: "1213"
});
sendLoop.send(1, new Message(), 1, 1, 1);