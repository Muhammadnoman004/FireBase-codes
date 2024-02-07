import { app } from './Config'

// Authentication import

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

const auth = getAuth(app);

// SIGN UP 

let Semail = document.querySelector("#semail");
let Spassword = document.querySelector("#spassword");
let Susername = document.querySelector("#uname");
let Serrorpara = document.querySelector("#serrorpara");
let Sbtn = document.querySelector("#sbutton");

if (Sbtn) {
    Sbtn.addEventListener("click", () => {

        createUserWithEmailAndPassword(auth, Semail.email, Spassword.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessageF);
            });
    })
}

// LOG IN

let Lemail = document.querySelector("#lemail");
let Lpassword = document.querySelector("#lpassword");
let Lerrorpara = document.querySelector("#lerrorpara");
let Lbtn = document.querySelector("#lbutton");

if (Lbtn) {
    Lbtn.addEventListener("click", () => {

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    })
}