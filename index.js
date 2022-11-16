const express = require('express');
const ejs = require('ejs');
const dbConnection = require("./db/database");
const User = require("./db/User");
//db
dbConnection.authenticate()
    .then(() =>{
        console.log("DB Connected!")
    })
    .catch((errorMsg)=>{
        console.log(errorMsg);
    });

dbConnection.sync()
.then(() =>{
    console.log("All models were synchronized successfully.");
})

//express settings
app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());

//routes
app.get('/', (req, res)=>{
    User.findAll()
    .then((users)=>{
        return res.render("index",{
            users:users
        });
    })
    .catch(()=>{
        return res.send("Erro!");
    });
});

app.get('/user/:id', (req,res)=>{
    let id = parseInt(req.params.id);
    User.findByPk(id)
    .then((user)=>{
        res.render("edit",{
            user:user
        });
    })
    .catch(()=>{
        console.log(`Error finding user ${id}`);
        res.redirect("/");
    });
});

app.post('/user/:id', (req,res)=>{
    let id = req.params.id;
    let name = req.body.name;
    let surname = req.body.surname;
    try{
        User.update({
            name:name,
            surname:surname,
        },{
            where:
            {
                id:id
            }
        });
    } catch {
        console.log(`Error updating user ${id}`)
    } finally {
        res.redirect('/');
    }
});


app.post('/user/:id/delete', (req,res)=>{
    let id = req.params.id;
    try {
        User.destroy({
        where:{
            id:id
        }
    })} catch {
        ((error)=>{
        console.log(`Error deleting user ${id}: ${error}`);
    })} finally{
        res.redirect("/");
    }
});

app.get('/new', (req,res)=>{
    return res.render("new");
});


app.post('/new', (req,res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    User.create({
        name:name,
        surname:surname,
    })
    .then(()=>{
        console.log("User created!");
        return res.redirect("/");
    })
    .catch((error)=>{
        console.log(error)
    });
});

//starting server
app.listen('3000');
console.log("Listening in...");