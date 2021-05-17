class Fruit
{
    constructor() 
    {
        this.totalGrid = Array(GRID_WIDTH*GRID_HEIGHT).fill(0).map((element, index) => {
            return createVector(index%GRID_WIDTH, floor(index/GRID_WIDTH));
        });
        this.init();
        this.colors = [color(255, 0, 0), color(255, 0, 0, 150)]
        this.state = 1;
    }

    init()
    {
        // uses the initialised array of all grid elements and the locations of
        // all snake body parts to initialise itself in a cell that does not contain
        // any part of the snake
        let tmp = [...this.totalGrid];
        snake.segs.forEach((element) => {
            tmp.splice(tmp.vectorIndexOf(element), 1)
        });
        let pos = tmp[floor(random(tmp.length))];
        this.x = pos.x;
        this.y = pos.y;
    }

    show()
    {
        stroke(51);
        strokeWeight(1);
        fill(this.colors[this.state]);
        rect(this.x*GRID_SIZE, this.y*GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
}