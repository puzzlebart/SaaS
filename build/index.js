"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _saasdata = _interopRequireDefault(require("./saasdata.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// framework
// request logger
var app = (0, _express.default)(); // express app 

app.use((0, _morgan.default)('tiny')); // morgan
// <ENDPOINTS>

app.get('/', function (req, res) {
  res.send("<h1>SaaS - Simpsons as a Service</h1>");
}); // default route
// DaaS

var doh = app.get('/doh', function (req, res) {
  res.json({
    message: "D'oh!"
  });
}); // D'oh!

var character = app.get(["/characters", "/api/characters", "/chars"], function (req, res) {
  var search = req.query;
  var queryProp = Object.keys(search)[0];
  console.log("queryprop: ".concat(queryProp));

  if (!queryProp) {
    res.send("<h1>SaaS character-endpoint. Retrieve a character using ?name=[charactername] </h1>");
  } else {
    // Name search
    if (queryProp.toString().toLowerCase() === "name") {
      var nameQuery = decodeURIComponent(search[queryProp].toLowerCase());

      var _character = _saasdata.default.filter(function (char) {
        if (!char[queryProp]) {
          return false;
        }

        return char[queryProp].toLowerCase() === nameQuery;
      });

      if (_character.length) {
        res.send(JSON.stringify(_character[0]));
      } else {
        res.send("No character with the name ".concat(nameQuery, " in the SaaS-database"));
      }
    }
  }
}); // </ENDPOINTS>

app.listen(process.env.PORT || '3000', function () {
  return console.log("running on port ".concat(process.env.PORT || '3000'));
}); // starting
//# sourceMappingURL=index.js.map