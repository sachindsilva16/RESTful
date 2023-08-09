const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const app = express();

const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true })); // To parse our requests
app.use(bodyParser.json());// TO PARSE THE JSON DATA....

app.set("view engine", "ejs");
app.use(express.static("public"));  // To serve our static files like HTML,CSS.

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});


const Article = mongoose.model("Article", articleSchema);


// Article.find({}).then(function(articles){
//     console.log(articles);
// }).catch(function(err){
//     console.log(err);
// });



// GET REQUEST

// app.get("/articles", function (req, res) {

//     Article.find({}).then(function (foundArticles) {

//         res.send(foundArticles);

//     }).catch(function (err) {
//         console.log(err);
//     });
// });

// POST REQUEST

// app.post("/articles",function(req,res){

//     const newArticle = new Article({
//         title:req.body.title,
//         content:req.body.content
//     });

//     newArticle.save().then(function(){
//         res.send("Your article successfully saved...");
//     }).catch(function(err){
//         res.send(err);
//     });
// });


// DElETE THE ARTICLE

// app.delete("/articles",function(req,res){

//     Article.deleteMany({}).then(function(){
//         res.send("Your articles successfully deleted from the database");
//     }).catch(function(err){
//         res.send(err);
//     });
// });


app.route("/articles")


    .get((req, res) => {

        Article.find({}).then(function (foundArticles) {

            res.send(foundArticles);

        }).catch(function (err) {
            console.log(err);
        });
    })


    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save().then(function () {
            res.send("Your article successfully saved...");
        }).catch(function (err) {
            res.send(err);
        });
    })


    .delete((req, res) => {

        Article.deleteMany({}).then(function () {
            res.send("Your articles successfully deleted from the database");
        }).catch(function (err) {
            res.send(err);
        });
    });



/////////////////REQUEST TARGETTING A SPECIFIC ARTICLES/////////////////////

app.route("/articles/:articleTitle")



    .get((req, res) => {

        const articleTitle = req.params.articleTitle;

        Article.findOne({ title: articleTitle }).then(function (foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found");
            }
        }).catch(function (err) {
            res.send(err);
        });

    })

    .put(function (req, res) {

        Article.updateOne(
            // CONDITION
            {
                title: req.params.articleTitle
            },
            // ACTUAL UPDATE U WANNA MAKE
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content
                }
            }
        ).then(function () {
            res.send("Successfully updated your put data in the database");
        }).catch(function (err) {
            res.send(err);
        });

    })

    .post((req, res) => {

        const newArticle = new Article({
            title: req.params.articleTitle,
            content: req.body.content
        })

        newArticle.save().then(function () {
            res.send("Successfully added new article to the database");
        }).catch(function (err) {
            res.send(err);
        });
    })

// //////////////////PUT REQUEST ::: UPDATING / OVERWRITE THE ENTIRE DOUCMENT WITH THE PROVIDED VALUES... ///////////////

// SYNTAX  :
{/* <ModelName>.update(
    {condition},
    {updates},
    {overwrites:true}).then(function(){

    }).catch(function(err){

    }) */
}








// Server listening to port 3000
app.listen(PORT, () => {
    console.log("Your server is running on port 3000");
});