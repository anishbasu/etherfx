var etherfx = require('./etherfx');

etherfx.namespace('simplemath');

var sum = function sum(a, b) {
  return a + b;
};

etherfx.register({
  name: "sum",
  function: sum,
  params: [{
    a: "int32"
  }, {
    b: "int32"
  }],
  returns: "int32"
})

var multiply = function multiply(a, b) {
  return a * b;
};

etherfx.register({
  name: "multiply",
  function: multiply,
  params: [{
    a: "int32"
  }, {
    b: "int32"
  }],
  returns: "int32"
})