import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import * as db from './myModules/db.js';


var clueNr =1;
var ROTO= true
var scoreDecrease=10;
db.createDB();

function GpsCheck(){

}





window.onload=function(){
  document.getElementById("search").addEventListener("click", (e)=> {
    
    const sparrow = document.getElementById('sparrow');
    sparrow.setAttribute('look-at',`#clues${clueNr}`);
    sparrow.setAttribute('visible',true);
    scoreDecrease=30;
    
   //document.querySelector('#clues1').setAttribute('visible',false);
  // document.querySelector('#clues2').setAttribute('visible',false);

  })
}



//Score 
function score(){
    var score = 30000;
    var timer = setInterval(function(){
        score=score-scoreDecrease;
        ;
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
        navigator.geolocation.getCurrentPosition (
    
            gpspos=> {
            //    if(ROTO=true){
             //       document.querySelector('#camera').setAttribute('gps-projected-camera' ,`simulateLatitude: 1; simulateLongitude: 1;`);
            //        ROTO=false;
            //    }
             
                document.getElementById("lat").textContent = gpspos.coords.latitude;
                document.getElementById("lon").textContent = gpspos.coords.longitude;
              //  detection()
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
        db.search();
        score()
    },
    
    tick: function(totalTime, timeSinceLastTick) {
      //  console.log(")
       // detection();
   }
});
     
      
    

function detection(){
document.getElementById(`cluesLeft`).textContent=clueNr-1;
var numberOfClues = document.getElementById(`allClues`).textContent;
if(clueNr <= numberOfClues){
var cameraPosition = document.querySelector('#camera').getAttribute('position');
var cluePosition =  document.querySelector(`#clues${clueNr}`).getAttribute('position');
//console.log(cameraPosition.z - cluePosition.z )
//console.log(cameraPosition.x - cluePosition.x )

if(cameraPosition.z - cluePosition.z <= 20 && cameraPosition.x - cluePosition.x <=20  &&  cameraPosition.z - cluePosition.z >= -20 &&  cameraPosition.x - cluePosition.x >=-20) 
{
    document.querySelector(`#clues${clueNr}`).setAttribute("visible",true);
    clueNr+=1;   
    scoreDecrease=10;
    document.querySelector('#sparrow').setAttribute('visible',false);
        
  
}

}else{
scoreDecrease=0
console.log("YOU WON")
alert(`You found all ${numberOfClues} clues. Congratulation , your soce is   ${document.getElementById("score").textContent}`)
clueNr+=1;  
}

}


