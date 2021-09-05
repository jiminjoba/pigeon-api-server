import { bcryptPassword } from './hashed.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { resolve } = require('path');
const readline = require('readline');

const mode = '';
const password = '';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*const Choose = () => {
    return new Promise ((resolve)=>{
        rl.question('Hi! Lets do that. Please choose hashing algorithm(hmac, bcrypt): ', (algoritm) => {
            switch(algoritm){
                case "bcrypt":
                    bcryptPassword();
                    break;
                case "hmac":
                    inputPaswwordHmac();
                    break;
            }
            resolve();
        })
    })
}*/

/*const inputPasswordBcrypr = () => {
    return new Promise ((resolve) => {
        rl.question('enter your password ', (pass) => {
            console.log(`bcrypt password is ${pass}`);
            bcryptPassword(pass);
            rl.close();
        })
    })
}*/

const inputPaswwordHmac = () => {
    return new Promise ((resolve) => {
        rl.question('enter your password ', (pass) => {
            password  = pass;
            console.log(`hmac password is ${pass}`);
            rl.close();
        })
    })
}

//export {Choose};

