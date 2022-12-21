const upperAmp = 20;
function Message(x, y, idx, sentence, col, textColor, speed, amp) {
    let upper = 0, lower = 0, number = 0, special = 0,thinLower = 0, thinUpper = 0, fatLower=0;
    // let textL = 0;
    for (let i = 0; i < sentence.length; i++)
    {
        if (sentence[i] === 'I') {
          thinUpper++;
        } else if (sentence[i] >= 'A' && sentence[i] <= 'Z'){
            upper++;
        } else if ((sentence[i] === 'l') || (sentence[i] === 'i') || (sentence[i]) === 'j' || (sentence[i] === 'f')) {
            thinLower++;
        } else if (sentence[i] === 'w') {
          fatLower++;
        } else if (sentence[i] >= 'a' && sentence[i] <= 'z') {
            lower++;
        } else if (sentence[i]>= '0' && sentence[i]<= '9') {
            number++;
        } else {
            special++;
        }
    }
  
  // console.log(special);
    this.w = int(map(amp*1000, 0, upperAmp, 0.5, 2.5))*(special*8 + upper*22 + lower*17 + number*16 + thinLower*8 + thinUpper*12 + fatLower*24);
    this.h = int(map(amp*1000, 0, upperAmp, 30, 100));
    this.color = col;
    this.textColor = textColor;
    this.textTransparency = 255;
    this.sentence = sentence;
    this.body = Bodies.rectangle(x, y, this.w, this.h, { label: str(idx), restitution:0.5, friction:0.2});

    World.add(world, this.body);
  let pushVec = Matter.Vector.create(random(-10, 10)*this.w*this.h/200000, -speed*this.h*this.w/120000);
  let posVec = Matter.Vector.create(this.body.position.x, this.body.position.y);
    Matter.Body.applyForce(this.body, posVec, pushVec);
  // Engine.update(engine); 
    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        fill(this.color);
        rectMode(CENTER);
        translate(pos.x, pos.y);
        rotate(angle);
        noStroke();
        rect(0, 0, this.w, this.h, 4);
        pop();
        push();
        let c = color(this.textColor);
        c.setAlpha(this.textTransparency);
        translate(pos.x, pos.y);
        rotate(angle);
        noStroke();
        textSize(20*map(amp*1000, 0, upperAmp, 0.8, 1.2));
        fill(c);
        // textAlign(CENTER, CENTER);
        text(this.sentence, -this.w/map(amp*1000, 0, upperAmp, 3, 5),this.h/map(amp*1000, 0, upperAmp, 6, 12));
        pop();
    }
}
