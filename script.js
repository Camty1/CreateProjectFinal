// Grid Setup
let gridSizes = [5 ,10, 20, 30, 50, 60, 150, 300];
let gridSize = 30;
let gridIndex = 3;


// Other Setup
let expressionInput = [];
let smoothness = 100;

function setup() {
    createCanvas(600, 600);
    background(255);
    drawGrid();
    for (var i = 1; i < 10; i++){
        let selectText = "#function" + i.toString();
        expressionInput[i-1] = select(selectText);
    }
    
}

// Key Presses and Zoom
function keyPressed() {
    
    // Zoom in
    if (keyCode == 187 || keyCode == 107) {
        
        // Prevent Overflow
        if (gridIndex < gridSizes.length - 1) {
            
            // Go to next index in gridSizes
            gridIndex++;
        }
        
    }
    
    // Zoom out
    if (keyCode == 189 || keyCode == 109) {
        
        // Prevent Overflow
        if (gridIndex > 0) {
            
            // Go to previous index in gridSizes
            gridIndex--;
        }
        
    }
    
}

function draw() {
    gridSize = gridSizes[gridIndex];
    background(255);
    drawGrid();
    for (var i = 0; i < expressionInput.length; i++){
        let values = [];
        let simpEx = expressionInput[i].value();
        values = evaluateFunction(simpEx);
        drawFunction(values);
    }
    
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

function evaluateFunction(expression) {
    let arr = [];
     
    for(let i = 0; i < (width * smoothness / gridSize) + 1; i++) {
        let xValue = (i - (width * smoothness / gridSize / 2))/smoothness;
        try{
            arr[i] = evaluateExpression(expression, xValue);
        }
        catch (err) {
            arr[i] = null;
        }
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
            let buffer = "";
            
            while (j < tokens.length && ((tokens[j] >= '0' && tokens[j] <= '9') || tokens[j] == '.')) {
                buffer = buffer + tokens[j];
                j++;
            }
            values.push(parseFloat(buffer));
        }
        
        if (tokens[j] == 'x' || tokens[j] == 'X') {
            values.push(xValue);
        }
        
        if (tokens[j] == 'e') {
            values.push(math.e);
        }
        
        if (tokens[j] == '(') {
            operators.push(tokens[j]);
        }
        
        if (tokens[j] == ')'){
            while (operators[operators.length - 1] != '('){
                values.push(applyOp(operators.pop(), values.pop(), values.pop()));
            }
            operators.pop();
        }
        
        if (tokens[j] == '+' || tokens[j] == '-' || tokens[j] == '*' || tokens[j] == '/' || tokens[j] == '^') {
            while(operators.length != 0 && hasPrecedence(tokens[j], operators[operators.length - 1]))
                values.push(applyOp(operators.pop(), values.pop(), values.pop()));
            
            operators.push(tokens[j]);
        }
        
    }
    
    while (operators.length != 0)
        values.push(applyOp(operators.pop(), values.pop(), values.pop()));
    
    return values.pop();      
}

function hasPrecedence (op1, op2) {
    if (op2 == '(' || op2 == ')')
        return false;
    else if ((op1 == '^') && (op2 == '*' || op2 == '/' || op2 == '+' || op2 == '-'))
        return false;
    else if ((op1 == '*' || op1 == '/') && (op2 == '+' || op2 == '-'))
        return false;
    else
        return true;
}

function applyOp (op, b, a) {
    switch(op){
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b == 0)
                throw "Cannot divide by 0";
            return a / b;
        case '^':
            return Math.pow(a, b);
    }
    return 0;
}

function drawFunction(arr) {
    translate(0, 0);
    strokeWeight(4);
    stroke(255, 0, 0);
    for (let x = 0; x < arr.length-1; x++) {
        if (arr[x] != null && arr[x + 1] != null){
            line(x * gridSize / (smoothness), -gridSize *  arr[x] , (x+1) * gridSize / (smoothness), -gridSize * arr[x+1] );
        }
    }
}