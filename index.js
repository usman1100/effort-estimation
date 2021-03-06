const express = require("express");
const morgan = require("morgan")
const session = require("express-session")
const calc = require("./calculations")


const app = express();
const port = process.env.PORT || 1313;


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


    req.session.effort3 = calc.getNearestNeighbors(data.projectAttributes);
    return res.redirect("/details")
})


app.get("/details",(req, res)=>{
    return res.render("details.ejs", {
        data:req.session.ucpDetails,
        effort3:req.session.effort3
        })

})


app.get("/debug",(req, res)=>{
    return res.json(req.session);

})




app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`);
})