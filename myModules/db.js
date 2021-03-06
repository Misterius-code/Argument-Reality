let db;
function createDB(){
let nrofclues;
const indexedDB = window.indexedDB;
const request = indexedDB.open("cluesDB", 1);
request.onsuccess = function(e) {
    console.log("Successfully opened the database!");
    db = e.target.result;
}
request.onerror = function(e) {
   
     console.log("Error opening database: " + e.target.errorCode);
}
request.onupgradeneeded = e=> {
    const db = e.target.result; 
    if(db.version >= 2) {
        db.deleteObjectStore('clues');  
    }

    const objectStore = db.createObjectStore("clues", {
            keyPath:"id"
    });

    const clues = [
        { id: "1", name:"titanic" ,latitude: "50.897750", longitude: "-1.409433" ,text:"Berth 44", positionOfText:"0 30 0"},
        { id: "2", name:"bargate" ,latitude: "50.890500", longitude: "-1.397990" ,text:"Bar+gate = ?", positionOfText:"0 40 0"},
        { id: "3", name:"bigBen" ,latitude: "50.902630", longitude: "-1.404098" ,text:"Big Ben of Southamtpon", positionOfText:"0 40 0"},
        { id: "4", name:"chest" ,latitude : "50.907987", longitude : "-1.407406" ,text:"Winner" ,positionOfText:"0 6 0"}
       
                    ];
                    
    for(let i=0; i<clues.length; i++) {
       objectStore.add(clues[i]);
    }

};
}



function search(){
   
    let nr = 0;
    const transaction = db.transaction("clues","readwrite");
    const objectStore = transaction.objectStore('clues');

    const request = objectStore.openCursor();
    request.onsuccess =  e => {
        const cursor = e.target.result;
        if(cursor) {
        nr +=1;

        const entity = document.createElement('a-entity');
        document.createAttribute('gps-projected-entity-place'),
        entity.setAttribute('scale','0.2 0.2 0.2 ');
        entity.setAttribute('gltf-model', `#${cursor.value.name}`);
        entity.setAttribute('id',`clues${cursor.value.id}`);
        entity.setAttribute(`gps-projected-entity-place`,`latitude: ${cursor.value.latitude} ;longitude:${cursor.value.longitude}`);
        entity.setAttribute('visible',false);
        document.querySelector('a-scene').appendChild(entity);
        
        const atext = document.createElement('a-text');
        atext.setAttribute('value',`${cursor.value.text}`);
        atext.setAttribute('align','center');
        atext.setAttribute('scale','10 10 10');
        atext.setAttribute('position',`${cursor.value.positionOfText}`);
        atext.setAttribute('color','red');
        document.createAttribute('look-at'),
        atext.setAttribute('look-at','#camera');
        document.getElementById(`clues${cursor.value.id}`).appendChild(atext);
          cursor.continue();
        } else {
            console.log('No results!');
            document.getElementById("allClues").textContent = nr;
      
        } 
    };

    request.onerror = e => {
        console.log(`ERROR ${e.target.errorCode}`);
    };

}


export { createDB, search };