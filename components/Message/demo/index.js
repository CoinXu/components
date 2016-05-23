/**
 * Created by xcp on 2016/3/18.
 */

var Message = require('../index');

function __message(message, log) {
    return function () {
        Message(message, function () {
            console.log(log)
        })
    }
}

function createMessage(len){
    return new Array(len).fill("words").join(' ');
}

setTimeout(__message(createMessage(6), 1), 0);
setTimeout(__message(createMessage(5), 2), 500);
setTimeout(__message(createMessage(4), 3), 1000);
setTimeout(__message(createMessage(5), 4), 1500);
setTimeout(__message(createMessage(6), 6), 2500);
setTimeout(__message(createMessage(7), 7), 3000);