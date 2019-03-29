"use strict";

var _saasdata = _interopRequireDefault(require("./saasdata.json"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); 
function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

if (process.platform === "darwin") {
  require("dotenv").config();
} // enterprise-grade MacOS-detection


var app = (0, _express.default)(); // express app instance

app.use((0, _morgan.default)('tiny')); // morgan

var REQUIRED_REACTOR_POWER_IN_GIGAWATTS = 30000;
var REACTOR_TOO_MUCH_POWER = 50000; //CORS

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Remember to have apikey here, else our enterprise-grade authorization-system will fail

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length, Cache-Control, Accept, apikey");
  next();
}); // MICKEY MOUSE ENTERPRISE-GRADE SECURITY AS A SERVICE

var superSecretApiKeys = process.env.APIKEYS.split(",");
var doEnterpriseLevelSecurityCheck = true; // ENTERPRISE GRADE RANDOMIZATION ENGINE

var randomize = function randomize(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}; // TIHIaaS -  Thanks, I hate it as a Service


var tihi = app.get('/tihi', function (req, res) {
  res.redirect("https://www.youtube.com/watch?v=-Lez_WdX7Oc");
}); // version

var version = app.get("/version", function (req, res) {
  res.json({
    version: "1.0.0"
  });
}); // DaaS - D´oh! as a Service

var doh = app.get('/doh', function (req, res) {
  res.json({
    message: "D'oh!"
  });
}); // D'oh!

var quotes = app.get('/quotes', function (req, res) {
  EnterpriseLevelSecurityCheck(req, res).then(function (passed) {
    // VERY IMPORTANT SECURITY STUUFF
    var charsWithQuotes = _saasdata.default.filter(function (char) {
      return char.Quotes.length >= 1;
    });

    var getRandomChar = function getRandomChar() {
      return charsWithQuotes[randomize(0, charsWithQuotes.length - 1)];
    };

    var getRandomQuote = function getRandomQuote(char) {
      return char.Quotes.length === 1 ? char.Quotes[0] : char.Quotes[randomize(0, char.Quotes.length - 1)];
    };

    var getRandomQuoteObject = function getRandomQuoteObject() {
      var rChar = getRandomChar();
      var rQuote = getRandomQuote(rChar);
      return {
        Quote: rQuote,
        Name: rChar.Name,
        Picture: rChar.Picture
      };
    };

    if (!req.query.amount) {
      console.log("getting random quote"); // sensible - random by default
      // God this is so horrible

      res.json(getRandomQuoteObject());
    }

    if (req.query.amount) {
      if (isNaN(parseInt(req.query.amount))) {
        res.json({
          error: "YOU HAVE TO SPECIFY A NUMBER AS AMOUNT, DOOFUS"
        });
      }

      var chars = [];

      for (var i = 0; i < req.query.amount; i++) {
        chars.push(getRandomQuoteObject());
      }

      res.json(chars);
    } else {
      console.log(req.query);
    }
  });
}); // SEARCH FUNCTION YEAOIAUSODIUASDOIS

var search = app.get(["/search", "/find"], function (req, res) {
  EnterpriseLevelSecurityCheck(req, res).then(function (passed) {
    var q = req.query.q;
    if (!q) res.json({
      error: "no query specified. use ?q=[querystring]"
    });

    if (q.length < 3) {
      res.json({
        message: "type at least three characters to search"
      });
    } else {
      q = decodeURIComponent(q.toLowerCase());

      var matches = _saasdata.default.filter(function (char) {
        var name = char.Name ? char.Name.toLowerCase() : "";
        var occupation = char.Occupation ? char.Occupation.toLowerCase() : "";
        return name.indexOf(q) > -1 || occupation.indexOf(q) > -1;
      });

      res.json(matches);
    }
  });
}); // character route

var character = app.get(["/characters", "/api/characters", "/chars", "/characters/random"], function (req, res) {
  console.log("APIKEY: ".concat(JSON.stringify(req.headers.apikey) || "none"));
  EnterpriseLevelSecurityCheck(req, res).then(function (passed) {
    if (!passed) return;
    var search = req.query;

    if (req.url.indexOf("/random") > -1) {
      var getRandomCharacter = function getRandomCharacter() {
        return _saasdata.default[randomize(0, _saasdata.default.length)];
      }; //return random character


      if (req.query.amount) {
        if (isNaN(parseInt(req.query.amount))) {
          res.json({
            error: "YOU HAVE TO SPECIFY A NUMBER AS AMOUNT, DOOFUS"
          });
        }

        var randomChars = [];

        for (var i = 0; i < req.query.amount; i++) {
          randomChars.push(getRandomCharacter());
        }

        res.json(randomChars);
      }

      res.json(_saasdata.default[randomize(0, _saasdata.default.length)]);
    }

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
        res.json(_toConsumableArray(charResults));
      } else {
        res.send("No character with ".concat(queryProp, " ").concat(queryText, " in the SaaS-database"));
      }
    }
  });
});

function ReactorControllerHumidityCheck(req, res) {
  return new Promise(function (resolve, reject) {
    resolve([true, "63220"]); // if (req.headers.ignore == "true" || req.query.ignore == "true") { resolve(true) } else {
    //     axios.get('https://reactorapi20190302034437.azurewebsites.net/api/CanServerLive?code=41b/36amxQJFkHR94dhMTyyM7A46vxOgu6Bw4yigAyojYucsH3P4Lw==')
    //         .then(response => {
    //             console.log(`got reactor core data:`)
    //             console.log(JSON.stringify(response.data))
    //             let watts = Math.round(response.data.watt)
    //             if (watts < REQUIRED_REACTOR_POWER_IN_GIGAWATTS && watts !== 0) {
    //                 console.log(`---------- WARNING ------------- REACTOR POWER LESS THAN 30GW, currently at ${watts}GW`)
    //                 resolve([true, watts]) // CHANGE TO FALSE
    //             } else if (watts > REQUIRED_REACTOR_POWER_IN_GIGAWATTS) {
    //                 console.log(`--------ALL GOOD, REACTOR POWER AT ${watts}GW`)
    //                 resolve([true, watts])
    //             } else {
    //                 console.log(`--------REACTOR POWER DETECTOR CURRENTLY UNAVAILABLE--------`)
    //                 resolve([true, watts]) // fuck this guy
    //             }
    //         })
    // }
  });
} // ENTERPRISE LEVEL SECURITY ENGINE AUTOMATRON - DO NOT TOUCH IT'S PERFECT THANKS


function EnterpriseLevelSecurityCheck(req, res) {
  return new Promise(function (resolve, reject) {
    if (!doEnterpriseLevelSecurityCheck || req.get('host').indexOf("localhost") > -1) {
      resolve(true);
      return;
    }

    if (!req.headers.apikey && !req.query.apikey) {
      res.json({
        error: "NO API KEY SPECIFIED. ASK PUZZLEBART FOR ONE! We're all about sharing :D"
      });
      resolve(false);
    } else {
      if (superSecretApiKeys.includes(req.headers.apikey) || superSecretApiKeys.includes(req.query.apikey)) {
        resolve(true);
      } else {
        res.json({
          error: "WRONG API KEY SPECIFIED - ARE YOU HACKING???!"
        });
        resolve(false);
      }
    }
  });
} // END SECURITIFICATION
// Stupid sexy jslint


var capitalize = function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}; // FRONT PAGE


app.get('/', function (req, res) {
  ReactorControllerHumidityCheck(req, res).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        passed = _ref2[0],
        watts = _ref2[1];

    res.send("<!DOCTYPE html>\n<html>\n<head>\n    <title>Simpsons as a Service</title>\n    <link href=\"//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css\"\n        rel=\"stylesheet\">\n    <meta name=\"twitter:card\" content=\"summary\">\n    <meta name=\"twitter:creator\" content=\"@Kimzter\">\n    <meta name=\"og:title\" content=\"Simpsons As A Service\">\n    <meta name=\"og:description\" content=\"SaaS provides a modern, RESTful, scalable API for Simpsons character data.\">\n    <script src=\"//code.jquery.com/jquery-3.1.1.min.js\" type=\"text/javascript\"></script>\n</head>\n\n<body>\n    <div class=\"container\">\n        <div class=\"hero-unit\">\n            <h1>SaaS</h1>\n            <h2>Simpsons As A Service</h2>\n            <p><em>v1.0.0 - <br/><b>REACTOR POWER ".concat(watts !== 0 ? watts < REQUIRED_REACTOR_POWER_IN_GIGAWATTS ? "TOO LOW, SHOULD BE >30000KW, CURRENTLY AT " + watts + "KW.<br/>API REQUESTS MIGHT BE SLOW" : "PRETTY GOOD, CURRENTLY AT " + watts + "KW" : "UNAVAILABLE, API REQUESTS MIGHT BE SLOW", "</b></em></p>\n        </div>\n    </div>\n    <div class=\"container\">\n        <div class=\"content\" style=\"margin-left:50px;\">\n            <h2 id=\"introduction\">Introduction</h2>\n            <p>SaaS (Simpsons As A Service) provides a modern, RESTful, scalable way of getting Simpsons Character data</p>\n            <h2 id=\"api\">API</h2>\n            <h3 id=\"contentnegotiation\">Content Negotiation</h3>\n            <p>SaaS responds in JSON format</p>\n            <h3 id=\"operations\">Operations</h3>\n            <table class=\"table\" id=\"ops\">\n                <tr>\n                    <th>Path</th>\n                    <th>Description</th>\n                </tr>\n                <tr>\n                    <td>/version</td>\n                    <td>Returns the current SaaS version number.</td>\n                </tr>\n                <tr>\n                    <td>/characters</td>\n                    <td>The main character endpoint</td>\n                </tr>\n                <tr>\n                    <td>/characters/random</td>\n                    <td>Returns a random character</td>\n                </tr>\n                <tr>\n                    <td>/doh</td>\n                    <td>D'oh! As A Service</td>\n                </tr>\n                <tr>\n                    <td>/quotes</td>\n                    <td>Returns a random quote, as well as the name and photo of the quotee</td>\n                </tr>\n                <tr>\n                    <td>/find</td>\n                    <td>Search function. Takes q as input parameter, e.g. /find?q=Bart Simpson</td>\n                </tr>\n                <tr>\n                    <td>/tihi</td>\n                    <td>TIHIaas - Thanks, I hate it as a Service</td>\n                </tr>\n            </table>\n            <p>The <code>/characters/random</code> and <code>/quotes</code> endpoints support the <code>amount</code> switch. E.g. /characters/random?amount=10\n            <h3 id=\"operations\">Example usage</h3>\n            <p><b>cURL</b></p>\n            <code>curl -L \"http://saas.puzzlebart.no/characters?Name=Homer%20Simpson\" -H apikey:\"YOUR_API_KEY\"</code>\n            <br/>\n            <br/>\n            <p><b>fetch</b></p>\n            <code>await fetch(\"http://saas.puzzlebart.no/characters?Name=Homer%20Simpson\",{headers:{apikey:\"YOUR_API_KEY\"}}).then(d=>d.json().then(r=>r))</code>\n            <br/>\n            <br/>\n            <p><b>in-browser</b></p>\n            <code>http://saas.puzzlebart.no/characters?Name=Homer%20Simpson&apikey=EATMYSHORTS</code>\n            <p></p>\n            <p><a href=\"https://github.com/puzzlebart/saas\">Fork us on github!</a></p>\n            <p>Created by <a href=\"https://twitter.com/Kimzter\">@Kimzter</a></p>\n        </div>\n    </div>\n</body>\n</html>\n"));
  });
}); // error route

app.get('(/*)?', function (req, res) {
  res.send("\n<html>\n<head>\n    <title>Simpsons as a Service</title>\n    <link href=\"//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css\" rel=\"stylesheet\">\n    <meta name=\"og:title\" content=\"Simpsons As A Service\">\n    <script src=\"//code.jquery.com/jquery-3.1.1.min.js\" type=\"text/javascript\"></script>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"hero-unit\">\n            <h1>742 - D'oh!</h1>\n            <h2>This is not the endpoint you are looking for</h2>\n            <p><em>Simpsons as a Service v1.0.0</em></p>\n        </div>\n    </div>\n    <center><a href=\"/\">saas.puzzlebart.no</a>\n    </body></html>");
}); // D'oh!

app.listen(process.env.PORT || '3000', function () {
  return console.log("running on port ".concat(process.env.PORT || '3000'));
});
//# sourceMappingURL=index.js.map