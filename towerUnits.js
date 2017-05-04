//defense towers
// base tower 
var towers=[];

function Tower(x,y) {
  this.x = x;
  this.y = y;
}

var TOWER_RANGE_MEDIUM = rectWidth*5;
var TOWER_RANGE_LONG = TOWER_RANGE_MEDIUM * 1.4; //looking to double area, not radius or range
var TOWER_RANGE_SHORT = TOWER_RANGE_MEDIUM * 0.7; //0.7 rather than 0.5 because looking at area

var TOWER_RATE_MEDIUM = FPS; //smaller means more bullets per second
var TOWER_RATE_HIGH = TOWER_RATE_MEDIUM / 2;

var TOWER_DAMAGE_MEDIUM = Enemy.prototype.maxLife/6;
var TOWER_DAMAGE_HIGH = TOWER_DAMAGE_MEDIUM * 1.5;

Tower.prototype.r = rectWidth; //radius
Tower.prototype.rateOfFire = TOWER_RATE_MEDIUM;
Tower.prototype.range = TOWER_RANGE_MEDIUM;
Tower.prototype.hurt = TOWER_DAMAGE_MEDIUM;
Tower.prototype.color = 'green';
Tower.prototype.image = document.getElementById('tower1img');
Tower.prototype.cost = 50;

Tower.prototype.findTarget = function() {
  //if no enemies, no target
  if(enemies.length === 0) {
    this.target = null;
    return;
  }
  //if target dead, remove target reference
  if(this.target && this.target.life <= 0) {
    this.target = null;
  }
  //find first enemy withing range and select that as tower's target
  for (var i = 0, j = enemies.length; i < j; i ++) {
    var dist = (enemies[i].x-this.x)*(enemies[i].x-this.x+rectWidth)+(enemies[i].y-this.y)*(enemies[i].y-this.y+rectWidth); //rectWidth included to look at center of rectangle, not top left corner
    if (dist < (this.range*this.range)) { //sqaure of range. avoice Math.sqrt which is expensive
      this.target = enemies[i];
      return; //only need a single target
    }
  }
  // no target in range
  this.target = null;
};

Tower.prototype.findUnitVector = function() {
  if (!this.target) return false; //if there is no target, dont bother calculating unit vector
  var xDist = this.target.x-this.x;
  var yDist = this.target.y-this.y;
  var dist = Math.sqrt(xDist*xDist+yDist*yDist); 
  this.angle = Math.atan2(yDist, xDist) + Math.PI/2;
  this.xFire = this.x+this.r*xDist/dist; //where turret ends and bullets start
  this.yFire = this.y+this.r*yDist/dist;
};

Tower.prototype.draw= function() {
  var img = this.constructor.prototype.image;
  if (img) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(img, -img.width/2, -img.height/2);
    context.restore();
  } else {
    //draw outer circle
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x,this.y,this.r,0,2*Math.PI);
    context.fill();
    context.stroke();
    //draw turret
    context.beginPath();
    context.moveTo(this.x,this.y);
    context.lineTo(this.xFire,this.yFire);
    context.lineWidth = 3;
    context.stroke();
    context.lineWidth = 1;
  }

};

Tower.prototype.fire = function() {
  this.rateOfFire--;
  if(this.target && this.rateOfFire <=0) {
    bullets.push(new Bullet(this.xFire,this.yFire,this.target,this.hurt));
    //reset this objects rateOfFire to the prototypes
    this.rateOfFire = this.constructor.prototype.rateOfFire;
  }
};

Tower.prototype.getRangeString = function() {
    switch (this.range) {
        case TOWER_RANGE_SHORT:
            return 'short';

        case TOWER_RANGE_MEDIUM:
            return 'med';

        case TOWER_RANGE_LONG:
            return 'long';

        default:
            return '??';
    }
};

Tower.prototype.getDamageString = function() {
    switch (this.hurt) {
        case TOWER_DAMAGE_MEDIUM:
            return 'med';

        case TOWER_DAMAGE_HIGH:
            return 'high';

        default:
            return '??';
    }
};


Tower.prototype.getRateString = function() {
    switch (this.rateOfFire) {
        case TOWER_RATE_MEDIUM:
            return 'med';

        case TOWER_RATE_HIGH:
            return 'high';

        default:
            return '??';
    }
};

//other types of towers
//long range tower:

var Tower2 = function(x,y) {
  Tower.call(this,x,y);
};
Tower2.prototype = Object.create(Tower.prototype);
Tower2.prototype.constructor = Tower2;

Tower2.prototype.range = TOWER_RANGE_LONG;
Tower2.prototype.color = 'brown';
Tower2.prototype.image = document.getElementById('tower2img');
Tower2.prototype.cost = Tower.prototype.cost * 1.5;
Tower2.prototype.rateOfFire = TOWER_RATE_HIGH;

//short range high damage tower
var Tower3 = function(x,y) {
  Tower.call(this,x,y);
};
Tower3.prototype = Object.create(Tower.prototype);
Tower3.prototype.constructor = Tower3;

Tower3.prototype.range = TOWER_RANGE_SHORT;
Tower3.prototype.hurt = TOWER_DAMAGE_HIGH;
Tower3.prototype.image = document.getElementById('tower3img');
Tower3.prototype.color = 'aqua';
Tower3.prototype.cost = Tower.prototype.cost * 1.5;


//populate array of towers
//this is used to figure out which 
//class of tower to add when mouse is clicked
var towerClasses = [Tower,Tower2,Tower3];

document.getElementById('tower1range').textContent = Tower.prototype.getRangeString();
document.getElementById('tower1damage').textContent = Tower.prototype.getDamageString();
document.getElementById('tower1rate').textContent = Tower.prototype.getRateString();
document.getElementById('tower1cost').textContent = Tower.prototype.cost;

document.getElementById('tower2range').textContent = Tower2.prototype.getRangeString();
document.getElementById('tower2damage').textContent = Tower2.prototype.getDamageString();
document.getElementById('tower2rate').textContent = Tower2.prototype.getRateString();
document.getElementById('tower2cost').textContent = Tower2.prototype.cost;

document.getElementById('tower3range').textContent = Tower3.prototype.getRangeString();
document.getElementById('tower3damage').textContent = Tower3.prototype.getDamageString();
document.getElementById('tower3rate').textContent = Tower3.prototype.getRateString();
document.getElementById('tower3cost').textContent = Tower3.prototype.cost;
