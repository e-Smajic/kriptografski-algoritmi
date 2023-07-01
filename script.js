// Cezarovo šifriranje

function cezarovoSifriranje() {
    let div = document.getElementById('caesar-cipher-result');
    let poruka = document.getElementById('caesar-sourcetext').value;
    let pomak = document.getElementById('caesar-offset').value % 94;

    if (pomak != '' && poruka != '') {
        let sifriranaPoruka = '';
        for (var i = 0; i < poruka.length; i++) {
            noviSimbol = String.fromCharCode((poruka[i].charCodeAt() - 33 + pomak) % 94 + 33);
            sifriranaPoruka += noviSimbol;
        }

        div.innerHTML = '<h3>Rješenje: </h3>' 
            + '<p>' + sifriranaPoruka + '</p>'
            + '<button onclick="prikaziPostupak()">Pokaži postupak</button>'
            + '<div id="caesar-showsteps"></div>';
    }     

    
}

function prikaziPostupak() {
    let postupak = document.getElementById('caesar-showsteps');
    let inicijalniPomak = document.getElementById('caesar-offset').value
    let pomak = inicijalniPomak % 94;
    let poruka = document.getElementById('caesar-sourcetext').value;

    postupak.innerHTML = '<p>Svaki simbol je označen jedinstvenim brojem u ASCII kodu.</p>'
    + '<p>Dozvoljeni opseg ovdje je [33(!) - 126(~)]. To je ukupno 94 simbola.</p>'
    + '<p>Uneseni pomak je: ' + inicijalniPomak  + '</p>'
    + '<p>Primjer transformacije simbola je prikazan na prvom simbolu.</p>'
    + '<p>Prvo se računa ostatak pri dijeljenju (offset mod 94): ' + pomak + '</p>'
    + '<p>Ovo se radi kako simboli ne bi napustili dozvoljeni opseg i zato pomak mora biti u klasi ostataka broja 94.</p>'
    + '<p>Nakon toga se svaki simbol (u ASCII kodu) oduzima sa 33 kako bi se vratio na opseg [0-93] radi lakšeg računanja: </p>'
    + '<p>' + poruka[0] + ' = ' + poruka[0].charCodeAt().toString() + ' - 33 = ' + (poruka[0].charCodeAt() - 33).toString() + '</p>'
    + '<p>Dodaje se pomak: </p>'
    + '<p>' + (poruka[0].charCodeAt() - 33).toString() + ' + ' + pomak + ' = ' + (poruka[0].charCodeAt() - 33 + pomak).toString() + '</p>'
    + '<p>Opet računamo mod 94 od dobijene vrijednosti kako bi smo ostali u opsegu računanja: </p>'
    + '<p>' + (poruka[0].charCodeAt() - 33 + pomak).toString() + ' % 94 = ' + ((poruka[0].charCodeAt() - 33 + pomak) % 94).toString() + '</p>'
    + '<p>Dodajemo 33 nazad kako bi smo se vratili u opseg [33-126]: </p>'
    + '<p>' + ((poruka[0].charCodeAt() - 33 + pomak) % 94).toString() + ' + 33 = ' + ((poruka[0].charCodeAt() - 33 + pomak) % 94 + 33).toString() + '</p>'
    + '<p>Konačno pretvaramo ASCII kod u simbol: </p>'
    + '<p>' + ((poruka[0].charCodeAt() - 33 + pomak) % 94 + 33).toString() + ' = ' + String.fromCharCode((poruka[0].charCodeAt() - 33 + pomak) % 94 + 33) + '</p>';
}

// AES

function aes() {
    let tekst = document.getElementById("aes-sourcetext").value;
    let K = document.getElementById("aes-key").value;
    let rezultat = document.getElementById("aes-result");

    if (K.length > 16 || tekst.length > 16) {
        rezultat.innerHTML = '<p>GREŠKA: Poruka/Ključ ne smije biti preko 128 bita!</p>';
        return;
    }

    let K_matrica = generisiMatricu(K);
    let tekst_matrica = generisiMatricu(tekst);

    let roundKljucevi = generisiRoundKljuceve(K_matrica);
    tekst_matrica = addState(tekst_matrica, roundKljucevi[0]);

    for (var i = 0; i < 10; i++) {
        tekst_matrica = subBytes(tekst_matrica);
        tekst_matrica = shiftRows(tekst_matrica);

        if (i != 9)
            tekst_matrica = mixColumns(tekst_matrica);

        tekst_matrica = pretvoriClanoveUBinarni(tekst_matrica);
        tekst_matrica = addState(tekst_matrica, roundKljucevi[i+1]);
    }

    let sifriraniTekst = aesPretvoriUTekst(tekst_matrica);


    rezultat.innerHTML = '<h3>Rješenje: </h3>' 
    + '<p>' + sifriraniTekst + '</p>'
    + '<button onclick="aes_postupak()">Pokaži postupak</button>'
    + '<div id="aes-showsteps"></div>';
}

function aes_postupak() {
    let tekst = document.getElementById("aes-sourcetext").value;
    let K = document.getElementById("aes-key").value;
    let koraci = document.getElementById("aes-showsteps");
    let K_matrica = generisiMatricu(K);
    let tekst_matrica = generisiMatricu(tekst);
    let roundKljucevi = generisiRoundKljuceve(K_matrica);

    let rezultat = '<p>Prvo se tekst i ključ transformišu u 4x4 matrice.</p>'
    + '<p>Poruka:</p>'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(tekst_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '<p>Ključ:</p>'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(K_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }
    rezultat += '</table>'
    + '<p>Generišu se round ključevi po algoritmu na slici</p>'
    + '<img src="./img/aes-keygen.png" alt="aeskeygen" style="width: 600px; height: 600px"/>'
    + '<div class="aes-grid">';
    for (var i = 1; i < 11; i++) {
        rezultat += '<div class="aes-gridelement">'
        + '<p>Round ' + i + ' ključ:</p>'
        + '<table>';
        for (var m = 0; m < 4; m++) {
            rezultat += '<tr>';
            for (var n = 0; n < 4; n++) {
                rezultat += '<td>' + pretvoriUHex(roundKljucevi[i][m][n]) + '</td>'; 
            }
            rezultat += '</tr>';
        }
        rezultat += '</table>'
        + '</div>';
    }
    rezultat += '</div>'
    + '<p>Pristupa se postupku na slici:</p>'
    + '<img src="./img/aes-postupak.jpg" alt="aespostupak" style="width: 800px; height: 400px"/>'
    + '<p>Radi se XOR sa početnim ključem:</p>'
    + '<div class="aes-grid">'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(K_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>'
    + '<tr rowspan="4"><td>XOR</td></tr>'
    + '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(tekst_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    tekst_matrica = addState(tekst_matrica, roundKljucevi[0]);

    rezultat += '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>'
    + '<tr rowspan="4"><td>=</td></tr>'
    + '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(tekst_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '</div>'
    + '</div>'
    + '<p>Runda 1:</p>'
    + '<p>Sub-bytes </p> <a href="https://en.wikipedia.org/wiki/Rijndael_S-box" target="_blank">(Link na S-box tabelu ovdje)</a>' 
    + '<table>';

    tekst_matrica = subBytes(tekst_matrica);

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + tekst_matrica[i][j] + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '<p>Shift rows: </p>' 
    + '<table>';

    tekst_matrica = shiftRows(tekst_matrica);

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + tekst_matrica[i][j] + '</td>'; 
        }
        rezultat += '</tr>';
    }

    const M = [['02', '03', '01', '01'], 
    ['01', '02', '03', '01'],
    ['01', '01', '02', '03'],
    ['03', '01', '01', '02']];

    rezultat += '</table>'
    + '<p>Mix columns: </p>'
    + '<div class="aes-grid">'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + M[i][j] + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>'
    + '<tr rowspan="4"><td>X</td></tr>'
    + '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + tekst_matrica[i][j] + '</td>'; 
        }
        rezultat += '</tr>';
    }

    tekst_matrica = mixColumns(tekst_matrica);

    rezultat += '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>'
    + '<tr rowspan="4"><td>=</td></tr>'
    + '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + tekst_matrica[i][j] + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '</div>'
    + '</div>'
    
    + '<p>Radi se XOR sa Round 1 ključem:</p>'
    + '<div class="aes-grid">'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(roundKljucevi[1][i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>'
    + '<tr rowspan="4"><td>XOR</td></tr>'
    + '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + tekst_matrica[i][j] + '</td>'; 
        }
        rezultat += '</tr>';
    }

    tekst_matrica = pretvoriClanoveUBinarni(tekst_matrica);
    tekst_matrica = addState(tekst_matrica, roundKljucevi[1]);

    rezultat += '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>'
    + '<tr rowspan="4"><td>=</td></tr>'
    + '</table>'
    + '</div>'
    + '<div class="aes-gridelement">'
    + '<table>';

    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(tekst_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '</div>'
    + '</div>'
    + '<p>Postupak se nastavlja u 10 rundi. U 10. rundi se izostavlja Mix Columns faza. Nakon 10 rundi dobija se konačna matrica:</p>'
    + '<table>';

    for (var i = 1; i < 10; i++) {
        tekst_matrica = subBytes(tekst_matrica);
        tekst_matrica = shiftRows(tekst_matrica);

        if (i != 9)
            tekst_matrica = mixColumns(tekst_matrica);

        tekst_matrica = pretvoriClanoveUBinarni(tekst_matrica);
        tekst_matrica = addState(tekst_matrica, roundKljucevi[i+1]);
    }

    
    for (var i = 0; i < 4; i++) {
        rezultat += '<tr>';
        for (var j = 0; j < 4; j++) {
            rezultat += '<td>' + pretvoriUHex(tekst_matrica[i][j]) + '</td>'; 
        }
        rezultat += '</tr>';
    }

    rezultat += '</table>'
    + '<p>Iz matrice učitavamo kriptovani tekst:</p>'
    + '<p>' + aesPretvoriUTekst(tekst_matrica) + '</p>';

    koraci.innerHTML = rezultat;
}

function aesPretvoriUTekst(matrica) {
    let tekst = "";

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            tekst += pretvoriUHex(matrica[j][i]) + " ";
        }
    }

    return tekst;
}

function generisiMatricu(x) {
    let matrica = [[],[],[],[]];
    let ciklus = 0;

    for (var i = 0; i < 16; i++) {
        if (x[i] != undefined) 
            matrica[ciklus].push(pretvoriUBinarni(x[i].charCodeAt(), 8));  
        
        else
            matrica[ciklus].push(pretvoriUBinarni(0, 8));

        ciklus = (ciklus + 1) % 4;
    }

    return matrica;
}

function generisiRoundKljuceve(matrica) {
    let kljucevi = [];
    kljucevi.push(matrica.slice());

    for (var i = 0; i < 10; i++) {
        let trenutniKljuc = kljucevi[i];
        let noviKljuc = [[],[],[],[]];

        let zadnjaKolona = [];

        for (var j = 0; j < 4; j++) {
            zadnjaKolona.push(trenutniKljuc[j][3]);
        }
        zadnjaKolona = rotWord(zadnjaKolona);
        
        for (var j = 0; j < 4; j++) {
            zadnjaKolona[j] = hex2bin(getSBox(zadnjaKolona[j]));
        }
        zadnjaKolona[0] = RCON(zadnjaKolona[0], i);
        
        for (var red = 0; red < 4; red++) {
            for (var kol = 0; kol < 4; kol++) {
                if (kol == 0)
                    noviKljuc[red].push(XOR(trenutniKljuc[red][kol], zadnjaKolona[red]));
                else 
                    noviKljuc[red].push(XOR(trenutniKljuc[red][kol], noviKljuc[red][kol-1]));                
                   
            }
        }
        kljucevi.push(noviKljuc);
    }

    return kljucevi;
}

function rotWord(niz) {
    let temp = niz[0];
    for (var i = 0; i < 3; i++) {
        niz[i] = niz[i+1];
    }
    niz[3] = temp; 

    return niz;
}

function getSBox(clan) {
    const tablica = [
        ['63', '7c', '77', '7b', 'f2', '6b', '6f', 'c5', '30', '01', '67', '2b', 'fe', 'd7', 'ab', '76'],
        ['ca', '82', 'c9', '7d', 'fa', '59', '47', 'f0', 'ad', 'd4', 'a2', 'af', '9c', 'a4', '72', 'c0'],
        ['b7', 'fd', '93', '26', '36', '3f', 'f7', 'cc', '34', 'a5', 'e5', 'f1', '71', 'd8', '31', '15'],
        ['04', 'c7', '23', 'c3', '18', '96', '05', '9a', '07', '12', '80', 'e2', 'eb', '27', 'b2', '75'],
        ['09', '83', '2c', '1a', '1b', '6e', '5a', 'a0', '52', '3b', 'd6', 'b3', '29', 'e3', '2f', '84'],
        ['53', 'd1', '00', 'ed', '20', 'fc', 'b1', '5b', '6a', 'cb', 'be', '39', '4a', '4c', '58', 'cf'],
        ['d0', 'ef', 'aa', 'fb', '43', '4d', '33', '85', '45', 'f9', '02', '7f', '50', '3c', '9f', '18'],
        ['51', 'a3', '40', '8f', '92', '9d', '38', 'f5', 'bc', 'b6', 'da', '21', '10', 'ff', 'f3', 'd2'],
        ['cd', '0c', '13', 'ec', '5f', '97', '44', '17', 'c4', 'a7', '7e', '3d', '64', '5d', '19', '73'],
        ['60', '81', '4f', 'dc', '22', '2a', '90', '88', '46', 'ee', 'b8', '14', 'de', '5e', '0b', 'db'],
        ['e0', '32', '3a', '0a', '49', '06', '24', '5c', 'c2', 'd3', 'ac', '62', '91', '95', 'e4', '79'],
        ['e7', 'c8', '37', '6d', '8d', 'd5', '4e', 'a9', '6c', '56', 'f4', 'ea', '65', '7a', 'ae', '08'],
        ['ba', '78', '25', '2e', '1c', 'a6', 'b4', 'c6', 'e8', 'dd', '74', '1f', '4b', 'bd', '8b', '8a'],
        ['70', '3e', 'b5', '66', '48', '03', 'f6', '0e', '61', '35', '57', 'b9', '86', 'c1', '1d', '9e'],
        ['e1', 'f8', '98', '11', '69', 'd9', '8e', '94', '9b', '1e', '87', 'e9', 'ce', '55', '28', 'df'],
        ['8c', 'a1', '89', '0d', 'bf', 'e6', '42', '68', '41', '99', '2d', '0f', 'b0', '54', 'bb', '16']
    ];
    let znak1 = pretvoriUHex(clan.substring(0,4));
    let znak2 = pretvoriUHex(clan.substring(4,8));
    return tablica[hexIndex(znak1)][hexIndex(znak2)];
}

function RCON(x, iteracija) {
    const RC = ['00000001', '00000010', '00000100', '00001000', 
                '00010000', '00100000', '01000000', '10000000',
                '00011011', '00110110'];

    return XOR(x, RC[iteracija]);
}

function addState(tekstMat, K) {
    let noviState = [[],[],[],[]];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            let xorRezultat = XOR(tekstMat[i][j], K[i][j]);
            noviState[i].push(xorRezultat);
        }
    }
    return noviState;
}

function subBytes(state) {
    let noviState = [[],[],[],[]];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            noviState[i].push(getSBox(state[i][j]));
        }
    }

    
    return noviState;
}

function shiftRows(state) {
    let noviState = [[],[],[],[]];
    for (var i = 0; i < 4; i++) {
        let red = state[i];
        for (var j = 0; j < i; j++)
            red = rotWord(red);
        noviState[i] = red;
    }
    
    return noviState;
}

function mixColumns(state) {
    const constMatrix = [['02', '03', '01', '01'], 
                         ['01', '02', '03', '01'],
                         ['01', '01', '02', '03'],
                         ['03', '01', '01', '02']];

    let noviState = [[],[],[],[]];

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            noviState[i].push(pomnoziDioMatrice(constMatrix, state, i, j))
        }
    }

    return noviState;
}

function pomnoziDioMatrice(mat1, mat2, i, j) {
    let red = mat1[i];
    let kolona = [];

    for (var k = 0; k < 4; k++) {
        kolona.push(mat2[k][j]);
    }

    let rezultat = polinomskoMnozenje(red[0], kolona[0]);
    for (var k = 1; k < 4; k++) {
        rezultat = XOR(rezultat, polinomskoMnozenje(red[k], kolona[k]));
    }

    return pretvoriUHex(rezultat);
}

function pretvoriClanoveUBinarni(mat) {
    let novaMat = [[],[],[],[]];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            novaMat[i].push(hex2bin(mat[i][j]));
        }
    }
    return novaMat;
}

function polinomskoMnozenje(broj1, broj2) {
    let prviClan = obrniString(hex2bin(broj1));
    let drugiClan = obrniString(hex2bin(broj2));
    let nizCounter = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    
    
    for (var i = 0; i < prviClan.length; i++) {
        if (prviClan[i] == '1') {
            for (var j = 0; j < drugiClan.length; j++) {
                if (drugiClan[j] == '1') {
                    nizCounter[i+j] += 1;
                }
            }
        }
    }

    nizCounter = transformisiPolinom(nizCounter);
    
    if (potrebanModulo(nizCounter))
        nizCounter = polinomModulo2(nizCounter)

    return nizCounter.slice(0, 8).reverse().join("");
}

function transformisiPolinom(nizCounter) {
    let noviNiz = nizCounter;
    for (var i = 0; i < noviNiz.length; i++) {
        if (noviNiz[i] % 2 == 0) 
            noviNiz[i] = 0;
        else 
            noviNiz[i] = 1;
    }
    return noviNiz;
}

function potrebanModulo(nizCounter) {
    for (var i = 0; i < nizCounter.length; i++) {
        if (i >= 8 && nizCounter[i] == 1)
            return true;
    }
    return false;
}

function polinomModulo2(nizCounter) {
    // x8 + x4 + x3 + x + 1
    const moduloPolinom = [1,1,0,1,1,0,0,0,1,0,0,0,0,0,0,0];
    let noviCounter = nizCounter;
    let maxIndex = 0;

    for (var i = nizCounter.length - 1; i >= 0; i--) {
        if (nizCounter[i] == 1) {
            maxIndex = i;
            break;
        }
    }

    let indexRazlika = maxIndex - 8;

    for (var i = 0; i < moduloPolinom.length; i++) {
        if (moduloPolinom[i] == 1) {
            noviCounter[i+indexRazlika] += 1;
        }
    }

    noviCounter = transformisiPolinom(noviCounter);

    if (potrebanModulo(noviCounter))
        polinomModulo2(noviCounter);
    
    return noviCounter;

}

function hexIndex(znak) {
    if (znak >= '0' && znak <= '9')
        return znak.charCodeAt() - 48;
    else if (znak >= 'a' && znak <= 'f')
        return 10 + znak.charCodeAt() - 97;
    else return -1;
}

function hex2bin(broj) {
    const brojevi = ['0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111', '1000', '1001', '1010', '1011', '1100', '1101', '1110', '1111'];
    let bin = '';

    for (var i = 0; i < broj.length; i++) {
        bin += brojevi[hexIndex(broj[i])];
    }

    return bin;
}

function obrniString(str) {
    return str.split("").reverse().join("");
}

// RSA

function rsa() {
    let tekst = document.getElementById("rsa-sourcetext").value;
    let E = document.getElementById("rsa-firstnum").value;
    let prviProst = document.getElementById("rsa-prime1").value;
    let drugiProst = document.getElementById("rsa-prime2").value;
    let rezultat = document.getElementById("rsa-result");

    if (!jeLiProstBroj(prviProst) || !jeLiProstBroj(drugiProst)) {
        rezultat.innerHTML = '<p>GREŠKA: p i q moraju biti prosti brojevi!</p>';
        return;
    }
    if (prviProst == drugiProst) {
        rezultat.innerHTML = '<p>GREŠKA: p i q ne smiju biti jednaki!</p>';
        return;
    }
    if (prviProst * drugiProst < 128) {
        rezultat.innerHTML = '<p>GREŠKA: p * q mora biti veći od 128!</p>';
        return;
    }
    if (!jeLiIspravnoE(E, prviProst, drugiProst)) {
        rezultat.innerHTML = '<p>GREŠKA: E ne zadovoljava kriterije!</p>';
        return;
    }

    let noviTekst = kodirajPoruku_RSA(tekst, E, prviProst * drugiProst);

    rezultat.innerHTML = '<h3>Rješenje: </h3>' 
    + '<p>' + noviTekst.join(" ") + '</p>'
    + '<button onclick="rsa_postupak()">Pokaži postupak</button>'
    + '<div id="rsa-showsteps"></div>';
}

function rsa_postupak() {
    let tekst = document.getElementById("rsa-sourcetext").value;
    let E = document.getElementById("rsa-firstnum").value;
    let prviProst = document.getElementById("rsa-prime1").value;
    let drugiProst = document.getElementById("rsa-prime2").value;
    let N = prviProst * drugiProst;
    let postupak = document.getElementById("rsa-showsteps");
    let fi = eulerovaFunkcija(prviProst, drugiProst);
    let E_prim = 0;

    for (var i = 1; i < fi; i++) {
        if ((E * i) % fi == 1) {
            E_prim = i;
            break;
        }
    }

    let tekstPostupka = '<p>Koristi se ključ enkripcije: K(' + E + ', ' + N + ')</p>'
    + '<p>Šaljemo svaki simbol pojedinačno, tako da se svaki simbol pretvara u ASCII kod: </p>'
    + '<ul>';

    for (var i = 0; i < tekst.length; i++) {
        tekstPostupka += '<li>' + tekst[i] + ' = ' + tekst[i].charCodeAt() + '</li>';
    }

    tekstPostupka += '</ul>'
    + '<p>Onda se transformiše svaki simbol po formuli X ^' + E + ' mod ' + N + '</p>'
    + '<ul>';

    for (var i = 0; i < tekst.length; i++) {
        tekstPostupka += '<li>' + tekst[i] + ' = ' + tekst[i].charCodeAt() + ' ^ ' + E + ' mod ' + N + ' = ' + modStepen(tekst[i].charCodeAt(), E, N) + '</li>';
    }

    tekstPostupka += '</ul>'
    + '<p>Koristi se ključ dekripcije: K\'(' + E_prim + ', ' + N + ')</p>'
    + '<p>Onda se transformiše svaki enkriptovani broj po formuli X ^' + E_prim + ' mod ' + N + '</p>'
    + '<ul>';

    for (var i = 0; i < tekst.length; i++) {
        let kriptovani = modStepen(tekst[i].charCodeAt(), E, N);
        tekstPostupka += '<li>' + kriptovani + ' ^ ' + E_prim + ' mod ' + N + ' = ' + modStepen(kriptovani, E_prim, N) + '</li>';
    }
    tekstPostupka += '</ul>'
    + '<p>Brojeve pretvaramo nazad u ASCII simbole: </p>'
    + '<ul>';

    for (var i = 0; i < tekst.length; i++) {
        let kriptovani = modStepen(tekst[i].charCodeAt(), E, N);
        tekstPostupka += '<li>' + modStepen(kriptovani, E_prim, N) + ' = ' + String.fromCharCode(modStepen(kriptovani, E_prim, N)) + '</li>';
    }

    postupak.innerHTML = tekstPostupka;
}

function jeLiProstBroj(broj) {
    for (var i = 2; i < broj; i++) {
        if (broj % i == 0)
            return false;
    }
    return true;
}

function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    else {
        return gcd(b, a % b);
        
    }
}

function jeLiIspravnoE(E, p, q) {
    let fi = eulerovaFunkcija(p,q);
    if (gcd(E,fi) == 1  && gcd(E, p*q) == 1 && E > 1 && E < fi)
        return true;
    
    return false;
}

function kodirajPoruku_RSA(tekst, E, N) {
    let noviTekst = [];
    for (var i = 0; i < tekst.length; i++) {
        let znak = modStepen(tekst[i].charCodeAt(), E, N);
        noviTekst.push(znak);
    }
    return noviTekst;
}

function modStepen(a, b, m) {   
    let x = a;
    for (var i = 1; i < b; i++) {
        x *= a;
        x = x % m;
    }
    return x;
}

function eulerovaFunkcija(p,q) {
    return (p-1) * (q-1);
}

// SHA-256

function sha256() {
    let div = document.getElementById('sha-result');
    let poruka = document.getElementById('sha-sourcetext').value;
    
    let porukaBin = "";
    for (var i = 0; i < poruka.length; i++) {
        porukaBin += pretvoriUBinarni(poruka[i].charCodeAt(), 8);
    }
    porukaBin = dodajPadding(porukaBin);
    let W = parsirajUNiz(porukaBin);
    W = kompresujNiz(W);
    let konacnaPoruka = vratiHexSekvencu(W);

    div.innerHTML = '<h3>Rješenje: </h3>' 
    + '<p>' + konacnaPoruka + '</p>'
    + '<button onclick="sha256_postupak()">Pokaži postupak</button>'
    + '<div id="sha-showsteps"></div>';
}

function sha256_postupak() {
    let poruka = document.getElementById('sha-sourcetext').value;
    let postupak = document.getElementById('sha-showsteps');
    
    let porukaBin = "";
    for (var i = 0; i < poruka.length; i++) {
        porukaBin += pretvoriUBinarni(poruka[i].charCodeAt(), 8);
    }
    let paddingPoruka = dodajPadding(porukaBin);
    let W = parsirajUNiz(paddingPoruka);
    let W_kompresovano = kompresujNiz(W);

    let koraci = '<p>Prvo se poruka pretvara u binarni oblik:</p>'
    + '<p>' + porukaBin + '</p>'
    + '<p>Dodaje se padding na poruku:</p>';

    for (var i = 0; i < 512; i += 128) 
        koraci += '<p>' + paddingPoruka.substring(i, 128 + i) + '</p>';
    
    koraci += '<p>Izvršava se parsiranje sekvence u niz od 64 člana. Prvih 16 članova se dobija iz trenutne sekvence:</p>';

    for (var i = 0; i < 16; i++) 
        koraci += '<p> W[' + i + '] = ' + W[i] + '</p>';

    koraci += '<p>Ostali članovi sekvence se računaju po formulama:</p>'
    + '<img src="./img/sha-W-formula.jpg" alt="formula"/>'
    + '<br>'
    + '<img src="./img/sha-formule.jpg" alt="formula"/>' ;

    koraci += '<p>Ostali članovi niza su:</p>';

    for (var i = 16; i < 64; i++) 
        koraci += '<p> W[' + i + '] = ' + W[i] + '</p>';

    koraci += '<p>Ulazi se u fazu kompresije niza. Potrebne su nam sljedeće konstante i funkcije:</p>'
    + '<ul>'
    + '<li>K tablica</li>'
    + '<img src="./img/sha-kniz.jpg" alt="formula"/>'
    + '<li>Inicijalni H heševi</li>'
    + '<img src="./img/sha-hniz.jpg" alt="formula"/>'
    + '<li>Formule i postupci za proračun</li>'
    + '<img src="./img/sha-kompresija-funkcije.jpg" alt="formula"/>'
    + '<br>'
    + '<img src="./img/sha-kompresija.jpg" alt="formula"/>';
    + '</ul>';

    koraci += '<p>Nakon proračunavanja heševa, uradi se sabiranje po modulu 2 sa početnim H nizom. Konačno se H dobije kao niz:</p>';

    for (var i = 0; i < 8; i++) 
        koraci += '<p> H[' + i + '] = ' + W_kompresovano[i] + ' = ' + pretvoriUHex(W_kompresovano[i]) + '</p>';

    koraci += '<p>Niz se složi u finalnu sekvencu:</p>'
    + '<p>' + vratiHexSekvencu(W_kompresovano) + '</p>';

    postupak.innerHTML = koraci;
}

function pretvoriUBinarni(broj, duzina) {
    let bin = "";

    do {
        let ostatak = broj % 2;
        bin += ostatak;
        broj = Math.floor(broj / 2);
    }
    while (broj > 0);

    while (bin.length != duzina)
        bin += '0';

    bin = bin.split("").reverse().join("");

    return bin;
}

function pretvoriUHex(broj) {
    let cifre = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f'];
    let hex = '';
    
    for (var i = 0; i < broj.length; i += 4) {
        let dio = broj.substring(i, i+4);
        hex += cifre[pretvoriUDekadni(dio)];
    }

    return hex;
}

function pretvoriUDekadni(broj) {
    let exp = 0;
    broj = broj.split("").reverse().join("");
    let noviBroj = 0;

    for (var i = 0; i < broj.length; i++) {
        if (broj[i] == '1')
            noviBroj += Math.pow(2, exp);

        exp += 1;
    }

    return noviBroj;
}

function dodajPadding(poruka) {
    let duzina = pretvoriUBinarni(poruka.length, 64);
    poruka += '1';
    while (poruka.length % 512 != 448) {
        poruka += '0';
    }
    poruka += duzina;
    return poruka;
}

function parsirajUNiz(poruka) {
    let niz = [];

    let element = '';

    for (var i = 0; i < poruka.length; i++) {
        element += poruka[i];

        if ((i + 1) % 32 == 0) {
            niz.push(element);
            element = '';
        }
    }

    for (var i = 16; i < 64; i++) {
        let novi = modulo2_4(Sigma1(niz[i-2]), niz[i-7], Sigma0(niz[i-15]), niz[i-16]);
        niz.push(novi);
    }

    return niz;
}

function kompresujNiz(niz) {
    // Konstante:
    const K = 
    [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2

    ];

    const initialH = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    for (var i = 0; i < K.length; i++) {
        K[i] = pretvoriUBinarni(K[i], 32);
    }

    for (var i = 0; i < H.length; i++) {
        H[i] = pretvoriUBinarni(H[i], 32);
        initialH[i] = pretvoriUBinarni(initialH[i], 32);
    }

    // Postupak:
    for (var i = 0; i < niz.length; i++) {
        let T1 = modulo2_5(H[7], BigSigma1(H[4]), Ch(H[4], H[5], H[6]), K[i], niz[i]);
        let T2 = modulo2(BigSigma0(H[0]), Maj(H[0], H[1], H[2]));

        H[7] = H[6];
        H[6] = H[5];
        H[5] = H[4];
        H[4] = modulo2(H[3], T1);
        H[3] = H[2];
        H[2] = H[1];
        H[1] = H[0];
        H[0] = modulo2(T1, T2);
    }

    for (var i = 0; i < H.length; i++) {
        H[i] = modulo2(H[i], initialH[i]);
    }

    return H;
}

function vratiHexSekvencu(niz) {
    let seq = '';
    for (var i = 0; i < niz.length; i++) {
        seq += pretvoriUHex(niz[i]);
    }
    return seq;
}

function ROTR(poruka, n) {
    let niz = poruka.split("");

    for (var i = 0; i < n; i++) {
        let zadnji = niz.pop();
        niz.unshift(zadnji);
    }

    return niz.join("");
}

function SHR(poruka, n) {
    for (var i = 0; i < n; i++) {
        poruka += '0';
        poruka = ROTR(poruka, 1);
        poruka = poruka.split("");
        poruka.pop();
        poruka = poruka.join("");
    }

    return poruka;
}

function XOR(poruka1, poruka2) {
    let returnPoruka = '';

    for (var i = 0; i < poruka1.length; i++) {
        if (poruka1[i] == poruka2[i])
            returnPoruka += '0';
        else
            returnPoruka += '1';
    }

    return returnPoruka;
}

function modulo2(poruka1, poruka2) {
    let a = pretvoriUDekadni(poruka1);
    let b = pretvoriUDekadni(poruka2);
    let x = pretvoriUBinarni(a + b, 64);

    return x.substring(32, 64);
}

function modulo2_4(m1, m2, m3, m4) {
    let a = pretvoriUDekadni(m1);
    let b = pretvoriUDekadni(m2);
    let c = pretvoriUDekadni(m3);
    let d = pretvoriUDekadni(m4);
    let x = pretvoriUBinarni(a + b + c + d, 64);

    return x.substring(32, 64);
}

function modulo2_5(m1, m2, m3, m4, m5) {
    let a = pretvoriUDekadni(m1);
    let b = pretvoriUDekadni(m2);
    let c = pretvoriUDekadni(m3);
    let d = pretvoriUDekadni(m4);
    let e = pretvoriUDekadni(m5);
    let x = pretvoriUBinarni(a + b + c + d + e, 64);

    return x.substring(32, 64);
}

function AND(poruka1, poruka2) {
    let returnPoruka = '';

    for (var i = 0; i < poruka1.length; i++) {
        if (poruka1[i] == '1' && poruka2[i] == '1')
            returnPoruka += '1';
        else
            returnPoruka += '0';
    }

    return returnPoruka;
}

function NOT(poruka) {
    let returnPoruka = '';
    
    for (var i = 0; i < poruka.length; i++) {
        if (poruka[i] == '0')
            returnPoruka += '1';
        else
            returnPoruka += '0';
    }

    return returnPoruka;
}

function Sigma0(x) {
    let a = ROTR(x, 7);
    let b = ROTR(x, 18);
    let c = SHR(x, 3);
    return XOR(XOR(a,b), c);
}

function Sigma1(x) {
    let a = ROTR(x, 17);
    let b = ROTR(x, 19);
    let c = SHR(x, 10);
    return XOR(XOR(a,b), c);
}

function BigSigma0(x) {
    let a = ROTR(x, 2);
    let b = ROTR(x, 13);
    let c = ROTR(x, 22);
    return XOR(XOR(a,b), c);
}

function BigSigma1(x) {
    let a = ROTR(x, 6);
    let b = ROTR(x, 11);
    let c = ROTR(x, 25);
    return XOR(XOR(a,b), c);
}

function Ch(x, y, z) {
    let a = AND(x, y);
    let b = AND(NOT(x), z);
    return XOR(a, b);
}

function Maj(x, y, z) {
    let a = AND(x, y);
    let b = AND(x, z);
    let c = AND(y, z)
    return XOR(XOR(a, b), c);
}

// SHA-256 w/ Salt
function sha256_salt() {
    let div = document.getElementById('sha-salt-result');
    let poruka = document.getElementById('sha-salt-sourcetext').value;
    let saltDuzina = document.getElementById('sha-salt-length').value;

    if (saltDuzina < 1) {
        div.innerHTML = '<p>GREŠKA: Salt ne može biti manji od 1!</p>';
        return;
    }

    let salt = generisiSalt(saltDuzina);
    poruka += salt;

    let porukaBin = "";
    for (var i = 0; i < poruka.length; i++) {
        porukaBin += pretvoriUBinarni(poruka[i].charCodeAt(), 8);
    }
    porukaBin = dodajPadding(porukaBin);
    let W = parsirajUNiz(porukaBin);
    W = kompresujNiz(W);
    let konacnaPoruka = vratiHexSekvencu(W);

    div.innerHTML = '<h3>Rješenje: </h3>' 
    + '<p>' + konacnaPoruka + '</p>'
    + '<h3>Generisani salt: </h3>' 
    + '<p id="sha-salt-value">' + salt + '</p>'
    + '<button onclick="sha256_salt_postupak()">Pokaži postupak</button>'
    + '<div id="sha-salt-showsteps"></div>';

}

function sha256_salt_postupak() {
    let poruka = document.getElementById('sha-salt-sourcetext').value;
    let salt = document.getElementById('sha-salt-value').textContent;
    let postupak = document.getElementById('sha-salt-showsteps');

    postupak.innerHTML = '<p>Generisani salt se dodaje na izvornu poruku i izvršava se obično SHA-256 heširanje.</p>'
    + '<p>Poruka postaje: ' + poruka + salt + '</p>'
    + '<p>Ovakva poruka se hešira SHA-256 algoritmom. Detaljniji postupak heširanja se može vidjeti unosom poruke u SHA-256 formu i heširanjem.</p>';
}

function generisiSalt(duzina) {
    let salt = "";
    for (var i = 0; i < duzina; i++) 
        salt += String.fromCharCode(randomBroj(33, 127));
    return salt;
}

function randomBroj(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
