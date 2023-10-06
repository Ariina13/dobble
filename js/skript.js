//SPIEL

/* Aus "n" leitet sich der komplette Algorithmus vom Spiel ab
•	n+1 = Anzahl Symbole einer Karte
•	n+1 = Anzahl Karten in einem Set
•	n+1 = Anzahl Sets im Spiel
•	n^2+n+1 = Anzahl möglicher Karten insgesamt
•	n^2+n+1 = Anzahl Symbole insgesamt
*/

//--------------
//VARIABLEN
//---------------
var schwierigkeit;
var AnzahlKartenInsgesamt;
var stellvertreter;
var kartendeck;
var clickCounter;
var spielrundeFertig;
var punktestand;
var time;
var angezeigteKarte = [];
// Der div Box das Spielfeld zuordnen
var spielfeld = $qs(".spielfeld");



//--------------
//FUNKTIONEN
//---------------

// Schwierigkeitsgrad abrufen
function schwierigkeitsgradEinstellen(){
  var schwierigkeit = document.getElementById("schwierigkeitsstufe");
  var n = (parseInt(schwierigkeit.value));
  return n;
}

// Anzahl aller Spielkarten berechnen
function AnzahlKartenBerechnen(n) {
  var AnzahlKartenInsgesamt = n**2+n+1;
return AnzahlKartenInsgesamt;
}

// Liste mit den Symbolen erstellen
function symbolerstellung(){
  alleSymbole = [];
  for  (i =0; i<AnzahlKartenInsgesamt; i++) {
    alleSymbole.push("icon-"+i)
  }
  return alleSymbole;
}

// Kartendeck mit Stellvertretern erstellen
function kartendeckerstellung (n) {
  // Array in das alle Stellvertreterkarten angehängt werden
  var stellvertreter = []
  // Das erste Set von Stellvertreterkarten generieren
  for (i = 0; i < n+1; i++) {
    // Jeder Stellvertreterkarte aus dem Set das erste Symbol aus der Array symbole anhängen
    stellvertreter.push([1]);
    // Die Karten gemäss DOBBLE Regel mit den restlichen Symbolen auffüllen
    for (j = 0; j <n; j++) {
        stellvertreter[i].push((j+1)+(i*n)+1);
    }
  }
  // Die restlichen Sets von Stellvertreterkarten generieren
  for (i =0; i<n; i++) {
    for (j =0; j<n; j++) {
      // Jeder Stellvertreterkarte aus dem Set ein gleiches Symbol aus der Array symbole anhängen
      stellvertreter.push([i+2]);  
      // Die Stellvertreterkarten gemäss DOBBLE Regel mit den restlichen Symbolen auffüllen
      for (k =0; k<n; k++) {
        var berechnung =  (n+1 + n*k + (i*k+j)%n)+1
          var lange = stellvertreter.length-1;
          stellvertreter[lange].push(berechnung);
      }
    }
  }  
  // Funktion um die einzelen Karten zu mischen
  for  (i =0; i<AnzahlKartenInsgesamt; i++) {
    stellvertreter[i].shuffle();
    var mischen = stellvertreter[i].join(", ");
  }
  return stellvertreter;
}
// KARTENDECK MISCHEN
function arrayShuffle(){
  var tmp, rand;
  for(var i =0; i < this.length; i++){
    rand = Math.floor(Math.random() * this.length);
    tmp = this[i]; 
    this[i] = this[rand]; 
    this[rand] =tmp;
  }
}
Array.prototype.shuffle = arrayShuffle;

// Objekte erstellen
function $create(name, className) {
  var element = document.createElement(name);
 if (className) { element.className = className; }
  return element;
}

// Funktion die ein Kartendeck erstellt
function erstelleKartendeck() {
  //Stellvertreter durch Symbole ersetzen
  var kartendeck = stellvertreter.map(function(karte) {
      return karte.map(function(symbol) {
      return symbole[symbol-1];
    });
  });
  return kartendeck;
}
 
//Wählt zwei zufällige Karten aus dem Deck (löscht sie im Deck)
function waehleKarten() {
  for (var i = 0; i < 2; i++) {
    angezeigteKarte[i] = kartendeck.splice(Math.floor(Math.random() * kartendeck.length), 1)[0];
  }
}

// QuerySelector
function $qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

// Funktion, die den Punktestand aktualisiert
function aktualisierePunktestand() {
   $qs(".punktestand .counter").textContent = punktestand;
  }

//Timer Funktion
function onTimer() { 
  $qs(".timer .counter").textContent = time; 
  time--; 
    if (time < 0) { 
      //WENN DURCHGANG BEENDET IST
      spielEnde();
    } 
    else { 
    setTimeout(onTimer, 1000);
    }
}

// Funktion, die die zwei gewählten Karten auf dem Bildschirm anzeigt
function aktualisierespielfeld() {
      // Entfernt die alten Karten
      while (spielfeld.firstChild) {
        spielfeld.removeChild(spielfeld.firstChild);
      }
      // Zeigt die neuen Karten an
      angezeigteKarte.forEach(function(item) {
        // Erstellt Objekte
        var karte = $create("div", "karte"); 
        // Macht Symbole zu Buttons
        item.forEach(function(iconName) {
          karte.appendChild($create("button", iconName));
        });
        spielfeld.appendChild(karte);
      });
}

// Funktion, die Spielkarten leert
function leereSpielkarten() {
  // Entfernt die alten Karten
  while (spielfeld.firstChild) {
    spielfeld.removeChild(spielfeld.firstChild);
  }
  // Zeigt die neuen Karten an
  angezeigteKarte.forEach(function(item) {
    // Erstellt Objekte
    var karte = $create("div", "karte"); 
    // Macht Symbole zu Buttons
    spielfeld.appendChild(karte);
  });
}

//--------------
//SPIELVERLAUF
//---------------

// Startbutton
$qs("#play").addEventListener("click", spielStart, false);

// Spielstart
function spielStart() {
  spielrundeFertig = false;
  // Schwierigkeitsgrad prüfen
  schwierigkeit = schwierigkeitsgradEinstellen();
  // Ausgehend vom Schwierigkeitsgrad Kartendeck erstellen
  AnzahlKartenInsgesamt = AnzahlKartenBerechnen(schwierigkeit);
  stellvertreter = kartendeckerstellung(schwierigkeit);
  symbole = symbolerstellung();
  // Erstellt Kartendeck
  kartendeck = erstelleKartendeck();
  // Lässt den Button verschwinden
  this.parentNode.parentNode.style.display = "none";
  // Blendet die Statusliste ein
  document.getElementById('statusleiste').style.display = 'block';
  // Setzt den Punktestand auf 0
  punktestand = 0;
  // Setzt den Timer auf 30 Sekunden
  time = 30; 
  timer=onTimer();
  play();
}

// Kartenanzeigen
function play() {
  //Zählt die Klicks
  clickCounter = 0;
  // Wählt zwei Karten aus dem Kartenkartendeck (löscht sie im kartendeck)
  waehleKarten();
  // Aktualisiert die Statusbar
  aktualisierePunktestand();
  // Zeigt die zwei Karten an
  aktualisierespielfeld();
}

// Auswertung
spielfeld.addEventListener("click", function(event) {
  //Wenn ein Symbol angeklickt wird...
  if (event.target.tagName.toLowerCase() == "button") {
    clickCounter++;
    var gewaehlteSymbol = event.target.className;
    //Der Spielzug endet nach einem Klick auf ein Symbol.
    if (clickCounter > 0){
        // Kontrolle ob das richtige Symbol geklickt wurde
        if (~angezeigteKarte[0].indexOf(gewaehlteSymbol) && ~angezeigteKarte[1].indexOf(gewaehlteSymbol)) {
          punktestand += 1;
          document.getElementById('audioright').play();
        } else {
          document.getElementById('audiowrong').play();
          if (punktestand > 0){
            punktestand -= 1;
          }
        }
      //Kontrolle ob noch genug Karten im Kartendeck sind
      if (kartendeck.length < 2) {
        kartendeck = erstelleKartendeck(AnzahlKartenInsgesamt);
      } 
      //Neuer Spielzug starten, solange der Timer noch läuft
      if (time > 0) {
        play();
      }
    }
  }
}, false);

// Spielende
function spielEnde() {
  spielrundeFertig = true;
  //Karten leeren
  leereSpielkarten();
  //Statusleiste ausblenden
  document.getElementById('statusleiste').style.display = 'none';
  //Einblendung von "Nochmals Spielen Button" und Rückmeldung
  var einblendung = $qs(".einblendung");
  einblendung.style.display = "flex";
  $qs("#play").textContent = "Erneut Spielen!";
  var rueckmeldung = ("Du hast "+punktestand+" Punkte erreicht!")
  $qs(".feedback").textContent = rueckmeldung;
}