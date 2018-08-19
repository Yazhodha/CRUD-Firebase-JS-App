// firebase configuration begins
var config = {
    apiKey: "AIzaSyD2KJZG4IXlXTb3PpF3WjgLlfwMRwbVrmk",
    authDomain: "docdemo-b1d43.firebaseapp.com",
    databaseURL: "https://docdemo-b1d43.firebaseio.com",
    projectId: "docdemo-b1d43",
    storageBucket: "docdemo-b1d43.appspot.com",
    messagingSenderId: "913106842247"
};
firebase.initializeApp(config);
// firebase configuration ends

resetLoginForm = () => {
    txtEmail.value = "";
    txtPassword.value = "";
}

var user = null;

// firebase.auth().signOut(); //log out if previously logged in.

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
                firebase.auth().signOut();
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
        // Can use this area to interact with current user if theres a user.
        console.log("logged in");
        btnLogOut.style.display = "inline-block";
        btnLogin.style.display = "none";
        btnSignUp.style.display = "none";
        resetLoginForm();
        document.getElementById("loginDiv").style.display = "none";
        document.getElementById("docChannelling").style.display = "block";
    } else {
        //If not logged in this will always show the login view
        console.log("Not Logged In");
        btnLogOut.style.display = "none";
        btnLogin.style.display = "inline-block";
        btnSignUp.style.display = "inline-block";
        document.getElementById("loginDiv").style.display = "block";
        document.getElementById("docChannelling").style.display = "none";
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
            document.getElementById("docChannelling").style.display = "block";
            //goToHomePage();
        } else {
            alert("Check Your emails and verify Your Email account before Login");
            firebase.auth().signOut();
        }
    }

}
//Send verification email after registering..

// firebase Authorization code ends..=====================================================================

//========================================================================================================
// DOC Channelling Application Login Starts...

let counter = new Date().getTime();//to get a unique ID


const table = document.getElementById("channelTable");
const tableViewDoctor = document.getElementById("docViewTable");
const formAddDoctor = document.getElementById("addDoctor");
const tableViewChannelC = document.getElementById("channelViewTable");

//Adding Channel Date info to the table
addToList = () => {
    const channelDate = document.getElementById("channelDate").value;
    const channelDoc = document.getElementById("selectDoc").value;
    const channelLoc = document.getElementById("selectLoc").value;

    addChannellingDatesOfLocations(channelDate, channelDoc, channelLoc);
}



// Add Doctor Info to the firebase DB
formAddDoctor.addEventListener("submit", (e) => {
    let docName = document.getElementById("docName").value;
    let docSpecial = document.getElementById("docSpecial").value;
    let docContact = document.getElementById("docContact").value;
    let docEmail = document.getElementById("docEmail").value;
    e.preventDefault();
    // console.log(task + description);
    addDoctorInfo(docName, docSpecial, docContact, docEmail);
    formAddDoctor.reset();
});

addDoctorInfo = (docName, docSpecial, docContact, docEmail) => {
    counter += 1;
    console.log(counter);
    var doctorInfo = {
        id: counter,
        docName: docName,
        docSpecial: docSpecial,
        docContact: docContact,
        docEmail: docEmail
    }
    let db = firebase.database().ref("docChannelling/doctorInfo/" + counter); //referencing the firebase database folder.
    db.set(doctorInfo); //sending data object to the firebase db.

    // viewDoctorInfo();
}

//Update Doctor Selection Combo Box
loadSelectDoc = () => {
    let docInfo = firebase.database().ref("docChannelling/doctorInfo/");
    docInfo.on("child_added", (data) => {
        let docInfoValue = data.val();
        console.log(docInfoValue.docName);

        var option = document.createElement("option");
        option.text = docInfoValue.docName;
        document.getElementById("selectDoc").add(option);

    });

}

// Add Channel Centre Info to the firebase DB
formAddChannelCenter.addEventListener("submit", (e) => {
    let channelName = document.getElementById("channelName").value;
    let channelLoc = document.getElementById("channelLoc").value;
    let channelAddress = document.getElementById("channelAddress").value;
    let channelEmail = document.getElementById("channelEmail").value;
    e.preventDefault();
    addChannellingInfo(channelName, channelLoc, channelAddress, channelEmail);
    formAddChannelCenter.reset();
});

addChannellingInfo = (channelName, channelLoc, channelAddress, channelEmail) => {
    counter += 1;
    console.log(counter);
    var channellingInfo = {
        id: counter,
        channelName: channelName,
        channelLoc: channelLoc,
        channelAddress: channelAddress,
        channelEmail: channelEmail
    }
    let db = firebase.database().ref("docChannelling/channelInfo/" + counter); //referencing the firebase database folder.
    db.set(channellingInfo); //sending data object to the firebase db.


}

//Update Doctor Selection Combo Box
loadSelectChannelCenter = () => {
    let channelInfo = firebase.database().ref("docChannelling/channelInfo/");
    channelInfo.on("child_added", (data) => {
        let channelInfoValue = data.val();
        console.log(channelInfoValue.channelName);

        var option = document.createElement("option");
        option.text = channelInfoValue.channelName;
        document.getElementById("selectLoc").add(option);

    });

}
// Add Channelling dates and Locations of Doctors to firebase
addChannellingDatesOfLocations = (date, docName, channelCenterName) => {
    counter += 1;
    console.log(counter);
    var channelDocInfo = {
        id: counter,
        date: date,
        docName: docName,
        channelCenterName: channelCenterName,
    }
    let db = firebase.database().ref("docChannelling/channelDocInfo/" + counter); //referencing the firebase database folder.
    db.set(channelDocInfo); //sending data object to the firebase db.
}

//Update Channel Doctors of Locations
loadChannelDocTable = () => {
    let channelDocInfo = firebase.database().ref("docChannelling/channelDocInfo/");
    channelDocInfo.on("child_added", (data) => {
        let channelDocInfoValue = data.val();
        console.log(channelDocInfoValue.docName, channelDocInfoValue.date, channelDocInfoValue.channelCenterName, channelDocInfoValue.id);

        var row = table.insertRow(table.rows.length);

        row.insertCell(0).innerHTML = channelDocInfoValue.date;
        row.insertCell(1).innerHTML = channelDocInfoValue.docName;
        row.insertCell(2).innerHTML = channelDocInfoValue.channelCenterName;
        row.insertCell(3).innerHTML = `<button class='btn btn-danger' onclick='deleteRow(this, ${channelDocInfoValue.id})'>Remove</button>`

    });

}

// View Doctor Info
viewDoctorInfo = () => {
    let docInfo = firebase.database().ref("docChannelling/doctorInfo/");
    docInfo.on("child_added", (data) => {
        let docInfoValue = data.val();
        //console.log(channelDocInfoValue.docName, channelDocInfoValue.date, channelDocInfoValue.channelCenterName, channelDocInfoValue.id);
        var table = document.getElementById("docViewTable");
        var row = document.getElementById("docViewTable").insertRow(table.rows.length);

        row.insertCell(0).innerHTML = docInfoValue.docName;
        row.insertCell(1).innerHTML = docInfoValue.docSpecial;
        row.insertCell(2).innerHTML = docInfoValue.docContact;
        row.insertCell(3).innerHTML = docInfoValue.docEmail;
        row.insertCell(4).innerHTML = `<button class='btn btn-danger' onclick='deleteDocRow(this, ${docInfoValue.id})'>Remove</button>`

    });

}
// View Channel Centre Info
viewChannelCentreInfo = () => {
    let channelCInfo = firebase.database().ref("docChannelling/channelInfo/");
    channelCInfo.on("child_added", (data) => {
        let channelCInfoValue = data.val();
        console.log(channelCInfoValue.channelName, channelCInfoValue.channelLoc, channelCInfoValue.channelAddress, channelCInfoValue.channelEmail);

        var table = document.getElementById("channelViewTable");
        var row = document.getElementById("channelViewTable").insertRow(table.rows.length);

        row.insertCell(0).innerHTML = channelCInfoValue.channelName;
        row.insertCell(1).innerHTML = channelCInfoValue.channelLoc;
        row.insertCell(2).innerHTML = channelCInfoValue.channelAddress;
        row.insertCell(3).innerHTML = channelCInfoValue.channelEmail;
        row.insertCell(4).innerHTML = `<button class='btn btn-danger' onclick='deleteChannelRow(this, ${channelCInfoValue.id})'>Remove</button>`

    });
}

//delete from channel date info table
deleteRow = (row, id) => {

    let channelDocInfo = firebase.database().ref("docChannelling/channelDocInfo/" + id);
    channelDocInfo.remove();

    const table = document.getElementById("channelTable");
    table.deleteRow(row.parentNode.parentNode.rowIndex);

}
//delete from doctor info table
deleteDocRow = (row, id) => {
    let docInfo = firebase.database().ref("docChannelling/doctorInfo/" + id);
    docInfo.remove();

    tableViewDoctor.deleteRow(row.parentNode.parentNode.rowIndex);

}
//delete from channel info table
deleteChannelRow = (row, id) => {
    let channelInfo = firebase.database().ref("docChannelling/channelInfo/" + id);
    channelInfo.remove();

    tableViewChannelC.deleteRow(row.parentNode.parentNode.rowIndex);

}

whenLoad = () => {
    viewChannelCentreInfo();
    viewDoctorInfo();
    loadSelectDoc();
    loadSelectChannelCenter();
    loadChannelDocTable();

}


    // DOC Channelling Application Login Ends...

