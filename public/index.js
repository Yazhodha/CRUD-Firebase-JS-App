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

updateTask = (id,task,description)=>{
    document.getElementById("firstSection").innerHTML=`
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

    document.getElementById("form2").addEventListener("submit", (e)=>{
        e.preventDefault();
    });
    document.getElementById("button3").addEventListener("click", (e)=>{
        reset();
    });
    document.getElementById("button2").addEventListener("click", (e)=>{
        updateTaskInfo(id, document.getElementById("task").value, document.getElementById("desc").value);
    });
    document.getElementById("task").value=task;
    document.getElementById("desc").value=description;
}

updateTaskInfo = (id, task, description)=>{
    var taskUpdated = {
        task: task,
        id: id,
        description: description
    }
    let db = firebase.database().ref("tasks/"+id);
    db.set(taskUpdated);

    document.getElementById("cardSection").innerHTML='';
    readTask();
    reset();
}

deleteTask = (id)=>{
    let task = firebase.database().ref("tasks/"+id);
    task.remove();
    reset();
    document.getElementById("cardSection").innerHTML='';
    readTask();
}