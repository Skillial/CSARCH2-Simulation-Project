let EMAX = 191;
let EMIN = 1;
let BIAS = 101;

let num;
let exp;
let ID = ["Truncate", "Floor", "Ceiling", "RTNTE"];
window.onload = function () {
    for (let i = 0; i < ID.length; i++) {
        let button = document.getElementById(ID[i]);
        button.onclick = function () {
            for (let j = 0; j < ID.length; j++) {
                let button = document.getElementById(ID[j]);
                if (button !== this)
                    button.classList.remove("active");
                else
                    button.classList.add("active");
            }
        };
    }


    let convertButton = document.getElementById("Convert");
    convertButton.onclick = convert;
};

function convert() {
    num = document.getElementById("num").value.toString();
    exp = parseInt(document.getElementById("exp").value);
    normalize();
    for (let i = 0; i < ID.length; i++) {
        let button = document.getElementById(ID[i]);
        if (button.classList.contains("active")) {
            switch (ID[i]) {
                case "Truncate":
                    trunc();
                    break;
                case "Floor":
                    floor();
                    break;
                case "Ceiling":
                    ceil();
                    break;
                case "RTNTE":
                    rtnte();
                    break;
            }
        }
    }
    console.log("NUM: ", num)
    console.log("EXP: ", exp)
    let sign = checkSign();
    let expPrime = exp + BIAS;
    let combiField = 0;
    if (expPrime > EMAX) {
        combiField = "11110"
        expPrime = "000000"
    } else if (expPrime < EMIN){
        return;
    } else {
        let expBin = decToBin(expPrime);
        if (expBin.length != 8) {
            let temp = expBin;
            expBin = ""
            for (let i = 0; i < 8 - temp.length; i++) {
                expBin += "0";
            }
            expBin +=temp;
            console.log(expBin)
        }
        let newnum = "";
        if (num[0] == '-') {
            newnum = num.substring(1);
        } else {
            newnum = num;
        }
        let firstDigit = decToBin(parseInt(newnum[0]));
        if (firstDigit.length != 4) {
            let temp = firstDigit;
            firstDigit = ""
            for (let i = 0; i < 4 - temp.length; i++) {
                firstDigit += "0";
            }
            firstDigit +=temp;
        }
        if (firstDigit[0]=='1'){
            combiField = "11" + expBin.substring(0,2) + firstDigit.substring(3,4);
            expBin = expBin.substring(2);
        } else {
            combiField =  expBin.substring(0,2) + firstDigit.substring(1,4);
            expBin = expBin.substring(2);
        
        }
        console.log(sign+combiField+expBin)
        
    }
    

}

function trunc() {
    let origDecimal = getDecimal(num);
    if (origDecimal == -1) {
        return;
    }
    num = num.substring(0, origDecimal);
}

function floor() {
    let origDecimal = getDecimal(num);
    if (origDecimal == -1) {
        return;
    }
    check = parseFloat(num.substring(origDecimal));
    if (check == 0) {
        num = num.substring(0, origDecimal);
    } else {
        if (num[0] == '-') {
            num = (parseInt(num.substring(0, origDecimal)) - 1).toString();
        } else {
            num = num.substring(0, origDecimal);
        }
    }
}

function ceil() {
    let origDecimal = getDecimal(num);
    if (origDecimal == -1) {
        return;
    }
    check = parseFloat(num.substring(origDecimal));
    if (check == 0) {
        num = num.substring(0, origDecimal);
    } else {
        if (num[0] == '-') {
            num = num.substring(0, origDecimal);
        } else {
            num = (parseInt(num.substring(0, origDecimal)) + 1).toString();
        }
    }
}

function rtnte() {
    let origDecimal = getDecimal(num);
    if (origDecimal == -1) {
        return;
    }
    check = parseFloat(num.substring(origDecimal));
    if (check == 0) {
        num = num.substring(0, origDecimal);
    } else if (check < 0.5) {
        if (num[0] == '-') {
            num = num.substring(0, origDecimal);
        } else {
            num = num.substring(0, origDecimal);
        }
    } else if (check > 0.5) {
        if (num[0] == '-') {
            num = (parseInt(num.substring(0, origDecimal)) - 1).toString();
        } else {
            num = (parseInt(num.substring(0, origDecimal)) + 1).toString();
        }
    } else {
        let whole = parseFloat(num.substring(0, origDecimal));
        if (whole % 2 == 0) {
            num = num.substring(0, origDecimal);
        } else if (num[0] == '-') {
            num = (parseInt(num.substring(0, origDecimal)) - 1).toString();
        } else {
            num = (parseInt(num.substring(0, origDecimal)) + 1).toString();
        }

    }
}


function normalize() {
    let newnum;
    if (num[0] == '-') {
        newnum = num.substring(1);
        num = '-';
    } else {
        newnum = num;
        num = '';
    }

    let origDecimal = getDecimal(newnum);
    if (origDecimal == -1) {
        if (newnum.length < 7) {
            for (let i = 0; i < (7 - newnum.length); i++) {
                num += '0';
            }
            num += newnum;
        } else if (newnum.length == 7) {
            num += newnum;
        } else {
            num += newnum.substring(0, 7) + '.' + newnum.substring(7);
            exp += newnum.length - 7;
        }

    } else {
        let temp = '';
        if (newnum.length <= 8) {
            if (origDecimal + 1 != newnum.length) {
                temp += newnum.substring(0, origDecimal) + newnum.substring(origDecimal + 1);
                exp -= (newnum.length - 1) - origDecimal
            } else {
                temp += newnum.substring(0, origDecimal);
            }
            for (let i = 0; i < (8 - newnum.length); i++) {
                num += '0';
            }
            num += temp;
        } else {
            if (origDecimal <= 7) {
                num += newnum.substring(0, origDecimal) + newnum.substring(origDecimal + 1, 8) + '.' + newnum.substring(8);
                exp -= 7 - origDecimal
            } else {
                num += newnum.substring(0, 7) + '.' + newnum.substring(7, origDecimal) + newnum.substring(origDecimal + 1);
                exp += origDecimal - 7;

            }
        }
    }

}

function getDecimal(temp) {
    return strNumber = temp.toString().indexOf('.');
}

function checkSign() {
    if (num[0] == 0) {
        return 1;
    } else {
        return 0;
    }
}   

function decToBin(expPrime) {
    return (expPrime >>> 0).toString(2);
}
