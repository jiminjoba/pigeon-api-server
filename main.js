import { createRequire } from "module";
import { verifyPassword, bcryptPassword} from "./hashed.js";

const require = createRequire(import.meta.url);
const express = require('express');
const app = express();

const users = [];

app.use(express.json());

// login 
app.post('/login', async (req, res)=> 
{
    try
    {
        console.log('login');
        const userInDataBase = findUser(req.body.name);
        //!userInData === false тогда сработает if
        if (!userInDataBase)
        {
            res.status(401).send("Login or password invalid ");
            return;
        }
        if (!await verifyPassword(req.body.password, userInDataBase.hashedPassword, userInDataBase.salt))
        {
            res.status(401).send("Login or password invalid 1 ");
            return;
        }
        res.json(userInDataBase);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send();
    }
})

// find user
const findUser = (userName) => {
    const user = users.find(user => user.name === userName);
    return user;
}

// register new user
app.post('/users',async (req,res)=> {
    try
    {
        console.log('register');
        const userInDataBase = findUser(req.body.name);
        if(userInDataBase != null)
        {
            res.status(400).send("User already exist ");
            return;
        }
        let hash =  await bcryptPassword(req.body.password, req.body.salt);
        console.log(hash);
        const user = 
        {
            name: req.body.name, 
            hashedPassword: hash.hash, 
            password: req.body.password, 
            salt: hash.salt
        };
        users.push(user);
        res.status(201).send();
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send();
        
    } 
})

// return all users 
app.get('/users', (req, res) => 
{
    res.json(users);
})

// set-password
app.post('/users/set-password', async (req,res) => 
{
    try
    {
        console.log('set-password');
        const userInDataBase = findUser(req.body.name);
        if(userInDataBase == null)
        {
            res.status(400).send("Cant find ");
            return;
        }
        if (req.body.currentPassword !== userInDataBase.password)
        {
            res.status(400).send("Invalid password ")
        }
        userInDataBase.password = req.body.password;
        let newHash = await bcryptPassword(userInDataBase.password, userInDataBase.salt);
        userInDataBase.hashedPassword = newHash.hash;
        userInDataBase.salt = newHash.salt;
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send();
    }
})

app.listen(4000);
