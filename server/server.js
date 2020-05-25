const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express(); 
const mongoose = require('mongoose');
 
app.use(express.static(__dirname + "/../public")); 
app.use(bodyParser.json()); 

//DB
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/book_db', 
    {
        useNewUrlParser : true, 
        useUnifiedTopology : true
    }).then( res => {
        console.log('Connected to db'); 
    }).catch(err => {
        console.log(err); 
    }); 

const {Book} = require('./models/books'); 
const {Store} = require('./models/stores'); 

//POST 
//post req to save stores in DB
app.post('/api/add/store', (req,res) => {
    const store = new Store({
        name : req.body.name, 
        address : req.body.address, 
        phone : req.body.phone
    }); 
    store.save( (err,doc) => {
        if (err) res.status(400).send(err); 

        res.status(200).send();  
    })
}); 

//post req to save books in db
app.post('/api/add/books', (req, res) => {
    const book = new Book({
        name : req.body.name, 
        author : req.body.author, 
        pages : req.body.pages, 
        price : req.body.price, 
        stores : req.body.stores
    }); 
    book.save( (err,doc) => {
        if (err) res.status(400).send(err); 

        res.sendStatus(200); 
    })

}); 

//GET 
//get request to load available stores in DB to add book from 
app.get('/api/stores', (req,res) => {
    Store.find((err, doc) =>{
        if (err) res.status(400).send();  

        res.send(doc); 
    })
}); 

//get request to load booklist from DB on home page
app.get('/api/booklist', (req,res) => {
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 10; 
    let order = req.query.ord ? req.query.ord : 'asc'; 

    Book.find().sort({_id : order}).limit(limit).exec( (err,doc) => {
        if (err) res.status(400).send(); 

        res.send(doc); 
    })
}); 

//Get request to get a book for editing from booklist on book_edit.html
app.get('/api/books/:id', (req,res) => {
    Book.findById(req.params.id, (err,doc) => {
        if (err) res.status(400).send(err); 

        res.send(doc); 
    }); 
}); 

//Patch request to update a book on book_edit.html
app.patch('/api/add/books/:id', (req,res) => {
    Book.findByIdAndUpdate(req.params.id, {$set : req.body}, (err,doc) => {
        if(err) res.status(400).send(err); 

        res.send(doc); 
    }); 
}); 

//Delete request to delete a book from db and booklist
app.delete('/api/delete/books/:id', (req,res) => {
    Book.findByIdAndDelete(req.params.id, (err,doc) => {
        if (err) res.status(400).send(err); 

        res.send(doc); 
    }); 
}); 

const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Started at port : ${port}`); 
}); 


