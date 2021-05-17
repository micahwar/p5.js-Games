class Snake {
    constructor(x, y) {
        this.length = 1;
        this.segs = [createVector(x, y)];
        this.speed = createVector(0, -1);
        this.colors = [color(255), color(200, 200, 200)]
        this.state = 1;
        this.offset = 0;
        // moveLocked locks the movement of the snake to 1 single direction change per
        // snake.update call, which eliminates some less desirable behaviour.
        this.moveLocked = false;
    }

    update() {
        this.moveLocked = false;
        if (this.segs.length > 1) {
            this.segs.pop();
            this.segs.unshift(p5.Vector.add(this.segs[0], this.speed));
        } else {
            this.segs[0].add(this.speed);
        }


        if (this.segs[0].x == fruit.x && this.segs[0].y == fruit.y) {
            this.eat();
        } else if (this.segs[0].x > GRID_WIDTH - 1
                || this.segs[0].x < 0
                || this.segs[0].y > GRID_HEIGHT - 1
                || this.segs[0].y < 0)
        {
            // if the snake goes outside the bounds, gameover
            this.segs[0].sub(this.speed);
            gameOver();
        } else {
            // if the snake collides with itself, gameover
            for (let i = 1; i < this.segs.length; i++)
            {
                if (this.segs[0].equals(this.segs[i]))
                {
                    gameOver();
                }
            }
        }
    }

    face(direction)
    {
        // checks to make sure you aren't trying to go in the opposite direction
        // i.e. into your own body
        if (!p5.Vector.add(this.speed, direction).equals(createVector(0, 0)))
        {
            this.moveLocked = true;
            this.speed = direction;
        }
    }

    eat() {
        // works out the position difference between the last two segments
        // in the snake
        let d;
        if (this.segs.length > 1) {
            d = p5.Vector.sub(this.segs[this.segs.length - 2], this.segs[this.segs.length - 1]);
        } else {
            d = this.speed.copy();
        }
        let n = p5.Vector.sub(this.segs[this.segs.length - 1], d);
        this.segs.push(n);
        fruit.init();
        score.total += score.current;
        score.reset();
        
    }

    show() {
        fill(this.colors[this.state]);
        stroke(51);
        strokeWeight(2);
        for (let i = 0; i < this.segs.length; i++) {
            rect(this.segs[i].x * GRID_SIZE, this.segs[i].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }
}