let gridSize = 20;


let expressionInput = [];
let smoothnessInput;

function setup() {
    createCanvas(600, 600);
    background(255);
    drawGrid();
    for (var i = 1; i < 10; i++){
        let selectText = "#function" + i.toString();
        expressionInput[i-1] = select(selectText);
        expressionInput[i-1].changed(updateFunction);
    }
    smoothnessInput = select('#smoothness');
    smoothnessInput.changed(updateSmoothness);
    
}

function draw() {
    for (var i = 0; i < expressionInput.length; i++){
        let values = [];
        let simpEx = math.simplify(expressionInput[i].value());
        values = evaluateFunction(simpEx, values);
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
}

function updateFunction() {
    let val = expressionInput.value();
    console.log(val.toString());
}

function updateSmoothness() {
    let val = smoothnessInput.value();
    
    console.log(val.toString());
    background(255);
    drawGrid();
}

function evaluateFunction(expression) {
    let arr = [];
     
    for(let i = 0; i < (width * smoothnessInput.value() / gridSize) + 1; i++) {
        arr[i] = expression.eval({x: (i - (width * smoothnessInput.value() / gridSize / 2))/smoothnessInput.value()});
    }
    return arr;
}

function drawFunction(arr) {
    translate(0, 0);
    strokeWeight(4);
    stroke(255, 0, 0);
    translate(0, height/2)
    for (let x = 0; x < arr.length-1; x++) {
        line(x * gridSize / (smoothnessInput.value()), -gridSize *  arr[x] , (x+1) * gridSize / (smoothnessInput.value()), -gridSize * arr[x+1] );
    }
}