import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import { GoogleProjection } from 'jsfreemaplib';
import * as db from './myModules/db.js';

db.createDB();

//<a-asset-item src='assets\models\titatnic\scene.gltf' id='titatnic'></a-asset-item>
//<a-asset-item src='assets\models\walls\scene.gltf' id='walls'></a-asset-item>

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Registered successfully.');
        })
        .catch(e => {
            console.error(`Service worker registration failed: ${e}`);
        });    
} else {
    alert('Sorry, offline functionality not available, please update your browser!');
}

if(navigator.geolocation) {
    navigator.geolocation.watchPosition (

        gpspos=> {
           
            console.log(`Lat ${gpspos.coords.latitude} Lon ${gpspos.coords.longitude}`); // show on the console
            document.getElementById("lat").textContent = gpspos.coords.latitude;//.toFixed(4) ;
            document.getElementById("lon").textContent = gpspos.coords.longitude;//.toFixed(4) ;
            const merc = new GoogleProjection();
            const projected = merc.project(gpspos.coords.longitude, gpspos.coords.latitude);
            console.log(`Easting: ${projected[0]}, x: ${projected[0]}, northing: ${projected[1]}, z: ${-projected[1]}`);

        },

        err=> {
            alert(`An error occurred: ${err.code}`);
        },

        {
            enableHighAccuracy:true,    
            maximumAge: 5000 
        }

    );
} else {
    alert("Sorry, geolocation not supported in this browser");
}





//look-at="src:#box1"
window.onload=function(){
document.getElementById("closeWelcome").addEventListener("click", (e)=> {
    console.log("work")
    var el = document.querySelector("#welcome1");
    el.setAttribute("visible",false);
    score()
    db.search();
  })
}

AFRAME.registerGeometry('helparrow', {
    init: function() {

        const triangle = new THREE.Shape([
            new THREE.Vector2(0,   0),
            new THREE.Vector2(1,   0),
            new THREE.Vector2(0.5, 1)
        ]);
       // triangle.rotation.x=-Math.PI * 0.5;
        // Make the shape auto-close so we don't have to repeat the first point
        triangle.autoClose = true;

        // Set the geometry field to a new ShapeGeometry making use of the shape
        this.geometry = new THREE.ShapeGeometry(triangle);
    
       // getObject3D(triangle)

    }
});

AFRAME.registerComponent('loadclues', {
    init: function() { 
   
    }
});

//Score 
function score(){
    var score = 1000;
    var downloadTimer = setInterval(function(){
        score=score-10;
    document.getElementById("score").textContent = score;
    if(score <= 0)
        clearInterval(downloadTimer);
    },1000);
   

}

AFRAME.registerComponent('updatelocation', {
    init: function() {
        this.loaded = false;
        window.addEventListener('gps-camera-update-position', e => {
            if(this.loaded === false) {
                this.loaded = true;
                alert(`Your initial location is: ${e.detail.position.longitude} ${e.detail.position.latitude}`);
                console.log(`Your initial location is: ${e.detail.position.longitude} ${e.detail.position.latitude}`);
                // Add code to download from a web API here...
            }
        });
    }
});

