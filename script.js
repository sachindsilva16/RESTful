const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: {
        type: String
    },
    content: {
        type: String
    }
}


const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

    .get(function (req, res) {

        Article.find({}).then(function (foundArticles) {
            res.send(foundArticles);
        }).catch(function (err) {
            res.send(err);
        });
    })

    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save().then(() => {
            res.send("Your data has been successfully added to our database..");
        }).catch((err) => {
            res.send(err);
        });
    })

    .delete((req, res) => {

        Article.deleteMany().then(() => {
            res.send("Your all data has been successfully deleted...!");
        }).catch(err => {
            res.send(err);
        });
    });


app.route("/articles/:articleTitle")

    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }).then(function (foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("Requested article is not found in the database...");
            }
        }).catch(function (err) {
            res.send(err);
        });
    })


    .post((req, res) => {

        const newArticle = new Article({
            title: req.params.articleTitle,
            content: req.body.content
        });

        newArticle.save().then(() => {
            res.send("Your article has been saved successfully");
        }).catch(err => {
            res.send(err);
        });
    })

    .put((req, res) => {

        Article.updateOne(
            {
                title: req.params.articleTitle
            },
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content
                }

            },

            {
                overwrite: true
            }
        ).then(() => {
            res.send("Your data has been succcessfully updated");
        }).catch(err => {
            res.send(err);
        });
    })


    .patch(function (req, res) {


        Article.updateOne(
            {
                title: req.params.articleTitle
            },
            // $set : {title:req.body.title,content:req.body.content}
            // INSTEAD
            { $set: req.body }
        ).then(() => {
            res.send("Successfully updated article");
        }).catch(err => {
            res.send(err);
        });

    })

    .delete(function (req, res) {
        Article.findOneAndDelete({ title: req.params.articleTitle }).then(function (foundArticle) {
            if (foundArticle) {
                res.send("Your article is deleted succesfully");

            } else {
                res.send("No such article found in the database");
            }

        }).catch(function (err) {
            res.send(err);
        });
    });


app.listen(PORT, () => {
    console.log("Your server is running on port 3000");
});