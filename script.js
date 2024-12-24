var Circle = /** @class */ (function () {
    function Circle(x, y, radius) {
        this.type = 'circle';
        this.isSelected = false;
        this.x = x;
        this.y = y;
        this.width = radius * 2;
        this.height = radius * 2;
    }
    Circle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.isSelected ? 'blue' : 'green';
        ctx.fill();
        ctx.stroke();
    };
    Circle.prototype.isHit = function (x, y) {
        var dx = x - (this.x + this.width / 2);
        var dy = y - (this.y + this.height / 2);
        return Math.sqrt(dx * dx + dy * dy) <= this.width / 2;
    };
    return Circle;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        this.type = 'rectangle';
        this.isSelected = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.isSelected ? 'blue' : 'red';
        ctx.fill();
        ctx.stroke();
    };
    Rectangle.prototype.isHit = function (x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    };
    return Rectangle;
}());
// Get canvas and context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// Define shapes
var shapes = [
    new Circle(100, 100, 50),
    new Rectangle(300, 200, 150, 100)
];
// Variables to track drag status
var dragging = false;
var offsetX = 0;
var offsetY = 0;
// Draw the shapes on the canvas
function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    shapes.forEach(function (shape) { return shape.draw(ctx); }); // Draw each shape
}
// Mouse down event to check if a shape is clicked
canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
        var shape = shapes_1[_i];
        if (shape.isHit(mouseX, mouseY)) {
            shape.isSelected = true;
            dragging = true;
            offsetX = mouseX - shape.x;
            offsetY = mouseY - shape.y;
            break;
        }
    }
});
// Mouse move event to move the shape while dragging
canvas.addEventListener('mousemove', function (e) {
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    var selectedShape = shapes.find(function (shape) { return shape.isSelected; });
    if (dragging) {
        if (selectedShape) {
            selectedShape.x = mouseX - offsetX;
            selectedShape.y = mouseY - offsetY;
            drawShapes();
        }
    }
    else {
        // Check if the mouse is over any shape
        var isOverShape = shapes.some(function (shape) { return shape.isHit(mouseX, mouseY); });
        // Change cursor based on shape hover
        canvas.style.cursor = isOverShape ? 'move' : 'default';
    }
});
// Mouse up event to stop dragging
canvas.addEventListener('mouseup', function () {
    dragging = false;
    shapes.forEach(function (shape) { return shape.isSelected = false; }); // Deselect shapes
});
// Initial draw
drawShapes();
