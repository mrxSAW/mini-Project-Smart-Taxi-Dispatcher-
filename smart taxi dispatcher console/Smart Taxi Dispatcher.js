const prompt = require('prompt-sync')();

let Taxis = [
  { id: 1, position: 5, available: false, timeRemaining: 5, totalRides: 0 },{ id: 2, position: 12, available: false, timeRemaining: 4, totalRides: 0 },{ id: 3, position: 20, available: true, timeRemaining: 6, totalRides: 0 }];

let Requests = [{ reqId: 1, position: 10, duration: 3, time: 0 },{ reqId: 2, position: 3, duration: 4, time: 2 },{ reqId: 3, position: 2, duration: 2, time: 4 },{ reqId: 4, position: 7, duration: 5, time: 5 }];
let waitingQueue = [];

function calculeDistance() {
  for (let i = 0; i < Taxis.length; i++) {
    for (let j = 0; j < Requests.length; j++) {
      let distance = Math.abs(Taxis[i].position - Requests[j].position);
      console.log(`La distance entre le taxi ${Taxis[i].id} et la demande ${Requests[j].reqId} est ${distance}`);
    }
  }
                            }

function afficherTaxiDisponibleLePlusProche() {
  for (let j = 0; j < Requests.length; j++) {
    let demande = Requests[j];
    let taxiLePlusProche = null;
    let distanceMin = Infinity;

    for (let i = 0; i < Taxis.length; i++) {
      let taxi = Taxis[i];
      if (taxi.available) {
        let distance = Math.abs(taxi.position - demande.position);
        if (distance < distanceMin) {
          distanceMin = distance;
          taxiLePlusProche = taxi;
        }
      }
    }

    if (taxiLePlusProche) {
      console.log(` Pour la demande ${demande.reqId}, le taxi disponible le plus proche est le taxi ${taxiLePlusProche.id} (distance : ${distanceMin})`);
    } else {
      console.log(` Aucun taxi disponible pour la demande ${demande.reqId}`);
    }
  }
                                               }



function simulerTemps(minutes) {
  let demandeId = parseInt(prompt("Entrez l'ID de la demande à assigner : "));
  let demande = Requests.find(function(r) {
    return r.reqId === demandeId;
  });

  if (!demande) {
    console.log("Demande introuvable.");
    return;
  }

  
  let taxiLePlusProche = null;
  let distanceMin = Infinity;

  for (let i = 0; i < Taxis.length; i++) {
    let taxi = Taxis[i];
    if (taxi.available) {
      let distance = Math.abs(taxi.position - demande.position);
      if (distance < distanceMin) {
        distanceMin = distance;
        taxiLePlusProche = taxi;
      }
    }
  }

  if (taxiLePlusProche) {
    taxiLePlusProche.available = false;
    taxiLePlusProche.position = demande.position;
    taxiLePlusProche.timeRemaining = demande.duration;
    taxiLePlusProche.totalRides += 1;
    console.log("Taxi", taxiLePlusProche.id, "assigné à la demande", demande.reqId, "pour", demande.duration, "minute(s).");
  } else {
    console.log(" Aucun taxi disponible. La demande", demande.reqId, "est ajoutée à la file d’attente.");
    waitingQueue.push(demande);
  }

  
  for (let m = 1; m <= minutes; m++) {
    console.log("\n Minute", m);

    for (let i = 0; i < Taxis.length; i++) {
      let taxi = Taxis[i];

      if (!taxi.available) {
        taxi.timeRemaining -= 1;

        if (taxi.timeRemaining <= 0) {
          taxi.available = true;
          taxi.timeRemaining = 0;
          console.log("Taxi", taxi.id, "est maintenant disponible");

          
          if (waitingQueue.length > 0) {
            let demandeEnAttente = waitingQueue.shift();
            taxi.available = false;
            taxi.position = demandeEnAttente.position;
            taxi.timeRemaining = demandeEnAttente.duration;
            taxi.totalRides += 1;
            console.log(" Taxi", taxi.id, "prend la demande en attente", demandeEnAttente.reqId, "pour", demandeEnAttente.duration, "minute(s).");
          }
        } else {
          console.log("Taxi", taxi.id, "encore occupé pour", taxi.timeRemaining, "minute(s)");
        }
      }
    }
  }
                                }
  
function afficherResumeFinal(minutesSimules) {
  let totalTrajets = 0;

  console.log("\n Résumé de la simulation :");
  console.log(" Temps total simulé :", minutesSimules, "minute(s)");

  for (let i = 0; i < Taxis.length; i++) {
    let taxi = Taxis[i];
    totalTrajets += taxi.totalRides;

    console.log(
      " Taxi", taxi.id,"| Trajets effectués :", taxi.totalRides,"| Position finale :", taxi.position);
  }

  console.log("Nombre total de trajets effectués :", totalTrajets);
                                              }




let choix
do{ 
    console.log("\n 1:calculer la distance \n 2:la voiture la plus proche  \n 3:choisire une demande \n 4: afficher resumer finale \n Q:quiter ")
     choix = prompt("entrer un choix ")    
    
    if (choix=="1") {
        calculeDistance()
    }
    else if(choix=="2") {
        afficherTaxiDisponibleLePlusProche()
    }
    else if(choix=="3"){
        simulerTemps(10)
    }
    else if (choix=="4") {
        afficherResumeFinal(10)
    }
    else if (choix=="Q") {
        console.log("fin du programme");
    }
    else{
        console.log("choix invalid ");
        
    }

    }while(choix!=="Q")
    
    
 // calculeDistance(); 
 // afficherTaxiDisponibleLePlusProche()
 // simulerTemps(10)
 // afficherResumeFinal(10)
