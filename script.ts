// Define the shape interface and shape objects
interface Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'circle' | 'rectangle';
    isSelected: boolean;
    draw(ctx: CanvasRenderingContext2D): void;
    isHit(x: number, y: number): boolean;
}

class Circle implements Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'circle' = 'circle';
    isSelected: boolean = false;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.width = radius * 2;
        this.height = radius * 2;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.isSelected ? 'blue' : 'green';
        ctx.fill();
        ctx.stroke();
    }

    isHit(x: number, y: number): boolean {
        const dx = x - (this.x + this.width / 2);
        const dy = y - (this.y + this.height / 2);
        return Math.sqrt(dx * dx + dy * dy) <= this.width / 2;
    }
}

class Rectangle implements Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'rectangle' = 'rectangle';
    isSelected: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.isSelected ? 'blue' : 'red';
        ctx.fill();
        ctx.stroke();
    }

    isHit(x: number, y: number): boolean {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
}

// Get canvas and context
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Define shapes
const shapes: Shape[] = [
    new Circle(100, 100, 50),
    new Rectangle(300, 200, 150, 100)
];

// Variables to track drag status
let dragging: boolean = false;
let offsetX: number = 0;
let offsetY: number = 0;

// Draw the shapes on the canvas
function drawShapes(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
    shapes.forEach(shape => shape.draw(ctx));         // Draw each shape
}

// Mouse down event to check if a shape is clicked
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    for (let shape of shapes) {
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
canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const selectedShape = shapes.find(shape => shape.isSelected);
    if (dragging) {
        if (selectedShape) {
            selectedShape.x = mouseX - offsetX;
            selectedShape.y = mouseY - offsetY;
            drawShapes();
        }
    } else {
        // Check if the mouse is over any shape
        const isOverShape = shapes.some(shape => shape.isHit(mouseX, mouseY));
        // Change cursor based on shape hover
        canvas.style.cursor = isOverShape ? 'move' : 'default';
    }
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
    dragging = false;
    shapes.forEach(shape => shape.isSelected = false);  // Deselect shapes
});

// Initial draw
drawShapes();
