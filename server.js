require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");// debugging package
const cors = require("cors");
const res = require('express/lib/response');

const { PORT= 4020, DATABASE_URL } = process.env;

const app = express();

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewURLParser: true
});

mongoose.connection
    .on("open", () => console.log('you are connected to mongoose'))
    .on("close", () => ('You are disconnected from mongoose'))
    .on("error", (error) => console.log(error))

const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());



// Get Route
app.get('/', (req, res) => {
    res.send("Hello World")
});

app.get('/people', async (req, res) => {
    try{
        res.json(await People.find({}));
    }catch(error){
        res.status(400).json(error)
    }
});

//Create Route
app.post('/people', async (req, res) => {
    try{
        res.json(await People.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
});

app.put('/people/:id', async (req,res) => {
    try{
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }catch(error){
        res.status(400).json(error)
    }
})

//Delete route
app.delete('/peolple/:id', async (req, res) => {
    try{
        res.json(await People.findByIdAndDelete(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
});

app.get('/people/:id', async (req, res)=> {
    try{
        res.json(await People.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})
















app.listen(PORT, () => {
    console.log("listening to PORT 4020")
})