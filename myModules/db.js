let db;
function createDB(){


const indexedDB = window.indexedDB;
const request = indexedDB.open("cluesDB", 1);

request.onsuccess = function(e) {
    console.log("Successfully opened the database!");
    db = e.target.result;
   
}
request.onerror = function(e) {
    // Imagine displayMessage() is a function which fills a div with content
     console.log("Error opening database: " + e.target.errorCode);
}

request.onupgradeneeded = e=> {
    const db = e.target.result; // IDBDatabase instance

    // If upgrading to version >=2, delete the old object store
    if(db.version >= 2) {
        db.deleteObjectStore('clues');  
    }

    const objectStore = db.createObjectStore("clues", {
            keyPath:"id"
    });

    const clues = [
        { id: "1", name:"chest" ,latitude : "50.906858", longitude : "-1.3565465" ,text:"win" ,positionOfText:"0 6 0"},
        { id: "2", name:"bigBen" ,latitude: "50.906160", longitude: "-1.356560" ,text:"Big Ben of Southamtpon", positionOfText:"0 40 0"}
        //{ id: "3", name:"chest" ,latitude: "jb139", longitude: "1.356570" ,text:"lal"}
                    ];
    
    for(let i=0; i<clues.length; i++) {
       objectStore.add(clues[i]);
    }
    
  
};
}

function search(){
   
//document.getElementById('search').addEventListener('click', e=> {
   // const id ="1"
    const transaction = db.transaction("clues","readwrite");
    const objectStore = transaction.objectStore('clues');
   // const request = objectStore.get(id);
    const request = objectStore.openCursor();

    request.onsuccess =  e => {
        const cursor = e.target.result;
        if(cursor) {
        const entity = document.createElement('a-entity');
        entity.setAttribute('gltf-model', `#${cursor.value.name}`);
      //  entity.setAttribute('scale',`${cursor.value.scale}`);

        entity.setAttribute('id',`clues${cursor.value.id}`);
        document.createAttribute('gps-projected-entity-place'),
        entity.setAttribute(`gps-projected-entity-place`,`latitude: ${cursor.value.latitude} ;longitude: ${cursor.value.longitude}`);
        document.querySelector('a-scene').appendChild(entity);
        
        const atext = document.createElement('a-text');
        atext.setAttribute('value',`${cursor.value.text}`);
        atext.setAttribute('align','center');
        atext.setAttribute('scale','10 10 10');
        atext.setAttribute('position',`${cursor.value.positionOfText}`);
        //atext.setAttribute('position','0 40 0');
        atext.setAttribute('color','red');
       // document.createAttribute('gps-entity-place'),
        document.createAttribute('look-at'),
       // atext.setAttribute(`gps-entity-place`,`latitude: ${cursor.value.latitude} ;longitude: ${cursor.value.longitude}`);
        atext.setAttribute('look-at','#camera');
        //document.querySelector('a-scene').appendChild(atext);
   
        document.getElementById(`clues${cursor.value.id}`).appendChild(atext);


        console.log(cursor.value.name)    
          console.log(cursor.value.id)    
          console.log(cursor.value.latitude)    
          console.log(cursor.value.longitude)   
          console.log(cursor.value.text)  
   
          cursor.continue();
        } else {
            console.log('No results!');
        } 
    };

    request.onerror = e => {
        console.log(`ERROR ${e.target.errorCode}`);
    };
//});
}

export { createDB, search };