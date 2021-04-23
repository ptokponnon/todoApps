var express = require('express');
var app = express();
var router = express.Router();

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET todo listing. */
router.get('/', function(req, res, next) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("local");
        dbo.collection("todos").find({}).toArray(function(err, results) {
          if (err) throw err;
          res.render('todo', {todos: results});
          db.close();
        });
    }); 
});

router.post('/', function(req, res, next) {
    //data.push(req.body);
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("local");
        var todo = req.body;
        dbo.collection("todos").insertOne(todo, function(err, resp) {
          if (err) throw err;
          console.log("inserted");
          db.close();
        });
        dbo.collection("todos").find({}).toArray(function(err, results) {
            if (err) throw err;
            res.json({todos: results});    
            db.close();
        });
    }); 
});

router.delete('/:item', function(req, res, next){
    /*data = data.filter(function(todo) {
        return todo.item.replace(/ /g, '-') !== req.params.item;
    });*/
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("local");
        var myquery = { item: req.params.item.replace(/\-/g, " ")};
        dbo.collection("todos").deleteOne(myquery, function(err, result) {
            if (err) throw err;
            db.close();
        });

        dbo.collection("todos").find({}).toArray(function(err, results) {
            if (err) throw err;
            res.json({todos: results});    
            db.close();
        });

    });
});

module.exports = router;
