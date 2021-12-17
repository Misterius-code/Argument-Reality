import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import * as db from './myModules/db.js';


var clueNr =1;

var scoreDecrease=10;
db.createDB();







window.onload=function(){
  document.getElementById("search").addEventListener("click", (e)=> {
    
    const sparrow = document.getElementById('sparrow');
    sparrow.setAttribute('look-at',`#clues${clueNr}`);
    sparrow.setAttribute('visible',true);
    scoreDecrease=30;
    

  })
}

var score ;

//Score
function points(){
    score = 30000;
    var timer = setInterval(function(){
        score=score-scoreDecrease;
        
      
        detection();
    document.getElementById("points").textContent = score;
    if(score <= 0)
        clearInterval(timer);
    },1000);
   

}


AFRAME.registerComponent('updatelocation', {
    init: function() {
    if(navigator.geolocation) {
        navigator.geolocation.watchPosition (
    
            gpspos=> {
        
             
                document.getElementById("lat").textContent = gpspos.coords.latitude;
                document.getElementById("lon").textContent = gpspos.coords.longitude;
                detection()
                window.onload=function(){
                document.querySelector('#clues1').setAttribute('visible',false);
          
                }
                
           
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
        points()
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


if(cameraPosition.z - cluePosition.z <= 5 && cameraPosition.x - cluePosition.x <=5  &&  cameraPosition.z - cluePosition.z >= -5 &&  cameraPosition.x - cluePosition.x >=-5) 
{
    document.querySelector(`#clues${clueNr}`).setAttribute("visible",true);
    clueNr+=1;   
    scoreDecrease=10;
    document.querySelector('#sparrow').setAttribute('visible',false);
        
  
}

}else{
if(clueNr=1)
{

}else{


console.log("YOU WON")
alert(`You found all ${numberOfClues} clues. Congratulation , your score is   ${document.getElementById("points").textContent}`)
score=0;
}
}
}


