const etherfx = require('./etherfx')

etherfx.namespace('simplemath')

const sum = function (a: int32, b: int32) : int32 {
    return a + b;
};

const multiply = function (a: int32, b: int32) : int32 {
    return a * b;
};