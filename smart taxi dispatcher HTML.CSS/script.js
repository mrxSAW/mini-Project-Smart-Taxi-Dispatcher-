let Taxis = [
  { id: 1, position: 5, available: false, timeRemaining: 5, totalRides: 0 },
  { id: 2, position: 12, available: false, timeRemaining: 4, totalRides: 0 },
  { id: 3, position: 6, available: false, timeRemaining: 6, totalRides: 0 }
];

let Requests = [
  { reqId: 1, position: 10, duration: 3, time: 0 },
  { reqId: 2, position: 3, duration: 4, time: 2 },
  { reqId: 3, position: 2, duration: 2, time: 4 },
  { reqId: 4, position: 7, duration: 5, time: 5 }
];

let waitingQueue = [];
let output = document.getElementById("output");

function log(msg) {
  output.innerHTML += msg + "<br>";
  output.scrollTop = output.scrollHeight;
}

function calculeDistance() {
  output.innerHTML = "";
  for (let i = 0; i < Taxis.length; i++) {
    for (let j = 0; j < Requests.length; j++) {
      let distance = Math.abs(Taxis[i].position - Requests[j].position);
      log(`Distance Taxi ${Taxis[i].id} ↔ Demande ${Requests[j].reqId} : ${distance}`);
    }
  }
}

function afficherTaxiDisponibleLePlusProche() {
  output.innerHTML = "";
  for (let demande of Requests) {
    let taxiLePlusProche = null;
    let distanceMin = Infinity;

    for (let taxi of Taxis) {
      if (taxi.available) {
        let distance = Math.abs(taxi.position - demande.position);
        if (distance < distanceMin) {
          distanceMin = distance;
          taxiLePlusProche = taxi;
        }
      }
    }

    if (taxiLePlusProche) {
      log(` Demande ${demande.reqId} ➜ Taxi ${taxiLePlusProche.id} (distance: ${distanceMin})`);
    } else {
      log(` Aucun taxi disponible pour la demande ${demande.reqId}`);
    }
  }
}

function choisirDemande() {
  document.getElementById("input-zone").scrollIntoView({ behavior: "smooth" });
  log(" Entrez l'ID de la demande ci-dessus, puis cliquez sur 'Assigner Taxi'");
}

function simulerTemps(minutes) {
  output.innerHTML = "";

  let demandeId = parseInt(document.getElementById("demandeId").value);
  let demande = Requests.find(r => r.reqId === demandeId);

  if (!demande) {
    log("  Demande introuvable.");
    return;
  }

  let taxiLePlusProche = null;
  let distanceMin = Infinity;

  for (let taxi of Taxis) {
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
    log(` Taxi ${taxiLePlusProche.id} assigné à la demande ${demande.reqId} pour ${demande.duration} minute(s).`);
  } else {
    log(` Aucun taxi disponible. La demande ${demande.reqId} est en attente.`);
    waitingQueue.push(demande);
  }

  for (let m = 1; m <= minutes; m++) {
    log(`<br> Minute ${m}`);
    for (let taxi of Taxis) {
      if (!taxi.available) {
        taxi.timeRemaining -= 1;

        if (taxi.timeRemaining <= 0) {
          taxi.available = true;
          taxi.timeRemaining = 0;
          log(` Taxi ${taxi.id} est maintenant disponible`);

          if (waitingQueue.length > 0) {
            let demandeEnAttente = waitingQueue.shift();
            taxi.available = false;
            taxi.position = demandeEnAttente.position;
            taxi.timeRemaining = demandeEnAttente.duration;
            taxi.totalRides += 1;
            log(`Taxi ${taxi.id} prend la demande en attente ${demandeEnAttente.reqId}`);
          }
        } else {
          log(`Taxi ${taxi.id} encore occupé (${taxi.timeRemaining} min restantes)`);
        }
      }
    }
  }
}

function afficherResumeFinal(minutesSimules) {
  output.innerHTML = "";
  let totalTrajets = 0;
  log(`<strong> Résumé de la simulation (${minutesSimules} min)</strong>`);
  for (let taxi of Taxis) {
    totalTrajets += taxi.totalRides;
    log(`Taxi ${taxi.id} ==> Trajets: ${taxi.totalRides} | Position finale: ${taxi.position}`);
  }
  log(`<br> Total trajets effectués : ${totalTrajets}`);
}
