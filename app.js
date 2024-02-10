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

// FIRESTORE DATABASE IMPORT

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    onSnapshot,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// STORAGE IMPORT

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize storage and get a reference to the service
const storage = getStorage();

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

// SIGN IN WITH GOOGLE

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

//////////////////////////////....Authentication End....//////////////////////////////////

// ADD DATA IN DATABASE

const addData = async () => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            Email: "any value",
            Password: "any value",
            Date: new Date().toLocaleString()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

// GET DATA FROM DATABASE

let ids = [];
const getdata = () => {

    onSnapshot(collection(db, "users"), (Alldata) => {
        console.log(Alldata);
        Alldata.docChanges().forEach((Singledata) => {
            console.log(Singledata.doc.id);
            ids.push(Singledata.doc.id)
            console.log(ids);

        })
    })
}
getdata()

// DELETE DATA FROM DATABASE

let deletebtn = document.querySelector("#delbtn");

deletebtn.addEventListener("click", async (id) => {
    await deleteDoc(doc(db, "users", id));

})

// UPDATE DATA FROM DATABASE

const UpdateData = async (id) => {
    await updateDoc(doc(db, "users", id), {
        Password: input.value,
        Date: new Date().toLocaleString()
    });
}

//////////////////////////////....FireStore Database End....//////////////////////////////////

// STORAGE

let getpicture = document.querySelector("#getpicture");
let imageDiv = document.querySelector(".imageDiv");
let image = document.querySelector("#image");
let imageURL;

const downloadImageUrl = (file) => {
    return new Promise((resolve, reject) => {
        const restaurantImageRef = ref(storage, `images/${file.name}`
        );
        const uploadTask = uploadBytesResumable(restaurantImageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');

                switch (snapshot.state) {
                    case "paused":
                        console.log('Upload is paused');
                        break;
                    case "running":
                        console.log("running");
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        );
    });
};

getpicture.addEventListener("change", async () => {
    if (getpicture.files.length > 0) {
        const file = getpicture.files[0];
        imageDiv.style.display = "block";
        imageURL = await downloadImageUrl(file);
        if (imageURL) {
            image.src = imageURL;
        }
    }
})

//////////////////////////////....Storage End....//////////////////////////////////

////////////////////////////..A___L___M___O___S___T .. C___O___D___E..////////////////////////////