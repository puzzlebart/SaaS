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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// MICKEY MOUSE ENTERPRISE-GRADE SECURITY AS A SERVICE
const superSecretApiKeys = process.env.APIKEYS.split(",")
const doEnterpriseLevelSecurityCheck = true;

app.get('/', (req, res) => { res.send(`<h1>SaaS - Simpsons as a Service</h1>`) }) // default route

// DaaS
let doh = app.get('/doh', (req, res) => { res.json({ message: "D'oh!" }) }) // D'oh!

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

app.listen(process.env.PORT || '3000', () => console.log(`running on port ${process.env.PORT || '3000'}`)) // starting
