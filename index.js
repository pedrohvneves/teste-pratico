const express = require('express');
const dbConnection = require("./db/database");
const User = require("./db/User");
const cors = require('cors');

//db
dbConnection.authenticate()
    .then(() =>{
        console.log("DB Connected!")
    })
    .catch((errorMsg)=>{
        console.error(errorMsg);
    });

dbConnection.sync()
.then(() =>{
    console.log("All models were synchronized successfully.");
})

//express settings
app = express();

app.use(express.json());

app.use(cors());

//routes
app.get('/user', (req, res)=>{
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
    const id = parseInt(req.params.id);
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

app.put('/user/:id', (req,res)=>{
    const id = req.params.id;
    const name = req.body.name;
    const surname = req.body.surname;
    const descricao = req.body.descricao;
    User.update({
        name:name,
        surname:surname,
        descricao:descricao
    },
    {
        where:
        {
            id:id
        }
    })
    .then(()=>{
        User.findByPk(id)
        .then((user)=>{
            return res.json(user);
        })
    })
    .catch ((error) => {
        console.error(error);
        res.status(500).send({
            message:`Error updating user ${id}`
        })
    });
});


app.delete('/user/:id/', (req,res)=>{
    const id = req.params.id;
    User.destroy({
    where:{
        id:id
    }
    })
    .then((queryResult)=>{
        if(queryResult > 0){
            return res.status(200).send({
                message:'User deleted.'
            });
        }
        else{
            return res.status(200).send({
                message:'User not found.'
            });
        }
    })
    .catch((error)=>{
        console.error(error);
        return res.status(500).send({
            message:'Error deleting user.'
        });
    });

});


app.post('/user/', (req,res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const descricao = req.body.descricao;
    User.create({
        name:name,
        surname:surname,
        descricao:descricao
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