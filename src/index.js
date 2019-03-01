// @ts-ignore
import SaaSData from './saasdata.json';
import express from 'express'; // framework
import morgan from 'morgan'; // request logger
if (process.platform === "darwin") { require("dotenv").config() }
const app = express() // express app
app.use(morgan('tiny')) // morgan

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // Remember to have apikey here, else our enterprise-grade authorization-system will fail
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, apikey");
    next();
  });

// MICKEY MOUSE ENTERPRISE-GRADE SECURITY AS A SERVICE
const superSecretApiKeys = process.env.APIKEYS.split(",")
const doEnterpriseLevelSecurityCheck = true;



// DaaS
let doh = app.get('/doh', (req, res) => { res.json({ message: "D'oh!" }) }) // D'oh!

let quotes = app.get('/quotes', (req, res) => { res.json({ message: "D'oh!" }) }) // D'oh! 

// character route
let character = app.get(["/characters", "/api/characters", "/chars"], (req, res) => {
    let headers = req.headers;
    let apikey = req.headers.apikey;
    let search = req.query;
    console.log(`APIKEY: ${JSON.stringify(apikey) || "none"}`)
    EnterpriseLevelSecurityCheck(req, res).then(passed => {
        if (!passed) return;
        console.log(`queryprop: ${Object.keys(search)[0]}`)
        if (!Object.keys(search)[0]) { res.send(`<h1>SaaS character-endpoint. Retrieve a character using ?name=[charactername] or ?id=[characterId] </h1>`) } else {
            let queryProp = capitalize(Object.keys(search)[0])
            let queryText = decodeURIComponent(search[queryProp])
            let charResults = SaaSData.filter(char => { if (!char[queryProp]) { return false; } return char[queryProp] == queryText })
            if (charResults.length) { res.send(JSON.stringify([...charResults])) }
            else {
                res.send(`No character with ${queryProp} ${queryText} in the SaaS-database`)
            }
        }
    });
})

function EnterpriseLevelSecurityCheck(req, res) {
    return new Promise((resolve, reject) => {
        if (!doEnterpriseLevelSecurityCheck) { resolve(true); return; }
        if (!req.headers.apikey) {
            res.send(`NO API KEY SPECIFIED. ASK PUZZLEBART FOR ONE! We're all about sharing :D`)
            resolve(false)
        } else {
            if (superSecretApiKeys.includes(req.headers.apikey)) { resolve(true) } else {
                res.send(`WRONG API KEY SPECIFIED. ARE YOU HACKING???!`)
                resolve(false)
            }
        }
    })
}

// Stupid sexy jslint
const capitalize = (s) => { if (typeof s !== 'string') return ''; return s.charAt(0).toUpperCase() + s.slice(1) }


// FRONT PAGE
app.get('/', (req, res) => { res.send(`<!DOCTYPE html>
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
            <p><em>v1.0.0</em></p>
        </div>
    </div>
    <div class="container">
        <div class="content" style="margin-left:50px;">
            <h2 id="introduction">Introduction</h2>
            <p>SaaS (Simpsons As A Service) provides a modern, RESTful, scalable way of getting Simpsons Character data</p>
            <h2 id="api">API</h2>
            <h3 id="contentnegotiation">Content Negotiation</h3>
            <p>SaaS responds in JSON formatted text</p>
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
                    <td>/doh</td>
                    <td>D'oh! As A Service</td>
                </tr>
                <tr>
                    <td>/quotes</td>
                    <td>quotes from a character, should they have any</td>
                </tr>
                <tr>
                    <td>/picture</td>
                    <td>Returns the main character photo</td>
                </tr>
            </table>
            <h3 id="operations">Example usage</h3>
            <p><b>cURL</b></p>
            <code>curl -L "http://saas.puzzlebart.no/characters?Name=Homer%20Simpson" -H apikey:"YOUR_API_KEY"</code>
            <br/>
            <br/>
            <p><b>fetch</b></p>
            <code>await fetch("http://saas.puzzlebart.no/characters?Name=Homer%20Simpson",{headers:{apikey:"YOUR_API_KEY"}}).then(d=>d.json().then(r=>r))</code>
            <p></p>
            <p><a href="https://github.com/puzzlebart/saas">Fork us on github!</a></p>
            <p>Created by <a href="https://twitter.com/Kimzter">@Kimzter</a></p>
        </div>
    </div>
</body>
</html>
`) }) // default route


app.listen(process.env.PORT || '3000', () => console.log(`running on port ${process.env.PORT || '3000'}`)) // starting
