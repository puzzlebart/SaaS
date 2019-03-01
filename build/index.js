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
//CORS

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Remember to have apikey here, else our enterprise-grade authorization-system will fail

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, apikey");
  next();
}); // MICKEY MOUSE ENTERPRISE-GRADE SECURITY AS A SERVICE

var superSecretApiKeys = process.env.APIKEYS.split(",");
var doEnterpriseLevelSecurityCheck = true; // DaaS

var doh = app.get('/doh', function (req, res) {
  res.json({
    message: "D'oh!"
  });
}); // D'oh!

var quotes = app.get('/quotes', function (req, res) {
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
      res.send("<h1>SaaS character-endpoint. Retrieve a character using ?name=[charactername] or ?id=[characterId] </h1>");
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
}; // FRONT PAGE


app.get('/', function (req, res) {
  res.send("<!DOCTYPE html>\n<html>\n\n<head>\n    <title>Simpsons as a Service</title>\n    <link href=\"//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css\"\n        rel=\"stylesheet\">\n    <meta name=\"twitter:card\" content=\"summary\">\n    <meta name=\"twitter:creator\" content=\"@Kimzter\">\n    <meta name=\"og:title\" content=\"Simpsons As A Service\">\n    <meta name=\"og:description\" content=\"SaaS provides a modern, RESTful, scalable API for Simpsons character data.\">\n    <script src=\"//code.jquery.com/jquery-3.1.1.min.js\" type=\"text/javascript\"></script>\n</head>\n\n<body>\n    <div class=\"container\">\n        <div class=\"hero-unit\">\n            <h1>SaaS</h1>\n            <h2>Simpsons As A Service</h2>\n            <p><em>v1.0.0</em></p>\n        </div>\n    </div>\n    <div class=\"container\">\n        <div class=\"content\" style=\"margin-left:50px;\">\n            <h2 id=\"introduction\">Introduction</h2>\n            <p>SaaS (Simpsons As A Service) provides a modern, RESTful, scalable way of getting Simpsons Character data</p>\n            <h2 id=\"api\">API</h2>\n            <h3 id=\"contentnegotiation\">Content Negotiation</h3>\n            <p>SaaS responds in JSON formatted text</p>\n            <h3 id=\"operations\">Operations</h3>\n            <table class=\"table\" id=\"ops\">\n                <tr>\n                    <th>Path</th>\n                    <th>Description</th>\n                </tr>\n                <tr>\n                    <td>/version</td>\n                    <td>Returns the current SaaS version number.</td>\n                </tr>\n\n                <tr>\n                    <td>/characters</td>\n                    <td>The main character endpoint</td>\n                </tr>\n                <tr>\n                    <td>/doh</td>\n                    <td>D'oh! As A Service</td>\n                </tr>\n                <tr>\n                    <td>/quotes</td>\n                    <td>quotes from a character, should they have any</td>\n                </tr>\n                <tr>\n                    <td>/picture</td>\n                    <td>Returns the main character photo</td>\n                </tr>\n            </table>\n            <h3 id=\"operations\">Example usage</h3>\n            <p><b>cURL</b></p>\n            <code>curl -L \"http://saas.puzzlebart.no/characters?Name=Homer%20Simpson\" -H apikey:\"YOUR_API_KEY\"</code>\n            <br/>\n            <br/>\n            <p><b>fetch</b></p>\n            <code>await fetch(\"http://saas.puzzlebart.no/characters?Name=Homer%20Simpson\",{headers:{apikey:\"YOUR_API_KEY\"}}).then(d=>d.json().then(r=>r))</code>\n            <p></p>\n            <p><a href=\"https://github.com/puzzlebart/saas\">Fork us on github!</a></p>\n            <p>Created by <a href=\"https://twitter.com/Kimzter\">@Kimzter</a></p>\n        </div>\n    </div>\n</body>\n</html>\n");
}); // default route

app.listen(process.env.PORT || '3000', function () {
  return console.log("running on port ".concat(process.env.PORT || '3000'));
}); // starting
//# sourceMappingURL=index.js.map