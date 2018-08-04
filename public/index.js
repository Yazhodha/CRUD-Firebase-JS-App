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
// firebase configuration ends

resetLoginForm = () => {
    txtEmail.value = "";
    txtPassword.value = "";
}

var user = null;

firebase.auth().signOut(); //log out if previously logged in.

// Get Elements
const txtEmail = document.getElementById("email");
const txtPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnSignUp = document.getElementById("btnSignUp");
const btnLogOut = document.getElementById("btnLogOut");
const linkforgotPw = document.getElementById("forgotPw");
//Add Login Event
btnLogin.addEventListener("click", (e) => {
    //Get email pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    // //Sign in

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise
        .then(() => {
            checkEmailVerification();
        })
        .catch(e => {
            // Handle Errors here.
            // [START_EXCLUDE]
            if (e.code === 'auth/wrong-password') {
                alert('Invalid password!');
            } else if (e.code === 'auth/user-not-found') {
                alert(e.message);
            } else if (e.code === 'auth/invalid-email') {
                alert(e.message);
            } else {
                alert(e.message);
            }
            console.log('login error', e.message)
        });


});

btnSignUp.addEventListener("click", (e) => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign Up
    if (email.length < 4) {
        alert('Please enter a valid Email');
        return;
    }
    if (pass.length < 4) {
        alert('Please enter a password at least longer than 4 characters.');
        return;
    } else {
        const promis = auth.createUserWithEmailAndPassword(email, pass);
        promis
            .then(() => {
                //Send email verification after registering...
                var firebaseUser = firebase.auth().currentUser;
                if (!firebaseUser.emailVerified) {
                    const promise = firebaseUser.sendEmailVerification();
                    promise
                        .then(alert("Successfully Registered. Verification mail has been sent!"))
                        .catch(e => console.log(e.message));
                }
            })
            .catch(e => {
                // [START_EXCLUDE]
                if (e.code == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(e.message);
                }
                console.log(errorMessage, errorCode)
            });
    }

});

btnLogOut.addEventListener("click", (e) => {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser => {

    if (firebaseUser) {
        //Can use this area to interact with current user.
    } else {
        //If not logged in this will always show the login view
        console.log("Not Logged In");
        btnLogOut.style.display = "none";
        btnLogin.style.display = "inline-block";
        btnSignUp.style.display = "inline-block";
        document.getElementById("loginDiv").style.display = "block";
        document.getElementById("firstSectionDiv").style.display = "none";
    }
});
//Check the registered email verified or not and login..
checkEmailVerification = () => {
    var firebaseUser = firebase.auth().currentUser;
    if (firebaseUser !== null) {
        if (firebaseUser.emailVerified) {
            //Login
            console.log(firebaseUser);
            btnLogOut.style.display = "inline-block";
            btnLogin.style.display = "none";
            btnSignUp.style.display = "none";
            resetLoginForm();
            document.getElementById("loginDiv").style.display = "none";
            document.getElementById("firstSectionDiv").style.display = "block";
            goToHome();
        } else {
            alert("Check Your emails and verify Your Email account before Login");

        }
    }

}
//Send verification email after registering..

// firebase Authorization code ends..




// Application Logic
goToHome = () => {
    // readTask();
    var date = new Date();
    var time = date.getTime();
    var counter = time;

    document.getElementById("form").addEventListener("submit", (e) => {
        let task = document.getElementById("task").value;
        let description = document.getElementById("desc").value;
        e.preventDefault();
        // console.log(task + description);
        createTask(task, description);
        form.reset();
    });

    createTask = (taskName, description) => {
        console.log(counter);
        counter += 1;
        console.log(counter);
        var task = {
            id: counter,
            task: taskName,
            description: description
        }
        let db = firebase.database().ref("tasks/" + counter); //referencing the firebase database folder.
        db.set(task); //sending data object to the firebase db.

        document.getElementById("cardSection").innerHTML = '';
        readTask();
    }
    reset = () => {
        document.getElementById("firstSection").innerHTML = `
         <form class="border p-4 mb-4" id="form">

                    <div class="form-group">
                        <label>Task</label>
                        <input type="text" class="form-control" id="task" placeholder="Enter Task">
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" class="form-control" id="desc" placeholder="Description">
                    </div>

                    <button type="submit" id="button1" class="btn btn-primary">Add Task</button>
                    <button style="display: none" id="button2" class="btn btn-success">Update Task</button>
                    <button style="display: none" id="button3" class="btn btn-danger">Cancel</button>
                </form>
    `;

        document.getElementById("form").addEventListener("submit", (e) => {
            let task = document.getElementById("task").value;
            let description = document.getElementById("desc").value;
            e.preventDefault();
            // console.log(task + description);
            createTask(task, description);
            form.reset();
        });
    }

    updateTask = (id, task, description) => {
        document.getElementById("firstSection").innerHTML = `
        <form class="border p-4 mb-4" id="form2">
                    <div class="form-group">
                        <label>Task</label>
                        <input type="text" class="form-control" id="task" placeholder="Enter Task">
                    </div>               
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" class="form-control" id="desc" placeholder="Description">
                    </div>
                    <button style="display: none" type="submit" id="button1" class="btn btn-primary">Add Task</button>
                    <button type="submit" style="display: inline-block" id="button2" class="btn btn-success">Update Task</button>
                    <button style="display: inline-block" id="button3" class="btn btn-danger">Cancel</button>
                </form>
    `;

        document.getElementById("form2").addEventListener("submit", (e) => {
            e.preventDefault();
        });
        document.getElementById("button3").addEventListener("click", (e) => {
            reset();
        });
        document.getElementById("button2").addEventListener("click", (e) => {
            updateTaskInfo(id, document.getElementById("task").value, document.getElementById("desc").value);
        });
        document.getElementById("task").value = task;
        document.getElementById("desc").value = description;
    }

    updateTaskInfo = (id, task, description) => {
        var taskUpdated = {
            task: task,
            id: id,
            description: description
        }
        let db = firebase.database().ref("tasks/" + id);
        db.set(taskUpdated);

        document.getElementById("cardSection").innerHTML = '';
        reset();
        readTask();
    }

    deleteTask = (id) => {
        let task = firebase.database().ref("tasks/" + id);
        task.remove();
        reset();
        document.getElementById("cardSection").innerHTML = '';
        readTask();
    }
}

readTask = () => {
    let task = firebase.database().ref("tasks/");
    task.on("child_added", (data) => {
        let taskValue = data.val();
        // console.log(taskValue.task);
        document.getElementById("cardSection").innerHTML += `
        
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">
                        ${taskValue.task}
                    </h5>
                    <p class="card-text">
                        ${taskValue.description}
                    </p>
                    <button type="submit" style="color: white" class="btn btn-warning" onclick="updateTask(${taskValue.id},'${taskValue.task}','${taskValue.description}')">Edit Task</button>
                    <button type="submit" style="color: white" class="btn btn-danger" onclick="deleteTask(${taskValue.id})">Delete Task</button>
                </div>
            </div>
        `
    });
    document.getElementById("button4").style.display = "none";


}

// Application Logic ends