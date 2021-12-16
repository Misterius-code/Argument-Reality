import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import { GoogleProjection } from 'jsfreemaplib';
import * as db from './myModules/db.js';

db.createDB();
var clueNr =1;
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
            document.querySelector('#camera').setAttribute('gps-projected-camera' ,"simulateLatitude: 50.90711567299209; simulateLongitude: -1.3572192192077637;");
            db.search();
            console.log(`Lat ${gpspos.coords.latitude} Lon ${gpspos.coords.longitude}`); // show on the console
            document.getElementById("lat").textContent = gpspos.coords.latitude;
            document.getElementById("lon").textContent = gpspos.coords.longitude;
           // const merc = new GoogleProjection();
          //  const projected = merc.project(gpspos.coords.longitude, gpspos.coords.latitude);
          //  console.log(`Easting: ${projected[0]}, x: ${projected[0]}, northing: ${projected[1]}, z: ${-projected[1]}`);
            score()
         
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
  document.getElementById("search").addEventListener("click", (e)=> {
  let locationModel= document.querySelector('#clues1').getAttribute('gps-projected-entity-place');
  let locationCamera= document.querySelector('#camera').getAttribute('gps-projected-camera');
   console.log(locationModel.latitude)
   Math.hypot(locationModel.latitude, locationModel.longitude)
   console.log(Math.hypot(locationModel.latitude , locationModel.longitude )+"KURWA")
  
 // document.getElementById('arrow').setAttribute("rotation","30 0 0")
 // arrow.rotation="30 0 0"
  })
}
//document.querySelector("[camera]").setAttribute("position", "0 30 0")
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
        detection();
        score=score-10;
        // //var position = new THREE.Vector3(clue.x, clue.y, clue.z);
    document.getElementById("score").textContent = score;
    const arrow = document.getElementById('cone').object3D;

    var position = new THREE.Vector3(10, 60, 30);
    arrow.up = new THREE.Vector3(0,0,-1);
    arrow.lookAt(position);
    
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
                document.getElementById("cluesLeft").textContent = ` LON : ${e.detail.position.longitude}   LAT ${e.detail.position.latitude}  ` ; 
            }
        });
    }
});
function detection(){
var cameraPosition = document.querySelector('#camera').getAttribute('position');
var cluePosition =  document.querySelector(`#clues${clueNr}`).getAttribute('position');

console.log(cameraPosition.z - cluePosition.z )

//console.log(cameraPosition.x - cluePosition.x )
if(cameraPosition.z - cluePosition.z <= 20 && cameraPosition.x - cluePosition.x <=20  &&  cameraPosition.z - cluePosition.z >= -20 &&  cameraPosition.x - cluePosition.x >=-20) 

console.log(cameraPosition.x - cluePosition.x )

{

 
    document.querySelector(`#clues${clueNr}`).setAttribute("visible",true);
    clueNr+=1;
    console.log("WHYYYYYYY")
    

} 


}


