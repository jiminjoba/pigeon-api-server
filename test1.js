const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const readline = require('readline');
const { resolve } = require('path');
const { Hmac } = require('crypto');
const crypto  = require('crypto');
const { text } = require('express');

let mode = '';
let hmacSecret = '';
let salt = '';




app.use(express.json());

const users = [];


app.get('/users', (req, res)=> {
    res.json(users);
})



//hmac function

const inputPasswordHmac = () => {
    return new Promise ((resolve)=>{
        rl.question('enter your password ', (pass)=>{
            inputSecretHmac(pass);
            resolve();
        })
    })
}

const inputSecretHmac = (pass) => {
    return new Promise((resolve)=>{
        rl.question('enter secret for hmac ', (secret) => {
            hmacSecret = secret;
            secretHmac(hmacSecret,pass);
            resolve();
        })
    })
}
function secretHmac(secret,pass, req, res) {
    secret = String(secret);
    const hashedPassword = crypto.createHmac("sha256",secret).update(pass).digest('hex');
    console.log(hashedPassword);
    const user = {name: req.body.name, password: hasedPassword, firstPassord: pass};
    users.push(user);
}
// bcrypt function

const inputPasswordBcrypt = () => {
    return new Promise ((resolve)=>{
        rl.question('enter your password ',(pass) => {
            bcryptPassword(pass);
            resolve();        
        })
    })
}

const genSalt = async () => {
    salt = await bcrypt.genSalt(10);
    console.log(salt);
}

const bcryptPassword = async (pass) => {
    genSalt();
    const hasedPassword = await bcrypt.hash(pass, salt);
    console.log(salt);
    console.log(hasedPassword);
    const user = {name: req.body.name, password: hasedPassword, firstPassord: pass};
    users.push(user);
} 

// server function 

function initRest() {

    app.post('/users', async (req, res)=> {
        try{
            let hasedPassword = '';
            let password = req.body.password;
            if (mode === 'hmac'){
                hasedPassword = secretHmac(hmacSecret,password);
                
            } 
            if (mode === 'bcrypt'){
                hasedPassword = bcryptPassword(password);
            }
            console.log(hasedPassword); 
            res.status(201).send();
        }catch{
            res.status(500).send();
        }
    })

    app.post('/users/login',async (req,res)=> {
        const user = users.find(user => user.name = req.body.name);
        if(user == null){
            return res.status(400).send('Cannot find user');
        }
        try{
            if(await bcrypt.compare(req.body.password, user.password)){
                res.send("success");
                const Key = generationKey(password);
            }else{
                res.send('Not allowed')
            };
        }catch{
            res.status(500).send();
        } 
    })
    
    app.listen(4000);
}


const inputNumber = () => {
    return new Promise((resolve) => {
        const keyCode = Math.floor(Math.random() * (1000000 - 10000) + 10000);
        console.log(keyCode);
        rl.question('enter number ', (number) => {
            if (number != keyCode){
                console.log('error! Try again');
            }
            else{
                console.log(`Congratulations! You have passed the test, now you have to open access to secret data.`);
            }
            resolve();
        })
    })  
}
 


const main = async () => {
    await Choose();
    await inputNumber();
    rl.close();
  }
main();