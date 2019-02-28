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
let bart = app.get('/characters/bart', (req, res) => {res.json({message: {
Name:"Bart Simpson",
Bio:"Bartholomew JoJo 'Bart' Simpson (born Feb 23/April 1, 1980)[4] is a main character and the tritagonist of The Simpsons."},
Picture:"https://vignette.wikia.nocookie.net/simpsons/images/6/65/Bart_Simpson.png/revision/latest?cb=20180319061933"}) })

// </ENDPOINTS>

app.listen('742', ()=> console.log(".")) // starting 
