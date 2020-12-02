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
        this.maze = [];
    }

    createGrid = (width, height) => {
        this.height = height;
        this.width = width;
        for (let i = 0; i < height; i++) {
            let column = document.createElement("div");
            let columnList = [];
            column.classList.add('column');
            for (let j = 0; j < width; j++) {
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
        this.maze[this.width - 1][this.height - 1].bottom = false;
        this.maze[this.width - 1][this.height - 1].cell.classList.toggle("bottom");
        this.maze[x][y].cell.classList.toggle("visited");
        const genStep = (x, y) => {
            setTimeout(() => {
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
                    genStep(nextNeighbour.x, nextNeighbour.y);
                } else {
                    path.pop();
                    if (!path.length) return;
                    genStep(path[path.length - 1].x, path[path.length - 1].y);
                }
            }, speed);
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

let maze = new Maze(document.querySelector(".maze"));
