const express = require("express");
const bodyParser = require('body-parser');
const calc = require("./calculations")
const app = express();
const port = 1313;


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/", (req, res)=>{
    return res.render("index.ejs")
})

app.get("/model1", (req, res)=>{
    return res.render("model1.ejs")
})

app.post("/model1post", (req, res)=>{
    console.log(req.body);
    let data = calc.UCP(req.body);
    return res.json(data)
})


app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`);
})
