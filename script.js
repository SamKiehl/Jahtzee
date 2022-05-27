var r = document.getElementById('r');
var dice = [0, 0, 0, 0, 0];
var total = 0;
var upper = 0;
var points = 0;
var numRolls = 0;

var allMoves = {
    //[name, canUse?, func, func_param]
    Aces: 'count(1)',
    Twos: 'count(2)',
    Threes: 'count(3)',
    Fours: 'count(4)',
    Fives: 'count(5)',
    Sixes: 'count(6)',
    //Bonus if tot^ > 63
    Three_of_a_kind: 'checkAdd(\'Three_of_a_kind\')',//total
    Four_of_a_kind: 'checkAdd(\'Four_of_a_kind\')',//total
    Full_House: 'checkAdd(\'Full_House\')',// TODO ||||||||||||||||||||||||||||||||||||
    Small_Straight: 'checkAdd(\'Small_Straight\')',//30
    Large_Straight: 'checkAdd(\'Large_Straight\')',//40
    Yahtzee: 'checkAdd(\'Yahtzee\')',//50
    Chance: 'count(0)'//total//
};

var possibleMoves = [
    'Aces',
    'Twos',
    'Threes',
    'Fours',
    'Fives',
    'Sixes',
    'Three_of_a_kind',
    'Four_of_a_kind',
    'Full_House',
    'Small_Straight',
    'Large_Straight',
    'Yahtzee',
    'Chance'
]
    
var inds = [0, 1, 2, 3, 4];
rtd(inds);
getPossibleMoves();


function rtd(indices){
    if(numRolls > 2){
        alert('Only 2 rerolls are allowed per turn.')
        return;
    }
    numRolls++;
    console.log(indices)
    for(let i of indices){
        let addition = Math.floor(Math.random() * 6 + 1);
        dice[i] = addition;
    }
    r.innerHTML = 'Rolls:\n<button class=\'but2\' onclick=\'rtd(inds)\'>Reroll</button>';
    for(let i = 0; i< dice.length; i++)
        r.innerHTML += `<div id=\'${i}\' style=\'color: black; background-color: white; border: thick solid black;\'><p>${dice[i]}</p><button class=\'but2\' onclick='keep(${i})'>keep</button></div>`;
    total = dice.reduce((a, b) => a + b, 0);
    document.getElementById('t').innerHTML = `<p>Total: ${total}`;
    document.getElementById('p').innerHTML = `<p>Points: ${points} (Upper: ${upper}/63)</p>`;
    console.log(highestOccurrences());
}

function keep(i){
    inds[i] = -1;
    document.getElementById(i).style = 'color: black; background-color: green; border: thick solid black';
}

function count(num){
    if(num === 0)
        points += total;
    let tot = 0;
    for(let d of dice)
        if(d === num)
            tot += num;
    upper += tot;
    if(upper > 62)
        points += 35;
    points += tot;
}

function checkAdd(move){
    switch(move){
        case 'Three_of_a_kind':
            if(highestOccurrences() > 2)
                points += total;
            return;
        case 'Four_of_a_kind':
            if(highestOccurrences() > 3)
                points += total;
            return;
        case 'Yahtzee':
            if(highestOccurrences() > 4)
                points += 50;
            return;
        case 'Small_Straight':
            vals = [1, 2, 3, 4, 5, 6];
            for(let i = 0; i < 4; i++){
                if(dice.indexOf(vals[i]) != -1 && dice.indexOf(vals[i+1]) != -1 && dice.indexOf(vals[i+2]) != -1){
                points += 30; //sm straight
                return;
                }
            }
            return;
        case 'Large_Straight':
            vals = [1, 2, 3, 4, 5, 6];
            for(let i = 0; i < 3; i++){
                if(dice.indexOf(vals[i]) != -1 && dice.indexOf(vals[i+1]) != -1 && dice.indexOf(vals[i+2]) != -1 && dice.indexOf(vals[i+3]) != -1){
                points += 40; //lg straight
                return;
                }
            }
        case 'Full_House':
            if(highestOccurrences() === 1 && !(dice.indexOf(1) != -1 && dice.indexOf(6) != -1))
                points +=25;
            return;
    } 
}

function getPossibleMoves(){
    let m = document.getElementById('m');
    for(let elem in possibleMoves)
        m.innerHTML += `<div class = \'m\'id=\'${possibleMoves[elem]}\'style=color: black; background-color: yellow; display: inline-block; border-radius: 2%; border: thin solid orange; top: 1%;><p>${possibleMoves[elem]}</p><button class=\'but2\' onclick=rm(\'${possibleMoves[elem]}\')>\t✓</button></div>`;
}

function rm(ele){
    ind = possibleMoves.indexOf(ele);
    x = document.getElementById(ele);
    x.remove();
    window.scrollTo(0, 0);
    eval(allMoves[ele]);
    document.getElementById('p').innerHTML = `<p>\nPoints: ${points}</p>`;
    possibleMoves.splice(ind, 1);
    console.log(ele + '\n' + possibleMoves);
    inds = [0, 1, 2, 3, 4];
    numRolls = 0;
    rtd(inds);
    if(possibleMoves.length === 0)
        document.getElementById('m').innerHTML = '<p>GAME OVER!<\p>'
}

function highestOccurrences(){
    occurrences = [0, 0, 0, 0, 0]
    for(let i = 0; i < dice.length; i++){
        ct = 0;
        for(let j = 0; j < dice.length; j++){
            if(dice[i] === dice[j])
                ct++;
        }
        occurrences[i] = ct;
    }
    return Math.max(...occurrences);
}
