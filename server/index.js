const express = require('express')
const mongoose= require('mongoose')
const cors= require('cors')
const UserModel = require('./models/user')
const session = require('express-session')
const cookieParser= require('cookie-parser')

const app=express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(session({
    secret:'secret_random_key',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

const corsOptions ={
    origin:'http://localhost:5173',
    methods:['GET', 'POST'],
    Credentials:true
}

app.use(cors(corsOptions))
mongoose.connect('mongodb://127.0.0.1:27017/user');

app.post('/login', (req,res)=>{
    const {email,password} = req.body;
    UserModel.findOne({email:email})
    .then(user=>{
        if(user){
            if(user.password===password){
                res.json("Success")
            } else{
                res.json("incorrect password")
            }
        } else{
            res.json("User not found")
        }
    })
})

app.post('/register', (req,res) =>{
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err=>res.json(err))
})


app.use(cors(corsOptions));

app.listen(3001,()=>{
    console.log('server is running')
})