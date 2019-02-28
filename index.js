import express from 'express'; // framework
import morgan from 'morgan'; // request logger
const app = express() // express app 
app.use(morgan('tiny')) // morgan

// <ENDPOINTS>
app.get('/', (req, res) => { res.send(`<h1>SaaS - Simpsons as a Service</h1>`)}) // default route
let doh = app.get('/doh', (req, res) => { res.json({ message: "D'oh!" }) }) // D'oh!
let caramba = app.get('/caramba', (req, res) => {res.json({message: "¡Ay, caramba!" }) }) //caramba
let mmm = app.get('/mmm', (req, res) => {res.json({message: "Mmm~mmmmm" }) }) //mmm
let hi = app.get('/hi', (req, res) => {res.json({message: "Hi-Diddily-Ho!" }) }) //Hi but in Flanders
// </ENDPOINTS>

app.listen('742', ()=> console.log(".")) // starting server
