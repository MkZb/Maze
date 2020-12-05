class Cell {
    constructor(x, y, el) {
        this.x = x;
        this.y = y;
        this.right = true;
        this.left = true;
        this.top = true;
        this.bottom = true;
        this.visited = false;
        this.cell = document.createElement("div");
        this.cell.classList.add("cell", "top", "bottom", "left", "right");
        el.appendChild(this.cell);
    }
}

class Maze {
    constructor(el) {
        this.el = el;
        el.style.whiteSpace = "nowrap";
    }

    createGrid = (width, height) => {
        this.maze = []
        this.height = height;
        this.width = width;
        for (let i = 0; i < width; i++) {
            let column = document.createElement("div");
            let columnList = [];
            column.classList.add("column");
            for (let j = 0; j < height; j++) {
                columnList.push(new Cell(i, j, column));
            }
            this.maze.push(columnList);
            this.el.appendChild(column);
        }
    }

    generateMaze = (x = 0, y = 0, speed = 100) => {
        let path = []
        this.maze[x][y].visited = true;
        this.maze[0][0].top = false;
        this.maze[0][0].cell.classList.toggle("top");
        this.maze[0][0].cell.classList.toggle("no-top");
        this.maze[this.width - 1][this.height - 1].bottom = false;
        this.maze[this.width - 1][this.height - 1].cell.classList.toggle("bottom");
        this.maze[this.width - 1][this.height - 1].cell.classList.toggle("no-bottom");
        this.maze[x][y].cell.classList.toggle("visited");
        const genStep = (x, y) => {
            let unvisitedNeighbours = this.getUnvisitedNeighbours(x, y);
            if (unvisitedNeighbours.length) {
                let nextNeighbour = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)]
                nextNeighbour.visited = true;
                nextNeighbour.cell.classList.toggle("visited");
                if (nextNeighbour.x > x) {
                    this.maze[x][y].right = false;
                    nextNeighbour.left = false;
                    this.maze[x][y].cell.classList.toggle("right");
                    this.maze[x][y].cell.classList.toggle("no-right");
                    nextNeighbour.cell.classList.toggle("left");
                    nextNeighbour.cell.classList.toggle("no-left");
                }
                if (nextNeighbour.x < x) {
                    this.maze[x][y].left = false;
                    nextNeighbour.right = false;
                    this.maze[x][y].cell.classList.toggle("left");
                    this.maze[x][y].cell.classList.toggle("no-left");
                    nextNeighbour.cell.classList.toggle("right");
                    nextNeighbour.cell.classList.toggle("no-right");
                }
                if (nextNeighbour.y > y) {
                    this.maze[x][y].bottom = false;
                    nextNeighbour.top = false;
                    this.maze[x][y].cell.classList.toggle("bottom");
                    this.maze[x][y].cell.classList.toggle("no-bottom");
                    nextNeighbour.cell.classList.toggle("top");
                    nextNeighbour.cell.classList.toggle("no-top");
                }
                if (nextNeighbour.y < y) {
                    this.maze[x][y].top = false;
                    nextNeighbour.bottom = false;
                    this.maze[x][y].cell.classList.toggle("top");
                    this.maze[x][y].cell.classList.toggle("no-top");
                    nextNeighbour.cell.classList.toggle("bottom");
                    nextNeighbour.cell.classList.toggle("no-bottom");
                }
                path.push(nextNeighbour);
                if (speed) setTimeout(() => genStep(nextNeighbour.x, nextNeighbour.y), speed)
                else genStep(nextNeighbour.x, nextNeighbour.y);
            } else {
                path.pop();
                if (!path.length) return;
                if (speed) setTimeout(() => genStep(path[path.length - 1].x, path[path.length - 1].y));
                else genStep(path[path.length - 1].x, path[path.length - 1].y);
            }
        }
        genStep(x, y);
    }

    getNeighbours = (x, y) => {
        let neighbours = [];
        if (x !== 0) neighbours.push(this.maze[x - 1][y]);
        if (x !== this.width - 1) neighbours.push(this.maze[x + 1][y]);
        if (y !== 0) neighbours.push(this.maze[x][y - 1]);
        if (y !== this.height - 1) neighbours.push(this.maze[x][y + 1]);
        return neighbours;
    }

    getUnvisitedNeighbours = (x, y) => {
        return this.getNeighbours(x, y).filter((el) => (el.visited === false));
    }

}

class Pathfinder {
    constructor(maze) {
        this.maze = maze
    }

    rightWallFind = (startX = 0, startY = 0, endX = this.maze.width - 1, endY = this.maze.height - 1, speed = 10) => {
        let currentX = startX;
        let currentY = startY;
        let direction = 1;
        let facing, lW, rW;
        this.maze.maze[startX][startY].cell.classList.remove("visited");
        this.maze.maze[startX][startY].cell.classList.add("start");
        this.maze.maze[endX][endY].cell.classList.remove("visited");
        this.maze.maze[endX][endY].cell.classList.add("finish");

        const rotateLeft = () => {
            direction = direction === 1 ? 4 : direction - 1;
        }

        const rotateRight = () => {
            direction = direction === 4 ? 1 : direction + 1;
        }

        const moveForward = (facing) => {
            if (facing === 'top') {
                this.maze.maze[currentX][currentY].cell.classList.remove("current-pathfinder");
                currentY -= 1;
                this.maze.maze[currentX][currentY].cell.classList.add("visited-pathfinder");
                this.maze.maze[currentX][currentY].cell.classList.add("current-pathfinder");
            }
            if (facing === 'bottom') {
                this.maze.maze[currentX][currentY].cell.classList.remove("current-pathfinder");
                currentY += 1;
                this.maze.maze[currentX][currentY].cell.classList.add("visited-pathfinder");
                this.maze.maze[currentX][currentY].cell.classList.add("current-pathfinder");
            }
            if (facing === 'left') {
                this.maze.maze[currentX][currentY].cell.classList.remove("current-pathfinder");
                currentX -= 1;
                this.maze.maze[currentX][currentY].cell.classList.add("visited-pathfinder");
                this.maze.maze[currentX][currentY].cell.classList.add("current-pathfinder");
            }
            if (facing === 'right') {
                this.maze.maze[currentX][currentY].cell.classList.remove("current-pathfinder");
                currentX += 1;
                this.maze.maze[currentX][currentY].cell.classList.add("visited-pathfinder");
                this.maze.maze[currentX][currentY].cell.classList.add("current-pathfinder");
            }
        }

        const step = () => {
            if ((currentX === endX) && (currentY === endY)) return;
            switch (direction) {
                case 1:
                    facing = 'bottom';
                    lW = 'right';
                    rW = 'left';
                    break;
                case 2:
                    facing = 'left';
                    lW = 'bottom';
                    rW = 'top';
                    break;
                case 3:
                    facing = 'top';
                    lW = 'left';
                    rW = 'right';
                    break;
                case 4:
                    facing = 'right';
                    lW = 'top';
                    rW = 'bottom';
                    break;
            }
            if (!this.maze.maze[currentX][currentY][rW]) {
                rotateRight();
                moveForward(rW);
            } else {
                if (!this.maze.maze[currentX][currentY][facing]) {
                    moveForward(facing);
                } else rotateLeft();
            }
        }

        setInterval(() => (step()), speed);
    }
}

let maze = new Maze(document.querySelector(".maze"));
let createBtn = document.querySelector("#createGrid");
let genBtn = document.querySelector("#genMaze");
let findPathBtn = document.querySelector("#findPath");

createBtn.addEventListener("click", () => {
    maze.el.innerHTML = '';
    let x = document.querySelector("#width").value;
    let y = document.querySelector("#height").value;
    maze.createGrid(x, y);
})

genBtn.addEventListener("click", () => {
    if (!maze.el.innerHTML.length) maze.createGrid(20, 20);
    maze.generateMaze(0, 0, 1);
})

findPathBtn.addEventListener("click", () => {
    leftPath.rightWallFind();
})

let leftPath = new Pathfinder(maze);

/* TEMPORARY JUNK
* solveASharp = (startX = 0, startY = 0, endX = this.maze.width - 1, endY = this.maze.height - 1) => {
        this.openList = [];
        this.closedList = [];

        const calcH = (x, y) => {
            return Math.abs(x - endX) + Math.abs(y - endY);
        }

        const calcF = (x, y) => {
            return calcH(x, y) + this.openList.length;
        }

        const calculateNode = (x, y) => {
            let node = [];
            node.push();
            node.push(calcF(x, y));
            return node;
        }

        const getNeighbours = (x, y) => {
            let neighbours = [];
            if (x !== 0) {
                if (!this.maze.maze[x][y].left) neighbours.push(this.maze.maze[x - 1][y]);
            }
            if (x !== this.maze.width - 1) {
                if (!this.maze.maze[x][y].right) neighbours.push(this.maze.maze[x + 1][y]);
            }
            if (y !== 0) {
                if (!this.maze.maze[x][y].top) neighbours.push(this.maze.maze[x][y - 1]);
            }
            if (y !== this.maze.height - 1) {
                if (!this.maze.maze[x][y].bottom) neighbours.push(this.maze.maze[x][y + 1]);
            }
            return neighbours;
        }

        this.openList.push([this.maze.maze[startX][startY], 0]);

        while (this.openList.length) {
            this.openList.sort((a, b) => (a[1] - b[1]));
            let q = this.openList.pop();
            let successors = getNeighbours(q[0].x, q[0].y);
            for (let successor of successors) {
                if (successor.x === endX && successor.y === endY) {
                    break;
                }
                let successorF = calcF(successor.x, successor.y);
                console.log(`succF: ${successorF}`);
                let elFromOpenList = this.openList.find((el) => ((el.x === successor.x) && (el.y === successor.y)));
                let elFromClosedList = this.closedList.find((el) => ((el.x === successor.x) && (el.y === successor.y)));
                if (elFromOpenList) {
                    if (elFromOpenList[1] < successorF) continue;
                }
                if (elFromClosedList) {
                    if (elFromClosedList[1] >= successorF) this.openList.push(calculateNode(successor.x, successor.y));
                }
            }
            this.closedList.push(q);
            console.log(this.openList);
            console.log(this.closedList);
        }
    }
*  */