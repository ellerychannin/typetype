class Ball {
    constructor(xin, yin, din, clr, sound, txt, idin, oin) {
      this.x = xin;
      this.y = yin;
      this.vx = random(-3,3);
      this.vy = random(0,3);
      this.diameter = din;
      this.color = clr;
      this.txt = txt;
      this.id = idin;
      this.others = oin;
      this.sound = sound;
      // this.hoverable = 
    }
  
    collide() {
      for (let i = this.id + 1; i < numBalls; i++) {
        // console.log(others[i]);
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = this.others[i].diameter / 2 + this.diameter / 2;
        //   console.log(distance);
        //console.log(minDist);
        if (distance < minDist) {
          //console.log("2");
          let angle = atan2(dy, dx);
          let targetX = this.x + cos(angle) * minDist;
          let targetY = this.y + sin(angle) * minDist;
          let ax = (targetX - this.others[i].x) * spring;
          let ay = (targetY - this.others[i].y) * spring;
          this.vx -= ax;
          this.vy -= ay;
          this.others[i].vx += ax;
          this.others[i].vy += ay;
        }
      }
    }
  
    move() {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x + this.diameter / 2 > width) {
        this.x = width - this.diameter / 2;
        this.vx *= friction;
      } else if (this.x - this.diameter / 2 < 0) {
        this.x = this.diameter / 2;
        this.vx *= friction;
      }
      if (this.y + this.diameter / 2 > height) {
        this.y = height - this.diameter / 2;
        this.vy *= friction;
      } else if (this.y - this.diameter / 2 < 0) {
        this.y = this.diameter / 2;
        this.vy *= friction;
      }
    }
  
    display() {
      push();
      noStroke();
      fill(this.color, 0, 0);
      ellipse(this.x, this.y, this.diameter, this.diameter);
      pop();
    }
    
    hover() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.diameter/2) {
        console.log(this.txt);
        push();
        textSize(10);
        fill(255);
        text(this.txt, this.x, this.y);
        pop();
        return true;
    } else return false;
    }
  }