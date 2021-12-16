import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import { GoogleProjection } from 'jsfreemaplib';
import * as db from './myModules/db.js';


var clueNr =1;
var ROTO= true
var scoreDecrise=10;
//<a-asset-item src='assets\models\titatnic\scene.gltf' id='titatnic'></a-asset-item>
//<a-asset-item src='assets\models\walls\scene.gltf' id='walls'></a-asset-item>
db.createDB();

function GpsCheck(){

}




//look-at="src:#box1"
window.onload=function(){
  document.getElementById("search").addEventListener("click", (e)=> {
  let locationModel= document.querySelector('#clues1').getAttribute('gps-projected-entity-place');
  let locationCamera= document.querySelector('#camera').getAttribute('gps-projected-camera');
   console.log(locationModel.latitude)
   Math.hypot(locationModel.latitude, locationModel.longitude)
   console.log(Math.hypot(locationModel.latitude , locationModel.longitude )+"KURWA")
   document.querySelector('#clues1').setAttribute('visible',false);
   document.querySelector('#clues2').setAttribute('visible',false);
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
       const arrow = document.getElementById('cone').object3D;

       var position = new THREE.Vector3(10, 60, 30);
       arrow.up = new THREE.Vector3(0,0,-1);
       arrow.lookAt(position);
       
   // //var position = new THREE.Vector3(clue.x, clue.y, clue.z);


       
    }
});



//Score 
function score(){
    var score = 30000;
    var timer = setInterval(function(){
        score=score-10;
        GpsCheck();
        detection();
    document.getElementById("score").textContent = score;
  
    if(score <= 0)
        clearInterval(timer);
    },1000);
   

}
/*
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
*/

AFRAME.registerComponent('updatelocation', {
    init: function() {
    if(navigator.geolocation) {
        navigator.geolocation.getPosition (
    
            gpspos=> {
            //    if(ROTO=true){
             //       document.querySelector('#camera').setAttribute('gps-projected-camera' ,`simulateLatitude: 1; simulateLongitude: 1;`);
            //        ROTO=false;
            //    }
             
                document.getElementById("lat").textContent = gpspos.coords.latitude;
                document.getElementById("lon").textContent = gpspos.coords.longitude;
                detection()
                window.onload=function(){
                document.querySelector('#clues1').setAttribute('visible',false);
                document.getElementById(`test`).textContent="IT WORK";
                }
                
              // document.querySelector('#clues2').setAttribute('visible',false);
               console.log("CO JEST KURWA");
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
}
});
AFRAME.registerComponent('startgame', {
    init: function() {
        this.loaded = false;
        console.log("PROSZE")
     
        db.search();
        score()

    },
    
    tick: function(totalTime, timeSinceLastTick) {
      //  console.log("KURWAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
       // detection();
   }
});
     
      
    

function detection(){
document.getElementById(`cluesLeft`).textContent=clueNr-1;
var numberOfClues = document.getElementById(`allClues`).textContent;
if(clueNr <= numberOfClues){
var cameraPosition = document.querySelector('#camera').getAttribute('position');
var cluePosition =  document.querySelector(`#clues${clueNr}`).getAttribute('position');
console.log(cameraPosition.z - cluePosition.z )
//console.log(cameraPosition.x - cluePosition.x )

if(cameraPosition.z - cluePosition.z <= 20 && cameraPosition.x - cluePosition.x <=20  &&  cameraPosition.z - cluePosition.z >= -20 &&  cameraPosition.x - cluePosition.x >=-20) 
{
    document.querySelector(`#clues${clueNr}`).setAttribute("visible",true);
    clueNr+=1;   
    
  
} 
}

}


