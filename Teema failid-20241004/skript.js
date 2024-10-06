//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
let summa = 0;
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');

lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            korv.push(toode);
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            
            summa +=Number(toode.hind) * toode.kogus;
            
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
        }
    });
});


//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

        
    lisaKorviJalus(); // selle funktsiooni lisame allpool
    console.log(arvutaOstukorviSumma());
    lisaSummaRida();
    
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => decreaseItem(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
            summa +=Number(toode.hind) ;
        }
    });
    uuendaSummat();
}
//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function decreaseItem(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
            summa -=Number(toode.hind) ;
        }
        if (korvArtikkel.kogus == 0) {
            eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
        }
    });
    uuendaSummat();
}



//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    summa -=Number(toode.hind)* toode.kogus;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    uuendaSummat();
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => alustTaimer());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
    
    
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    summa = 0;
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
    
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.

function arvutaOstukorviSumma() {
    let ostSumma=0;
    korv.forEach(item =>  {
        ostSumma = ostSumma + Number(item.hind) * item.kogus
       // console.log(item.hind);
    });
    //console.log(ostSumma);
    if (valitudTarne[0].checked){
        ostSumma = ostSumma + 2.3
    } else {
        ostSumma = ostSumma + 0.8
    }
    return ostSumma ;

}

function lisaSummaRida() {
    if (document.querySelector('.korv-summa') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
            <div class="korv-summa">
                <h3 class="korv_summa_label">Summa kokku :</h3>
                <h3 id="korv_summa_hind">${arvutaOstukorviSumma(summa)}</h3>    
            </div>
    `);
    
        const korvArtiklidS = korviSisu.querySelectorAll('.korv_artikkel');
        korvArtiklidS.forEach(korvArtikkelS => {
            korvArtikkelS.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => uuendaSummat());
            korvArtikkelS.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => uuendaSummat());
            korvArtikkelS.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => uuendaSummat());
        }
        )
    } 
}
function uuendaSummat(){
    document.getElementById("korv_summa_hind").innerHTML = arvutaOstukorviSumma(summa);
}


//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);

};

 function alustTaimer () {
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
};


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
const postiindeks = document.getElementById("postiIndeks");

const errorMessage = document.getElementById("errorMessage");
let valitudTarne = document.getElementsByName("tarne");
console.log(valitudTarne.forEach(tarne => {tarne.checked
}));
console.log(valitudTarne);
console.log(valitudTarne[0].checked);
document.myForm.tarne.forEach(item =>item.addEventListener('change', () => uuendaSummat())); 

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    //Minu kood
    if (postiindeks.value.length != 5) {
        errors.push("Postindeks peab olema 5 kohaline")
    }

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    }

    if (/\d/.test(eesnimi.value)) {
        errors.push("Eesnimi sisaldab numbreid")
    }
    if (/\d/.test(perenimi.value)) {
        errors.push("Perenimi sisaldab numbreid")
    }

    //proovisin erinevaid meetodeid, ei töötanud ükski
    console.log(isNaN(parseInt(telefon)));
    if( isNaN(parseInt(telefon.value))){
        errors.push("Telefon peab sisaldama ainult numbreid")
    }
    console.log(telefon);
    if(telefon.value.length<6) {
        errors.push("Telefon on liiga lühike")
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

})

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



