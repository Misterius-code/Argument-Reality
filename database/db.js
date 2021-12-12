function createDB(){
let db;

const indexedDB = window.indexedDB;
const request = indexedDB.open("studentdb", 1);

request.onsuccess = function(e) {
    displayMessage("Successfully opened the database!");
    db = e.target.result;
}
request.onerror = function(e) {
    // Imagine displayMessage() is a function which fills a div with content
    displayMessage("Error opening database: " + e.target.errorCode);
}

request.onupgradeneeded = e=> {
    const db = e.target.result; // IDBDatabase instance

    // If upgrading to version >=2, delete the old object store
    if(db.version >= 2) {
        db.deleteObjectStore('students');
    }

    const objectStore = db.createObjectStore("students", {
            keyPath:"username"
    });

    const students = [
        { name: "Deep Patel", username: "dp061", course: "CNWD" },
        { name: "Tim Smith", username: "ts282", course: "Computing" },
        { name: "Jamie Bailey", username: "jb139", course: "Computing" }
                    ];

    for(let i=0; i<students.length; i++) {
        objectStore.add(students[i]);
    }
};
}

document.getElementById('search').addEventListener('click', e=> {
    const username ="dp061"
    const transaction = db.transaction("students");
    const objectStore = transaction.objectStore('students');
    const request = objectStore.get(username);
    request.onsuccess =  e => {
        if(e.target.result) {
          console.log(e.target.result.username)    
          console.log(e.target.result.name)    
          console.log(e.target.result.course)    
      
        } else {
            console.log('No results!');
        } 
    };

    request.onerror = e => {
        displayMessage(`ERROR ${e.target.errorCode}`);
    };
});