let EMAX = 191;
let EMIN = 0;
let BIAS = 101;
const TableLookUp = { "000": "bcdfgh0jkm", "001": "bcdfgh100m", "010": "bcdjkh101m", "011": "bcd10h111m", "100": "jkdfgh110m", "101": "fgd01h111m", "110": "jkd00h111m", "111": "00d11h111m" }
const TableMap = { "b": 1, "c": 2, "d": 3, "f": 5, "g": 6, "h": 7, "j": 9, "k": 10, "m": 11, }

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
    let answer;
    let combiField = 0;
    let expBin = 0;
    let BCDgroup1 = "";
    let BCDgroup2 = "";
    num = document.getElementById("num").value
    exp = document.getElementById("exp").value;
    let sign;
    if (isNaN(num) || isNaN(exp)) {
        if (num[0] == '-') {
            sign = "1";
        } else {
            sign = "0";
        }
        combiField = "11111"
        expBin = "000000"
        BCDgroup1 = "0000000000"
        BCDgroup2 = "0000000000"
        answer = sign + combiField + expBin + BCDgroup1 + BCDgroup2;
        console.log(answer)
        toGUI(answer, "Invalid Input");
        return;
    }
    num = num.toString();
    exp = parseInt(exp);
    let expPrime = exp + BIAS;
    sign = checkSign();
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
    if (expPrime > EMAX) {
        combiField = "11110"
        expBin = "000000"
        BCDgroup1 = "0000000000"
        BCDgroup2 = "0000000000"
    } else if (expPrime < EMIN) {
        combiField = "01000"
        expBin = "100101"
        BCDgroup1 = "0000000000"
        BCDgroup2 = "0000000000"
    } else {
        expBin = decToBin(expPrime);
        if (expBin.length != 8) {
            let temp = expBin;
            expBin = ""
            for (let i = 0; i < 8 - temp.length; i++) {
                expBin += "0";
            }
            expBin += temp;
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
            firstDigit += temp;
        }
        if (firstDigit[0] == '1') {
            combiField = "11" + expBin.substring(0, 2) + firstDigit.substring(3, 4);
            expBin = expBin.substring(2);
        } else {
            combiField = expBin.substring(0, 2) + firstDigit.substring(1, 4);
            expBin = expBin.substring(2);
        }
        BCDgroup1 = DPBCD(newnum.slice(1, 4));
        BCDgroup2 = DPBCD(newnum.slice(4, 7));
    }
    answer = sign + combiField + expBin + BCDgroup1 + BCDgroup2
    console.log(answer)
    toGUI(answer, num);
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

function DPBCD(numericalString) {
    const numerical = numericalString.split('').map(digit => parseInt(digit).toString(2).padStart(4, "0")).join('');
    const encoded = TableLookUp[numerical[0] + numerical[4] + numerical[8]];

    let Result = "";

    for (const char of encoded)
        Result += (char !== "0" && char !== "1") ? numerical[TableMap[char]] : char;

    return Result;
}


function toGUI(answer, roundedValue) {
    for (let i = 0; i < 32; i++) {
        let th = document.getElementById(i);
        th.textContent = answer[i];
    }
    let round = document.getElementById("round");
    round.value = roundedValue;
    let hexValue = "";
    for (let i = 0; i < 32; i += 4) {
        hexValue += parseInt(answer.slice(i, i + 4), 2).toString(16).toUpperCase();
    }
    let hex = document.getElementById("hex");
    hex.value = hexValue;
}