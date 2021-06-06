var bgColor;
var canvas;
var canvasImage;
var rectangleCount;
var rectangles;
var color;
var context;
var draggingDraw;
var draggingMove;
var dragX;
var dragY;
var dragIndexDelete;
var dragIndexMove;
var dragStartLocation;
var mouseX;
var mouseY;
var lenght;
var width;
var targetX;
var targetY;
var tempX;
var tempY;
var dx;
var dy;
var flagRandom = false;

window.addEventListener('load', init, false);

window.onload = window.onresize = function() {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    drawrectangles();
}


function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    context.lineWidth = 4;
    context.lineCap = 'square';

    rectangleCount = 0;
    draggingDraw = false;
    bgColor = "#000000";
    rectangles = [];

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);

    canvas.addEventListener('dblclick', deleterectangle, false);
}


function dragStart(event) {
    draggingDraw = true;
    dragStartLocation = getCanvasCoordinates(event);
    color = "rgb(" + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ")";
    getImage();
    console.log("Drag start");
}

function drag(event) {
    var position;
    if (draggingDraw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        drawrectangle(position);
        context.fillStyle = color;
        context.fill();
        // console.log("Dragging");
    }
}

function dragStop(event) {
    draggingDraw = false;
    putImage();
    var position = getCanvasCoordinates(event);
    drawrectangle(position);
    context.fillStyle = color;
    context.fill();
    rectangleCount = rectangleCount + 1;
    temprectangle = { x: tempX, y: tempY, len: lenght, wid: width, color: color };

    rectangles.push(temprectangle);
    console.log("Drag stop");

}

function getCanvasCoordinates(event) {

    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;
    // console.log("Coordinates" + x + " " + y);
    return { x: x, y: y };


}

function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}

function drawrectangle(position) {

    tempX = dragStartLocation.x;
    tempY = dragStartLocation.y;

    lenght = (tempX - position.x);
    width = (tempY - position.y);
    context.beginPath();
    context.rect(tempX, tempY, lenght, width);
    context.closePath();
}

function drawScreen() {
    rectangleCount = 0;
    // rectangleCount--;
    rectangles = [];
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function togglebtn() {

    if (document.getElementById("btnMve").name == "Draw Shape") {

        canvas.removeEventListener("mousedown", mouseDown, false);
        document.getElementById("btnMve").name = "Move Shape";
        document.getElementById("spid").innerHTML = "Click here to move the rectangles";

        canvas.addEventListener('mousedown', dragStart, false);
        canvas.addEventListener('mousemove', drag, false);
        canvas.addEventListener('mouseup', dragStop, false);
    } else if (document.getElementById("btnMve").name == "Move Shape") {

        canvas.removeEventListener("mousedown", dragStart, false);
        canvas.removeEventListener("mousemove", drag, false);
        canvas.removeEventListener("mouseup", dragStop, false);

        document.getElementById("btnMve").name = "Draw Shape";
        document.getElementById("spid").innerHTML = "Click here to draw the rectangles";

        canvas.addEventListener('mousedown', mouseDown, false);
    }
}

function drawrectangles() {
    var i;
    var x;
    var y;
    var len;
    var wid;
    var color;

    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < rectangleCount; i++) {
        len = rectangles[i].len;
        wid = rectangles[i].wid;
        x = rectangles[i].x;
        y = rectangles[i].y;
        color = rectangles[i].color;
        context.beginPath();
        // context.arc(x, y, rad, 0, 2 * Math.PI, false);
        context.rect(x, y, lenght, width);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }
}

function isrectangleClicked(shape, mx, my) {
    var dx;
    var dy;
    dx = mx - shape.x;
    dy = my - shape.y;
    return (dx * dx + dy * dy < shape.len * shape.wid);
}

function deleterectangle(event) {
    var i;
    var bRect = canvas.getBoundingClientRect();
    //		var highestIndex=-1;
    dragIndexDelete = -1;

    mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
    mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);
    //To find that which rectangle has been clicked
    for (i = 0; i < rectangleCount; i++) {
        if (isrectangleClicked(rectangles[i], mouseX, mouseY)) {
            dragIndexDelete = i;
        }
    }
    //Remove the rectangle from the array
    if (dragIndexDelete > -1) {
        rectangles.splice(dragIndexDelete, 1)[0];
        rectangleCount = rectangleCount - 1;
    }

    if (event.preventDefault) {
        event.preventDefault();
    } else if (event.returnValue) {
        event.returnValue = false;
    }
    drawrectangles();
    return false;
}


function mouseDown(event) {
    var i;
    var highestIndex = -1;
    var bRect = canvas.getBoundingClientRect();

    mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
    mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

    for (i = 0; i < rectangleCount; i++) {
        if (isrectangleClicked(rectangles[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - rectangles[i].x;
                dragY = mouseY - rectangles[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the rectangle and then push it to the top of the array
        rectangles.push(rectangles.splice(dragIndexMove, 1)[0]);

    }
    canvas.removeEventListener("mousedown", mouseDown, false);
    window.addEventListener("mouseup", mouseUp, false);

    if (event.preventDefault) {
        event.preventDefault();
    } else if (event.returnValue) {
        event.returnValue = false;
    }
    return false;
}

function mouseUp(event) {

    canvas.addEventListener("mousedown", mouseDown, false);
    window.removeEventListener("mouseup", mouseUp, false);
    if (draggingMove) {
        draggingMove = false;
        window.removeEventListener("mousemove", mouseMove, false);
    }
}

function mouseMove(event) {

    var posX;
    var posY;
    var shapeRad = rectangles[rectangleCount - 1].rad;
    var minX = shapeRad;
    var maxX = canvas.width - shapeRad;
    var minY = shapeRad;
    var maxY = canvas.height - shapeRad;

    var bRect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
    mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

    posX = mouseX - dragX;
    posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
    posY = mouseY - dragY;
    posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

    rectangles[rectangleCount - 1].x = posX;
    rectangles[rectangleCount - 1].y = posY;

    drawrectangles();
}