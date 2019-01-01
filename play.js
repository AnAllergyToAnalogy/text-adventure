var fs = require('fs');
var parse = require('csv-parse');

var C = require("./console.colour");

const readline = require('readline');




const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


clear_screen();


// console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows)

var csvData=[];
fs.createReadStream("choices.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // console.log(csvrow);
        //do something with csvrow
        if(csvrow[0] !== 'Situation ID'){
            csvData.push(csvrow);
        }
    })
    .on('end',function() {
        //do something wiht csvData
        read_data(csvData);
    });

function read_data(data){
    data.forEach( (row) => {
        if(typeof Tree[row[0]] !== 'undefined'){
            C.colour("@red@ Choice.csv error: @clear@ there is more than one Situation with ID '",row[1],"'");
        }

        Tree[row[0]] = Situation(row);
    });
    check_tree();

}

let Tree = {};

function Situation(row){
    let situation = {
        label: row[1],
    };
    if(row[2] !== ''){
        situation.a = Choice(row[2],row[3]);
    };
    if(row[4] !== ''){
        situation.b = Choice(row[4],row[5]);
    };
    if(row[2] === '' && row[4] === ''){
        //End
        situation.end = true;
    }
    return situation;
}
function Choice(label,destination){
    //Trim spaces from either end

    for(let i = 0; i <= label.length; i++){
        if( label[i] !== " "){
            label = label.substr(i);
            break;
        }else if(i == label.length){
            C.colour("@red@ Choice.csv error: a choice contains only spaces. Clear it completely or add some text.");
        }
    }
    for(i = label.length - 1; i >= 0; i--){
        if( label[i] !== " "){
            label = label.substr(0,i+1);
            break;
        }
    }
    return {
        label: label,
        destination: destination
    }
}


function check_situation(situation){
    if(typeof situation.a !== "undefined" && typeof Tree[situation.a.destination] === "undefined"){
        C.colour("@red@ Choice.csv error: unknown SituationID: @clear@ "+situation.a.destination+" for "+situation.a.label);
        process.exit();
    }
    if(typeof situation.b !== "undefined" && typeof Tree[situation.b.destination] === "undefined"){
        C.colour("@red@ Choice.csv error: unknown SituationID: @clear@ "+situation.b.destination+" for "+situation.b.label);
        process.exit();
    }
}
function check_tree(){
    for(let id in Tree){
        check_situation(Tree[id]);
    }

    if(typeof Tree.start === "undefined"){
        C.colour("@red@ Choice.csv error: @clear@ No situation with ID 'start' found.");
        process.exit();
    }

    Show_title();
}


let title = [
    '################################################################################',
    '################################################################################',
    '###                                                                          ###',
    '###                                                                          ###',
    '###          Welcome to the Text Adventure game!                             ###',
    '###                                                                          ###',
    '###             All events and choices are defined in choices.csv            ###',
    '###                                                                          ###',
    '###                      << Press Enter to Begin! >>                         ###',
    '###                                                                          ###',
    '###                                                                          ###',
    '################################################################################',
    '################################################################################',

];
let titleInterval, titleIterator = 0;
let text_width = title[0].length;//80;

function Show_title(){

    clear_screen();

    let window_width = process.stdout.columns;
    let padding = '';
    for(let i = 0; i < Math.round((window_width - text_width)/2); i++){
        padding += ' ';
    }

    titleInterval = setInterval(function(){
        console.log(padding+title[titleIterator]);
        titleIterator++;
        if(titleIterator >= title.length){
            clearInterval(titleInterval);
            //TODO: go to await user input
            rl.question('', (answer) => {
                rl.close();
                Start();
            });
        }
    },50);
}


function Start(){
    // console.log('Start game');
    Do_Situation('start');
}

function Do_Situation(id){

    // clear_screen();
    let window_width = process.stdout.columns;
    let padding_width = Math.max(0,Math.round((window_width - text_width)/2));

    let situation = Tree[id];

    setTimeout(()=>{
        clear_screen();
        console.log('');
        console.log('');
        console.log('');
        log_broken_centered('--------------------------------------------------------------------------------',80,padding_width);
        console.log('');
        log_broken_centered(situation.label,80,padding_width);
        console.log('');
        log_broken_centered('--------------------------------------------------------------------------------',80,padding_width);
        console.log('');
        console.log('');

        setTimeout(() => {
            if(typeof situation.a !== "undefined"){
                log_broken_centered(situation.a.label,80,padding_width);
            }
            console.log('');
            if(typeof situation.b !== "undefined"){
                log_broken_centered(situation.b.label,80,padding_width);
            }
            if(situation.end){
                //If it has no options, go to death screen (?)
                log_broken_centered(Tree.end.label,80);
                Prompt_End();
            }else{
                Prompt_Situation(situation);
            }
        },1000);


    },500);
}

function log_broken_padded(text,maxWidth,paddingWidth){
    let padding = '';
    paddingWidth = Math.max(paddingWidth,0);
    for(let p = 0; p < paddingWidth; p++){
        padding += ' ';
    }

    const text_split = text.split(" ");
    let lineToLog = '';
    for(let i = 0; i < text_split.length; i++){
        if(text_split[i].length === maxWidth) {
            console.log(padding + text_split[i]);
        }else if(text_split[i].length > maxWidth){
            let remaining_string = text_split[i];
            while(remaining_string.length > maxWidth){
                console.log(padding + remaining_string.substr(0,maxWidth));
                remaining_string = remaining_string.substr(maxWidth);
            }
            lineToLog = remaining_string;

        }else if(lineToLog.length + 1 + text_split[i].length > maxWidth) {
            console.log(padding + lineToLog);
            lineToLog = '';
        }else if(lineToLog.length === 0){
            lineToLog = text_split[i];
        }else if(lineToLog.length + 1 + text_split[i].length <= maxWidth){
            lineToLog += ' '+text_split[i];
        }
    }
    if(lineToLog.length > 0){
        console.log(padding+lineToLog);
    }
}
function log_broken_centered(text,maxWidth){

    let window_width = process.stdout.columns;
    let paddingWidth = Math.round((window_width - maxWidth)/2);
    let padding = '';
    paddingWidth = Math.max(paddingWidth,0);
    for(let p = 0; p < paddingWidth; p++){
        padding += ' ';
    }

    const text_split = text.split(" ");
    let lineToLog = '';
    for(let i = 0; i < text_split.length; i++){
        if(text_split[i].length === maxWidth) {
            console.log(padding + text_split[i]);
        }else if(text_split[i].length > maxWidth){
            let remaining_string = text_split[i];
            while(remaining_string.length > maxWidth){
                console.log(padding + remaining_string.substr(0,maxWidth));
                remaining_string = remaining_string.substr(maxWidth);
            }
            lineToLog = remaining_string;

        }else if(lineToLog.length + 1 + text_split[i].length > maxWidth) {
            const extraPadding = get_extraPadding(maxWidth,lineToLog.length);

            console.log(extraPadding + padding + lineToLog);

            lineToLog = text_split[i];
        }else if(lineToLog.length === 0){
            lineToLog = text_split[i];
        }else if(lineToLog.length + 1 + text_split[i].length <= maxWidth){
            lineToLog += ' '+text_split[i];
        }else{
            const extraPadding = get_extraPadding(maxWidth,lineToLog.length);
            console.log(extraPadding+padding+text_split[i]);
        }
    }
    if(lineToLog.length > 0){
        const extraPadding = get_extraPadding(maxWidth,lineToLog.length);
        console.log(extraPadding+padding+lineToLog);
    }
}

function get_extraPadding(targetWidth,currentWidth){
    let padding = '';
    for(let i = 0; i < (targetWidth - currentWidth)/2; i++){
        padding += ' ';
    }
    return padding;
}

function clear_screen(){
    console.log('\033[2J'); //Clear the screen
    console.log(" ");
}

function Prompt_Situation(situation){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    let window_width = process.stdout.columns;
    let padding = '';
    for(let i = 0; i < Math.round((window_width - text_width)/2); i++){
        padding += ' ';
    }

    console.log('');
    console.log('');

    rl.question(padding, (answer) => {
        rl.close();
        //Parse the answer
        if(answer.toLowerCase() === situation.a.label.toLowerCase()){
            //GO to A
            Do_Situation(situation.a.destination);
        }else if(typeof situation.b !== 'undefined' &&
            answer.toLowerCase() === situation.b.label.toLowerCase()
        ){
            //GO to B
            Do_Situation(situation.b.destination);
        }else{
            C.colour("@red@ Not a valid response... try again");
            Prompt_Situation(situation);
        }
    });
}

function Prompt_End(){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    console.log("");
    log_broken_centered(" Press enter to exit... ",80);

    rl.question('', (answer) => {
        clear_screen();
        console.log(" Game created by AnAllergyToAnalogy ");
        rl.close();
    });

}
