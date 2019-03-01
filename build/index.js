"use strict";

var _saasdata = _interopRequireDefault(require("./saasdata.json"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// request logger
if (process.platform === "darwin") {
  require("dotenv").config();
}

var app = (0, _express.default)(); // express app

app.use((0, _morgan.default)('tiny')); // morgan
// MICKEY MOUSE ENTERPRISE-GRADE SECURITY AS A SERVICE

var superSecretApiKeys = process.env.APIKEYS.split(",");
var doEnterpriseLevelSecurityCheck = true;
app.get('/', function (req, res) {
  res.send("<h1>SaaS - Simpsons as a Service</h1>");
}); // default route
// DaaS

var doh = app.get('/doh', function (req, res) {
  res.json({
    message: "D'oh!"
  });
}); // D'oh!
// character route

var character = app.get(["/characters", "/api/characters", "/chars"], function (req, res) {
  var headers = req.headers;
  var apikey = req.headers.apikey;
  var search = req.query;
  console.log("APIKEY: ".concat(JSON.stringify(apikey) || "none"));
  EnterpriseLevelSecurityCheck(req, res).then(function (passed) {
    if (!passed) return;
    console.log("queryprop: ".concat(Object.keys(search)[0]));

    if (!Object.keys(search)[0]) {
      res.send("<h1>SaaS character-endpoint. Retrieve a character using ?name=[charactername] </h1>");
    } else {
      var queryProp = capitalize(Object.keys(search)[0]);
      var queryText = decodeURIComponent(search[queryProp]);

      var charResults = _saasdata.default.filter(function (char) {
        if (!char[queryProp]) {
          return false;
        }

        return char[queryProp] == queryText;
      });

      if (charResults.length) {
        res.send(JSON.stringify(_toConsumableArray(charResults)));
      } else {
        res.send("No character with ".concat(queryProp, " ").concat(queryText, " in the SaaS-database"));
      }
    }
  });
});

function EnterpriseLevelSecurityCheck(req, res) {
  return new Promise(function (resolve, reject) {
    if (!doEnterpriseLevelSecurityCheck) {
      resolve(true);
      return;
    }

    if (!req.headers.apikey) {
      res.send("NO API KEY SPECIFIED. ASK PUZZLEBART FOR ONE! We're all about sharing :D");
      resolve(false);
    } else {
      if (superSecretApiKeys.includes(req.headers.apikey)) {
        resolve(true);
      } else {
        res.send("WRONG API KEY SPECIFIED. ARE YOU HACKING???!");
        resolve(false);
      }
    }
  });
} // Stupid sexy jslint


var capitalize = function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

app.listen(process.env.PORT || '3000', function () {
  return console.log("running on port ".concat(process.env.PORT || '3000'));
}); // starting
//# sourceMappingURL=index.js.map