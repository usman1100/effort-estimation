const express = require("express");
const morgan = require("morgan")
const session = require("express-session")
const calc = require("./calculations")


const app = express();
const port = 1313;


// app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'keyboard cat',
  }))

app.get("/", (req, res)=>{
    return res.render("index.ejs")
})

app.get("/model1", (req, res)=>{
    return res.render("model1.ejs")
})

app.post("/model1post", (req, res)=>{
    let data = calc.UCP(req.body);


    req.session.effort1 = data.effort;
    req.session.ucpDetails = data.ucpDetails;
    req.session.projectAttributes = data.projectAttributes;


    data.distances = calc.getNearestNeighbors(data.projectAttributes);
    return res.json(data)
})


app.get("/details",(req, res)=>{

    return res.render("details.ejs", {"data":req.session.ucpDetails})

})


app.get("/sus",(req, res)=>{
    if(!req.session.view) req.session.view=1;
    else req.session.view+=1;
    res.json(req.session.view)
})


app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`);
})
