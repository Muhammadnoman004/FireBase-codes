import { app } from "./Config.js"

// Authentication import

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const auth = getAuth(app);

// SIGN UP 

let Semail = document.querySelector("#semail");
let Spassword = document.querySelector("#spassword");
let Susername = document.querySelector("#uname");
let Serrorpara = document.querySelector("#serrorpara");
let Sbtn = document.querySelector("#sbutton");

if (Sbtn) {
    Sbtn.addEventListener("click", () => {

        createUserWithEmailAndPassword(auth, Semail.value, Spassword.value)
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

// LOG IN

let Lemail = document.querySelector("#lemail");
let Lpassword = document.querySelector("#lpassword");
let Lerrorpara = document.querySelector("#lerrorpara");
let Lbtn = document.querySelector("#lbutton");

if (Lbtn) {
    Lbtn.addEventListener("click", () => {

        signInWithEmailAndPassword(auth, Lemail.value, Lpassword.value)
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

// SIGN UP WITH GOOGLE

let googlebtn = document.querySelector("#googlebtn");

googlebtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    let FirebaseError = document.querySelector("#firebaseError");

    signInWithPopup(auth, provider)
        .then(async (result) => {

            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const user = result.user;
            console.log(user.displayName)
            console.log(user.email)
            localStorage.setItem("USEREMAIL", user.email)

            try {
                const docRef = await addDoc(collection(db, "users"), {
                    Name: user.displayName,
                    Email: user.email,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        }).catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            FirebaseError.innerHTML = errorCode;
            setTimeout(() => {
                FirebaseError.innerHTML = ""
            }, 3000)

            const email = error.customData.email;

            const credential = GoogleAuthProvider.credentialFromError(error);

        });

})

// onAuthStateChanged Listner

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
    } else {
        // window.location = ".////////"
    }
});

// LOGOUT

let Logoutbtn = document.querySelector("#logoutbtn");

Logoutbtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("LogOut successfully");
    }).catch((error) => {
        console.log(error);
    });
})