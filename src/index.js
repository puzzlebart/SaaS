import express from 'express'; // framework
import morgan from 'morgan'; // request logger
import SaaSData from './saasdata.json';
const app = express() // express app 
app.use(morgan('tiny')) // morgan

// <ENDPOINTS>

app.get('/', (req, res) => { res.send(`<h1>SaaS - Simpsons as a Service</h1>`) }) // default route

// DaaS
let doh = app.get('/doh', (req, res) => { res.json({ message: "D'oh!" }) }) // D'oh!

let character = app.get(["/characters", "/api/characters", "/chars"], (req, res) => {
    let search = req.query;
    let queryProp = Object.keys(search)[0]
    console.log(`queryprop: ${queryProp}`)
    if (!queryProp) { res.send(`<h1>SaaS character-endpoint. Retrieve a character using ?name=[charactername] </h1>`) } else {
        // Name search
        if (queryProp.toString().toLowerCase() === "name") {
            let nameQuery = decodeURIComponent(search[queryProp].toLowerCase())
            let character = SaaSData.filter(char => { if (!char[queryProp]) { return false; } return char[queryProp].toLowerCase() === nameQuery })
            if (character.length) {
                res.send(JSON.stringify(character[0]))
            } else {
                res.send(`No character with the name ${nameQuery} in the SaaS-database`)
            }
        }
    }
})
// </ENDPOINTS>

app.listen(process.env.PORT || '3000', () => console.log(`running on port ${process.env.PORT || '3000'}`)) // starting 
