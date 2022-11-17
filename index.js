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

app.use(express.json());

//routes
app.get('/', (req, res)=>{
    User.findAll()
    .then((users)=>{
        return res.json(users);
    })
    .catch(()=>{
        return res.status(404).send({
            message:'Error fetching users.'
        });
    });
});

app.get('/user/:id', (req,res)=>{
    let id = parseInt(req.params.id);
    User.findByPk(id)
    .then((user)=>{
        return res.json(user);
    })
    .catch(()=>{
        return res.status(404).send({
            message:'User not found!'
        });
    });
});

app.post('/user/:id', (req,res)=>{
    let id = req.params.id;
    let name = req.body.name;
    let surname = req.body.surname;
    User.update({
        name:name,
        surname:surname,
    },
    {
        where:
        {
            id:id
        }
    })
    .then(() => {
        User.findByPk(id)
        .then((user)=>{
            return res.json(user);
        })
    })
    .catch ((error) => {
        res.status(500).send({
            message:`Error updating user ${id}`
        })
    });
});


app.post('/user/:id/delete', (req,res)=>{
    let id = req.params.id;
    
    User.destroy({
    where:{
        id:id
    }
    })
    .then(()=>{
        return res.status(200).send({
            message:'User deleted.'
        });
    })
    .catch(()=>{
        return res.status(500).send({
            message:'Error deleting user.'
        });
    });

});


app.post('/new', (req,res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    User.create({
        name:name,
        surname:surname,
    })
    .then((user)=>{
        return res.json(user);
    })
    .catch(()=>{
        return res.status(500).send({
            message:'Error creating user.'
        });
    });
});

//starting server
app.listen('3000');
console.log("Listening in...");