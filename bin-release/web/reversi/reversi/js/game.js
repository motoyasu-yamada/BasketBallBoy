
var BOARD_SIZE = 8;
var EMPTY = 'empty';
var WHITE = 'white';
var BLACK = 'black';
var CANPUT = 'CANPUT';
var board = {};
var turn_number = 0;
var your_turn = true;
var stone = BLACK;
var lastUpdated = new Date().getTime();

let data = {
    'v': 1,
    'board': {},
    'turn_number': 0,
    'black': 0,
    'white': 0,
    'lastUpdated': 0,
    'black_name':'',
    'white_name':'',
    'finished':false,
    'pass':0
  }

function InitialBoard() {
    console.log("initialize");

    for (var x = 0; x < BOARD_SIZE; x++){
        for (var y = 0; y < BOARD_SIZE; y++){
            board[[x, y]] = EMPTY;
        }
    }
    var x2 = x >> 1;
    var y2 = y >> 1;
    board[[x2 - 1, y2 - 1]] = WHITE;
    board[[x2 - 1, y2 - 0]] = BLACK;
    board[[x2 - 0, y2 - 1]] = BLACK;
    board[[x2 - 0, y2 - 0]] = WHITE;
    return board;
}

function drawGameBoard(board) {
    var cell = [];
    console.log("drawBoard");
    cell.push('<table>');
    for (var y = -1; y < BOARD_SIZE; y++) {
        cell.push('<tr>');
        for (var x = -1; x < BOARD_SIZE; x++) {
            if (0 <= y && 0 <= x) {
                cell.push('<td class="');
                cell.push('cell');
                cell.push(' ');
                cell.push(board[[x, y]]);
                cell.push('"');
                cell.push(' p_y="');
                cell.push(y);
                cell.push('"');
                cell.push(' p_x="');
                cell.push(x);
                cell.push('">');
                cell.push('<span class="disc"></span>');
                cell.push('</td>');
            }
        }
        cell.push('</tr>');
    }
    cell.push('</table>');
    board_html = cell.join('');
    // console.log(cell.join(''));
    document.getElementById("game_board").innerHTML = board_html;

    if(data.black_name){
        const bn = document.getElementById("name_black");
        bn.innerText = data.black_name;

        const bnr = document.getElementById("name_black_result");
        bnr.innerText = data.black_name;
    }
    if(data.white_name){
        const wn = document.getElementById("name_white");
        wn.innerText = data.white_name;

        const wnr = document.getElementById("name_white_result");
        wnr.innerText = data.white_name;
    }
    const cn = document.getElementById("current_player");
    if(data.turn_number %2==1){
        cn.innerText = data.white_name;
    }else{
        cn.innerText = data.black_name;
    }

    addClickEvent();
}


function putStone(p_x, p_y) {
    console.log("turnnumber:" + data.turn_number + " mystone:" + stone);
    if(!isMyTurn()){
        return;
    }
    if (canPutStone(p_x, p_y, stone)) { 
        console.log("putStone -> x->" + p_x + " y->" + p_y + " stone->"+ stone);
        turnOver(p_x, p_y, stone);
        data.turn_number++;
        data.pass = 0;
        drawGameBoard(board);
        saveMatch();
    }else{
        console.log("cannot put stone -> x->" + p_x + " y->" + p_y + " stone->"+ stone);
    }
}

function outOfBoard(nx, ny){
    if(nx < 0 || ny < 0 || nx >= BOARD_SIZE || ny >= BOARD_SIZE){
        return true;
    }
    return false;
}

function isGameOver(){
    if(data.pass > 1){
        return true;
    }
    const counts = countStone();
    console.log(counts);
    if(counts.empty==0){
        return true;
    }
    return false;
}

function countStone(){
    let black = 0;
    let white = 0;
    let empty = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const s = board[[x,y]];
            if(s==BLACK){
                black++;
            }else if (s==WHITE){
                white++;
            }else {
                empty++;
            }
        }
    }
    return {black,white,empty};
}

function isMyTurn(){
    if(stone == BLACK && data.turn_number %2==0){
        return true;
    }else if (stone == WHITE && data.turn_number %2==1) {
        return true;
    }else{
        return false;
    }
}

function nextPlaces(){
    const places = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if(canPutStone(x, y, stone)){
                places.push([x,y]);
            }
        }
    }
    console.log(places);
    return places;
}

function canPutStone(x, y, stone){
    const c = board[[x, y]];
    if(c != EMPTY){
        return false;
    }
    let okCell=0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = x+dx;
            const ny = y+dy;
            if(outOfBoard(nx, ny)){
                continue;
            }
            const nc = board[[nx, ny]];
            if(nc != EMPTY && nc != stone){
                const places = turnOverPlace(x, y, dx, dy, stone);
                if(places.length > 0){
                    okCell++;
                }
            }
        }
    }
    console.log("canPutStone:" + okCell);
    return okCell > 0;
}

function turnOverPlace(x, y, dx, dy, stone){
    let nx = x;
    let ny = y;
    let count = 0;
    let makeTurnOver = false;
    const ps = [];
    while(count < 8){
        nx = nx+dx;
        ny = ny+dy;
        if(outOfBoard(nx, ny)){
            break;
        }
        const c = board[[nx, ny]];
        if(c == EMPTY){
            break;
        }
        if(c == stone){
            makeTurnOver = true;
            break;
        }
        count++;
        ps.push([[nx, ny]]);
    }
    if(!makeTurnOver){
        return [];
    }
    console.log("turnOverAndCount:" + x + "-" + y + " c:" + ps.length);
    return ps;
}

function turnOver(x, y, stone){
    if(!canPutStone(x, y, stone)){
        console.log("cannot put stone!");
        return;
    }

    board[[x, y]]=stone;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if(dx == 0 && dy == 0){
                continue;
            }
            turnOverPlace(x, y, dx, dy, stone).forEach(p => {
                board[p] = stone;
            });
        }
    }
}



function addClickEvent() { 
    var cells = document.getElementsByClassName("cell");
    for (var $i = 0; $i < cells.length; $i++) {
        cells[$i].onclick = function () {
            console.log("onclick");
            p_y = parseInt(this.getAttribute('p_y'));
            p_x = parseInt(this.getAttribute('p_x'));
            if(canPutStone(p_x, p_y, stone)){
                console.log("position y:" + p_y + " x:" + p_x);
                putStone(p_x, p_y);
            }
        }
    }
}

const boot = () => {
    console.log("boot");
    FBInstant.initializeAsync()
    .then(function () {
      FBInstant.startGameAsync().then(function () {
        var contextId = FBInstant.context.getID();
        console.log("contextId: " + contextId);
        FBInstant.getCurrentContextDataAsync()
        .then(function (result) {
            console.log("frm server");
            if(result == null || result.lastUpdated == 0){
                FBInstant.capture("body").then(function (result) { 

                    const payload = {
                        intent:"SHARE",
                        text:"Reversiやろう！"
                    };
                
                    payload.image = result;
                    FBInstant.shareAsync(payload).then(()=>{
                        console.log("start as black");
                        data.black = FBInstant.player.getID();
                        data.black_name = FBInstant.player.getName();
                        data.white = 0;
                        stone = BLACK;
                        drawGameBoard(InitialBoard());
                        saveMatch(()=>{
                            game();
                        });
                    }); 
                });

            }else{
                console.log(result);
                data = result;
                board = data.board;
                drawGameBoard(board);
                if(data.white == 0){
                    console.log("start as white");
                    data.white =  FBInstant.player.getID();
                    data.white_name = FBInstant.player.getName();
                    stone = WHITE;
                    saveMatch(()=>{
                        game();
                    });
                }else{
                    if(data.black == FBInstant.player.getID()){
                        console.log("resolve as black");
                        stone = BLACK;
                        data.black_name = FBInstant.player.getName();
                    }else{
                        console.log("resolve as white");
                        stone = WHITE;
                        data.white_name = FBInstant.player.getName();
                    }
                    game();
                }
            }
        });
      });
    });
};

const saveMatch = (func) => {
    data.board = board;
    lastUpdated = new Date().getTime();
    data.lastUpdated = lastUpdated;
    console.log("save");
    console.log(data);
    FBInstant.updateAsync({data, text:"" + FBInstant.player.getName() + "が" + (data.turn_number+1) + "手目を打ちました", image:""}).then(func);
}

function game(result) {
    var contextId = FBInstant.context.getID();
    drawGameBoard(data.board);
    reloadTimer = setInterval(manageTurn, 1500);
}

function manageTurn (){
    FBInstant.getCurrentContextDataAsync()
    .then(function (result) {
      if(result==null){
        return;
      }
      if (result.lastUpdated !== lastUpdated) {
        console.log("updated!");
        console.log(result);
        data = result;
        board = result.board;
        console.log(board);
        drawGameBoard(board);
        if(isGameOver()){
            clearInterval();
            showGameOver();
        }
        if(isMyTurn() && nextPlaces().length == 0){
            data.turn_number++;
            data.pass++;
            saveMatch(()=>{
                console.log("pass");
            });
            return;
        }
      }
    }) 
}

function showGameOver(){

    const counts = countStone();

    const white_count = document.getElementById("white_count");
    white_count.innerText = counts.white;

    const black_count = document.getElementById("black_count");
    black_count.innerText = counts.black;

    const winner = document.getElementById("winner");
    if(counts.black > counts.white){
        winner.innerText = data.black_name;
    }else{
        winner.innerText = data.white_name;
    }

    const popup = document.getElementById("result_screen");
    popup.style.display = "block";
    
}

function live(){
    const payload = {
        intent:"SHARE",
        text:"Reversiなう！"
    };

    FBInstant.capture("body").then(function (result) { 
        payload.image = result;
        FBInstant.shareWatchAsync(payload);
    })
}

function share(){
    const payload = {
        intent:"SHARE",
        text:"Reversiなう！"
    };

    FBInstant.capture("body").then(function (result) { 
        payload.image = result;
        FBInstant.shareAsync(payload);
    })
}

function close(){
    FBInstant.context.createAsync().then(()=>{
        location.href = "./index.html";
    });
}