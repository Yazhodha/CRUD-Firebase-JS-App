
// firebase configuration begins
var config = {
    apiKey: "AIzaSyCbV57rrRi7VNcNy6O0ERJ8ornK9cpU9Vc",
    authDomain: "crud-firebase-web.firebaseapp.com",
    databaseURL: "https://crud-firebase-web.firebaseio.com",
    projectId: "crud-firebase-web",
    storageBucket: "crud-firebase-web.appspot.com",
    messagingSenderId: "727974733780"
};
firebase.initializeApp(config);

// Get Elements
const txtEmail = document.getElementById("email");
const txtPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnSignUp = document.getElementById("btnSignUp");
const btnLogOut = document.getElementById("btnLogOut");
const linkforgotPw = document.getElementById("forgotPw");

//Add Login Event
btnLogin.addEventListener("click", (e) =>{
    //Get email pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    // //Sign in
    const promise = auth.signInWithEmailAndPassword(email,pass);
    promise.catch(e=>console.log(e.message));
});

btnSignUp.addEventListener("click", (e)=>{
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign Up
    const promis = auth.createUserWithEmailAndPassword(email,pass);
    promis.catch(e=>console.log(e.message));
});

btnLogOut.addEventListener("click", (e)=>{
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser =>{
    if(firebaseUser){
        console.log(firebaseUser);
        btnLogOut.style.display = "inline-block";
        btnLogin.style.display = "none";
        btnSignUp.style.display = "none";
        
    }else{
        console.log("Not Logged In");
        btnLogOut.style.display = "none";
        btnLogin.style.display = "inline-block";
        btnSignUp.style.display = "inline-block";
    }
});

