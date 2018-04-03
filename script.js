let gridSize = 60;


let expressionInput = [];
let smoothness = 20;
function setup() {
    createCanvas(600, 600);
    background(255);
    drawGrid();
    for (var i = 1; i < 10; i++){
        let selectText = "#function" + i.toString();
        expressionInput[i-1] = select(selectText);
        expressionInput[i-1].changed(updateFunction);
    }
    
}

function draw() {
    
    translate(0, height/2);
    for (var i = 0; i < expressionInput.length; i++){
        let values = [];
        let simpEx = math.simplify(expressionInput[i].value());
        values = evaluateFunction(simpEx);
        drawFunction(values);
    }
    translate(0, -height/2)
}

function drawGrid() {
    resetMatrix();
    stroke(51);
    
    strokeWeight(1);
    for (let x = 1; x < width/gridSize; x++) {
        line(x * gridSize, 0, x * gridSize, height);
    } 
    
    for(let y = 1; y < height/gridSize; y++) {
        line(0, y * gridSize, width, y * gridSize);
    }
    strokeWeight(3);
    line(width/2, 0, width/2, height);
    line(0, height/2, width, height/2);
    translate(0, height/2);
}

function updateFunction() {
    let val = expressionInput.value();
    console.log(val.toString());
}

function evaluateFunction(expression) {
    let arr = [];
     
    for(let i = 0; i < (width * smoothness / gridSize) + 1; i++) {
        arr[i] = expression.eval({x: (i - (width * smoothness / gridSize / 2))/smoothness});
    }
    return arr;
}

function evaluateExpression(expression, xValue) {
    
    let tokens = [];
    
    let values = [];
    
    let operators = [];
    
    for (var i = 0; i < expression.length; i++){
        tokens[i] = expression.charAt(i);
    }
    
    for (var j = 0; j < tokens.length; j++){
        if (tokens[j] == ' '){
            continue;
        }
        
        if (j < tokens.length && ((tokens[j] >= '0' && tokens[j] <= '9') || tokens[j] == '.')){
            let buffer : String;
            
            while (j < tokens.length && ((tokens[j] >= '0' && tokens[j] <= '9') || tokens[j] == '.')) {
                buffer = buffer + tokens[j];
                j++;
            }
            values.push(parseFloat(buffer));
        }
        
        if (tokens[j] == 'x' || tokens[j] == 'X') {
            values.push(xValue);
        }
        
        if (tokens[j] == '(') {
            operators.push(tokens[j]);
        }
        
        if (tokens[j] == ')'){
            while (operators[operators.length - 1] != '('){
                values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
            }
            operators.pop();
        }
        
        if (tokens[j] == '+' || tokens[j] == '-' || tokens[j] == '*' || tokens[j] == '/') {
            
        }
    }
    
}

function drawFunction(arr) {
    translate(0, 0);
    strokeWeight(4);
    stroke(255, 0, 0);
    for (let x = 0; x < arr.length-1; x++) {
        line(x * gridSize / (smoothness), -gridSize *  arr[x] , (x+1) * gridSize / (smoothness), -gridSize * arr[x+1] );
    }
}