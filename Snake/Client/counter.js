class Counter
{
    // custom class for creating a timer that calls a function at regular
    // intervals until it reaches a set time, when it calls a final function.

    // e.g. a countdown timer, where a countdown is called every second
    // and then a final function is called when the timer is up
    constructor(timeout, interval, callback, final)
    {
        this.count = floor(timeout / interval);
        this.timeout = timeout;
        this.interval = interval;
        this.callback = callback;
        this.final = final;
        this.state = 0;
    }

    intervalFunction()
    {
        console.log("count: " + this.count);
        console.log("state: " + this.state);
        if (this.count > 0 && this.state)
        {
            console.log(this.count);
            this.callback();
            this.count --;
            window.setTimeout(this.intervalFunction.bind(this), this.interval);
        }
    }

    start()
    {
        if (this.state === 0)
        {
            this.state = 1;
            this.timer = window.setTimeout(() => {
                this.state = 0;
                this.final();
                this.stop();
            }, this.timeout);
            this.countdown = window.setTimeout(this.intervalFunction.bind(this), this.interval);
        }
    }

    stop()
    {
        
        if (this.state === 1)
        {
            this.state = 0;
            
            clearInterval(this.countdown);
            clearTimeout(this.timer);
        }
        this.count = floor(this.timeout / this.interval);
    }

    restart()
    {
        this.stop();
        this.start();
    }
}