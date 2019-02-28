"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// framework
// request logger
var app = (0, _express.default)(); // express app 

app.use((0, _morgan.default)('tiny')); // morgan
// <ENDPOINTS>

app.get('/', function (req, res) {
  res.send("<h1>SaaS - Simpsons as a Service</h1>");
}); // default route

var doh = app.get('/doh', function (req, res) {
  res.json({
    message: "D'oh!"
  });
}); // D'oh!

var caramba = app.get('/caramba', function (req, res) {
  res.json({
    message: "¡Ay, caramba!"
  });
}); //caramba

var mmm = app.get('/mmm', function (req, res) {
  res.json({
    message: "Mmm~mmmmm"
  });
}); //mmm

var hi = app.get('/hi', function (req, res) {
  res.json({
    message: "Hi-Diddily-Ho!"
  });
}); //Hi but in Flanders

var bart = app.get('/characters/bart', function (req, res) {
  res.json({
    message: {
      Name: "Bart Simpson",
      Bio: "Bartholomew JoJo 'Bart' Simpson (born Feb 23/April 1, 1980)[4] is a main character and the tritagonist of The Simpsons."
    },
    Picture: "https://vignette.wikia.nocookie.net/simpsons/images/6/65/Bart_Simpson.png/revision/latest?cb=20180319061933"
  });
}); // </ENDPOINTS>

app.listen('742', function () {
  return console.log(".");
}); // starting
//# sourceMappingURL=index.js.map