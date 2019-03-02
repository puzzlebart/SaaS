// @ts-ignore
import SaaSData from './saasdata.json'; // scalable enterprise-grade JSON document storage
import express from 'express'; // framework, yo
import morgan from 'morgan'; // request logger
import axios from "axios";
if (process.platform === "darwin") { require("dotenv").config() } // enterprise-grade MacOS-detection
const app = express() // express app instance
app.use(morgan('tiny')) // morgan


const REQUIRED_REACTOR_POWER_IN_GIGAWATTS = 30000
const REACTOR_TOO_MUCH_POWER = 50000


//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // Remember to have apikey here, else our enterprise-grade authorization-system will fail
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length, Cache-Control, Accept, apikey");
    next();
});


// MICKEY MOUSE ENTERPRISE-GRADE SECURITY AS A SERVICE
const superSecretApiKeys = process.env.APIKEYS.split(",")
const doEnterpriseLevelSecurityCheck = true;
// ENTERPRISE GRADE RANDOMIZATION ENGINE
const randomize = (min, max) => Math.round((Math.random() * (max - min) + min))

// TIHIaaS -  Thanks, I hate it as a Service
let tihi = app.get('/tihi', (req, res) => { res.redirect("https://www.youtube.com/watch?v=-Lez_WdX7Oc") })

// version
let version = app.get("/version", (req, res) => { res.json({ version: "1.0.0" }) })

// DaaS - D´oh! as a Service
let doh = app.get('/doh', (req, res) => { res.json({ message: "D'oh!" }) }) // D'oh!

let quotes = app.get('/quotes', (req, res) => {
    EnterpriseLevelSecurityCheck(req, res).then(passed => { // VERY IMPORTANT SECURITY STUUFF
        let charsWithQuotes = SaaSData.filter(char => char.Quotes.length >= 1)
        const getRandomChar = () => charsWithQuotes[randomize(0, charsWithQuotes.length - 1)]
        const getRandomQuote = (char) => char.Quotes.length === 1 ? char.Quotes[0] : char.Quotes[randomize(0, char.Quotes.length - 1)];
        const getRandomQuoteObject = () => {
            let rChar = getRandomChar()
            let rQuote = getRandomQuote(rChar)
            return { Quote: rQuote, Name: rChar.Name, Picture: rChar.Picture }
        }
        if (!req.query.amount) {
            console.log("getting random quote")
            // sensible - random by default
            // God this is so horrible
            res.json(getRandomQuoteObject())
        } if (req.query.amount) {
            if (isNaN(parseInt(req.query.amount))) { res.json({ error: "YOU HAVE TO SPECIFY A NUMBER AS AMOUNT, DOOFUS" }) }
            let chars = []
            for (let i = 0; i < req.query.amount; i++) { chars.push(getRandomQuoteObject()) }
            res.json(chars)
        }
        else {
            console.log(req.query)
        }
    })
})

// SEARCH FUNCTION YEAOIAUSODIUASDOIS
let search = app.get(["/search", "/find"], (req, res) => {
    EnterpriseLevelSecurityCheck(req, res).then(passed => {
        let q = req.query.q;
        if (!q) res.json({ error: "no query specified. use ?q=[querystring]" })
        if (q.length < 3) { res.json({ message: "type at least three characters to search" }) } else {
            q = decodeURIComponent(q.toLowerCase());
            let matches = SaaSData.filter(char => {
                let name = char.Name ? char.Name.toLowerCase() : "";
                let occupation = char.Occupation ? char.Occupation.toLowerCase() : "";
                return name.indexOf(q) > -1 || occupation.indexOf(q) > -1
            })
            res.json(matches)
        }
    })
})

// character route
let character = app.get(["/characters", "/api/characters", "/chars", "/characters/random"], (req, res) => {
    console.log(`APIKEY: ${JSON.stringify(req.headers.apikey) || "none"}`)
    EnterpriseLevelSecurityCheck(req, res).then(passed => {
        if (!passed) return;
        let search = req.query;
        if (req.url.indexOf("/random") > -1) {
            const getRandomCharacter = () => SaaSData[randomize(0, SaaSData.length)];
            //return random character
            if (req.query.amount) {
                if (isNaN(parseInt(req.query.amount))) { res.json({ error: "YOU HAVE TO SPECIFY A NUMBER AS AMOUNT, DOOFUS" }) }
                let randomChars = []
                for (let i = 0; i < req.query.amount; i++) { randomChars.push(getRandomCharacter()) }
                res.json(randomChars)
            }
            res.json(SaaSData[randomize(0, SaaSData.length)])
        }
        console.log(`queryprop: ${Object.keys(search)[0]}`)
        if (!Object.keys(search)[0]) { res.send(`<h1>SaaS character-endpoint. Retrieve a character using ?name=[charactername] or ?id=[characterId] </h1>`) } else {
            let queryProp = capitalize(Object.keys(search)[0])
            let queryText = decodeURIComponent(search[queryProp])
            let charResults = SaaSData.filter(char => { if (!char[queryProp]) { return false; } return char[queryProp] == queryText })
            if (charResults.length) { res.json([...charResults]) }
            else {
                res.send(`No character with ${queryProp} ${queryText} in the SaaS-database`)
            }
        }
    });
})

function ReactorControllerHumidityCheck(req, res) {
    return new Promise((resolve, reject) => {
        if (req.headers.ignore == "true" || req.query.ignore == "true") { resolve(true) } else {
            axios.get('https://reactorapi20190302034437.azurewebsites.net/api/CanServerLive?code=41b/36amxQJFkHR94dhMTyyM7A46vxOgu6Bw4yigAyojYucsH3P4Lw==')
                .then(response => {
                    console.log(`got reactor core data:`)
                    console.log(JSON.stringify(response.data))
                    let watts = Math.round(response.data.watt)
                    if (watts < REQUIRED_REACTOR_POWER_IN_GIGAWATTS && watts !== 0) {
                        console.log(`---------- WARNING ------------- REACTOR POWER LESS THAN 30GW, currently at ${watts}GW`)
                        resolve([true, watts]) // CHANGE TO FALSE
                    } else if (watts > REQUIRED_REACTOR_POWER_IN_GIGAWATTS) {
                        console.log(`--------ALL GOOD, REACTOR POWER AT ${watts}GW`)
                        resolve([true, watts])
                    } else {
                        console.log(`--------REACTOR POWER DETECTOR CURRENTLY UNAVAILABLE--------`)
                        resolve([true, watts]) // fuck this guy
                    }
                })
        }
    })
}


// ENTERPRISE LEVEL SECURITY ENGINE AUTOMATRON - DO NOT TOUCH IT'S PERFECT THANKS
function EnterpriseLevelSecurityCheck(req, res) {
    return new Promise((resolve, reject) => {
        if (!doEnterpriseLevelSecurityCheck || req.get('host').indexOf("localhost") > -1) { resolve(true); return; }
        if (!req.headers.apikey && !req.query.apikey) {
            res.json({ error: `NO API KEY SPECIFIED. ASK PUZZLEBART FOR ONE! We're all about sharing :D` })
            resolve(false)
        } else {
            if (superSecretApiKeys.includes(req.headers.apikey) || superSecretApiKeys.includes(req.query.apikey)) { resolve(true) } else {
                res.json({ error: `WRONG API KEY SPECIFIED - ARE YOU HACKING???!` })
                resolve(false)
            }
        }
    })
}
// END SECURITIFICATION


// Stupid sexy jslint
const capitalize = (s) => { if (typeof s !== 'string') return ''; return s.charAt(0).toUpperCase() + s.slice(1) }


// FRONT PAGE
app.get('/', (req, res) => {
    ReactorControllerHumidityCheck(req, res).then(([passed, watts]) => {
        res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Simpsons as a Service</title>
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css"
        rel="stylesheet">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@Kimzter">
    <meta name="og:title" content="Simpsons As A Service">
    <meta name="og:description" content="SaaS provides a modern, RESTful, scalable API for Simpsons character data.">
    <script src="//code.jquery.com/jquery-3.1.1.min.js" type="text/javascript"></script>
</head>

<body>
    <div class="container">
        <div class="hero-unit">
            <h1>SaaS</h1>
            <h2>Simpsons As A Service</h2>
            <p><em>v1.0.0 - <br/><b>REACTOR POWER ${watts !== 0 ? watts<REQUIRED_REACTOR_POWER_IN_GIGAWATTS ? "TOO LOW, SHOULD BE >30000KW, CURRENTLY AT "+watts+"KW.<br/>API REQUESTS MIGHT BE SLOW" : "PRETTY GOOD, CURRENTLY AT "+watts+"KW" : "UNAVAILABLE, API REQUESTS MIGHT BE SLOW"}</b></em></p>
        </div>
    </div>
    <div class="container">
        <div class="content" style="margin-left:50px;">
            <h2 id="introduction">Introduction</h2>
            <p>SaaS (Simpsons As A Service) provides a modern, RESTful, scalable way of getting Simpsons Character data</p>
            <h2 id="api">API</h2>
            <h3 id="contentnegotiation">Content Negotiation</h3>
            <p>SaaS responds in JSON format</p>
            <h3 id="operations">Operations</h3>
            <table class="table" id="ops">
                <tr>
                    <th>Path</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>/version</td>
                    <td>Returns the current SaaS version number.</td>
                </tr>
                <tr>
                    <td>/characters</td>
                    <td>The main character endpoint</td>
                </tr>
                <tr>
                    <td>/characters/random</td>
                    <td>Returns a random character</td>
                </tr>
                <tr>
                    <td>/doh</td>
                    <td>D'oh! As A Service</td>
                </tr>
                <tr>
                    <td>/quotes</td>
                    <td>Returns a random quote, as well as the name and photo of the quotee</td>
                </tr>
                <tr>
                    <td>/find</td>
                    <td>Search function. Takes q as input parameter, e.g. /find?q=Bart Simpson</td>
                </tr>
                <tr>
                    <td>/tihi</td>
                    <td>TIHIaas - Thanks, I hate it as a Service</td>
                </tr>
            </table>
            <p>The <code>/characters/random</code> and <code>/quotes</code> endpoints support the <code>amount</code> switch. E.g. /characters/random?amount=10
            <h3 id="operations">Example usage</h3>
            <p><b>cURL</b></p>
            <code>curl -L "http://saas.puzzlebart.no/characters?Name=Homer%20Simpson" -H apikey:"YOUR_API_KEY"</code>
            <br/>
            <br/>
            <p><b>fetch</b></p>
            <code>await fetch("http://saas.puzzlebart.no/characters?Name=Homer%20Simpson",{headers:{apikey:"YOUR_API_KEY"}}).then(d=>d.json().then(r=>r))</code>
            <br/>
            <br/>
            <p><b>in-browser</b></p>
            <code>http://saas.puzzlebart.no/characters?Name=Homer%20Simpson&apikey=EATMYSHORTS</code>
            <p></p>
            <p><a href="https://github.com/puzzlebart/saas">Fork us on github!</a></p>
            <p>Created by <a href="https://twitter.com/Kimzter">@Kimzter</a></p>
        </div>
    </div>
</body>
</html>
`)
    })
});

// error route
app.get('(/*)?', (req, res) => {
    res.send(`
<html>
<head>
    <title>Simpsons as a Service</title>
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
    <meta name="og:title" content="Simpsons As A Service">
    <script src="//code.jquery.com/jquery-3.1.1.min.js" type="text/javascript"></script>
</head>
<body>
    <div class="container">
        <div class="hero-unit">
            <h1>742 - D'oh!</h1>
            <h2>This is not the endpoint you are looking for</h2>
            <p><em>Simpsons as a Service v1.0.0</em></p>
        </div>
    </div>
    <center><a href="/">saas.puzzlebart.no</a>
    </body></html>`)
}) // D'oh!

app.listen(process.env.PORT || '3000', () => console.log(`running on port ${process.env.PORT || '3000'}`))