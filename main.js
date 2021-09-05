//import { Choose } from "./input.js";

import { createRequire } from "module";
import { verifyPassword, bcryptPassword } from "./hashed.js";

const require = createRequire(import.meta.url);
const express = require('express');
const app = express();

//Choose();

const users = [];

app.use(express.json());

// login 
app.post('/login', async (req, res)=> {
    try{
        console.log('login');
        const userInDataBase = findUser(req.body.name);
        //!userInData === false тогда сработает if
        if (!userInDataBase){
            res.status(401).send("Login or password invalid ");
            return;
        }
        //if (req.body.password !== userInDataBase.password){
        if (!await verifyPassword(req.body.password, userInDataBase.hashedPassword, userInDataBase.salt)){
            res.status(401).send("Login or password invalid 1 ");
            return;
        }
        res.json(userInDataBase);
    }catch{
        res.status(500).send();
    }
})

//find user
function findUser(userName){
    const user = users.find(user => user.name === userName);
    return user;
}

// register new user
app.post('/users',async (req,res)=> {
    try{
        console.log('register');
        const userInDataBase = findUser(req.body.name);
        if(userInDataBase != null){
            res.status(400).send("User already exist ");
            return;
        }
        let hash =  await bcryptPassword(req.body.password);
        console.log(hash);
        const user = {
            name: req.body.name, 
            hashedPassword: hash.hash, 
            password: req.body.password, 
            salt: hash.salt
        };
        users.push(user);
        res.status(201).send();
    }catch(error){
        console.log(error);
        res.status(500).send();
        
    } 
})

// return all users 
app.get('/users', (req, res)=> {
    res.json(users);
})

// set-password
// ищу юзера, если нашел, то меняю пароль, все catch переписать на cath(error)
app.post('/users/set-password', async (req,res)=>{
    try{
        console.log('set-password');
        const userInDataBase = findUser(req.body.name);
        if(userInDataBase == null){
            res.status(400).send("Cant find ");
            return;
        }
        userInDataBase.password = req.body.password;
        console.log(userInDataBase.password);
        let userName = req.body.name;
        userInDataBase.password = req.body.password;
        console.log(userName, userInDataBase.password);
    }catch(error){
        console.log(error);
        res.status(500).send();
    }
})

app.listen(4000);