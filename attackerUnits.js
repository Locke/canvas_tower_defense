var enemies = [];
var addedLife = 0; //incremented in checkForDead()

function Enemy(progress) {
  this.progress = progress;
  this.life = this.maxLife + addedLife;
}

//common to all Emeny objects
Enemy.prototype.maxLife = 40;
Enemy.prototype.speed = baseSpeed;
Enemy.prototype.color = 'red';

Enemy.prototype.draw = function() {
  context.beginPath();
  context.fillStyle = this.color;
  context.fillRect(this.x,this.y,rectWidth,rectWidth);
  //life bar
  context.fillStyle='orange';
  context.fillRect(this.x,this.y+rectWidth/3,rectWidth*this.life/(this.maxLife+addedLife),rectWidth/3);
};

Enemy.prototype.progressTable = [
  rightBorder,
  firstBorder - rectWidth,
  rightBorder - leftBorder,
  secondBorder - firstBorder,
  rightBorder - leftBorder,
  thirdBorder - secondBorder,
  rightBorder
];

Enemy.prototype.setPosition = function() {
  var p = 0, i = 0;
  for (var j = this.progressTable.length; i < j; i++ ) {
    if (this.progress < this.progressTable[i] + p) {
      break;
    }
    p += this.progressTable[i];
  }

  var p2 = this.progress - p;

  switch(i) {
    case 0:
      this.x = p2;
      this.y = 0 + rectWidth;
      break;
    case 1:
      this.x = rightBorder;
      this.y = p2 + rectWidth;
      break;
    case 2:
      this.x = rightBorder - p2;
      this.y = firstBorder;
      break;
    case 3:
      this.x = leftBorder;
      this.y = firstBorder + p2;
      break;
    case 4:
      this.x = leftBorder + p2;
      this.y = secondBorder;
      break;
    case 5:
      this.x = rightBorder;
      this.y = secondBorder + p2;
      break;
    case 6:
      this.x = rightBorder - p2;
      this.y = thirdBorder;
      break;
    case 7:
    default:
      //returns true so enemy can be removed in another function
      return true;
  }
  return false;
}

Enemy.prototype.move = function(t) {
  this.progress += this.speed*t;
  return this.setPosition();
};
 
function checkForDead() {
  for (var i = 0, j = enemies.length; i < j; i++ ) {
    if (enemies[i].life <=0) {
      addedLife = Math.floor(stopped/10) * (1 + Math.floor(stopped/100)); //used to make enemies tougher as the number of stopped enemies goes up
      document.getElementById('stopped').innerHTML = ++stopped;
      money += moneyIncrement;
      document.getElementById('money').innerHTML = money;
      enemies.splice(i,1);
      i--;
      j--; 
    }
  }
}

var addEnemy = function() {
   var enemy;
   if(stopped > 20) { 
     var pick = Math.floor(Math.random()*enemyTypes.length); 
     //select random enemy type
     enemy = new enemyTypes[pick](0);
   } else {
     enemy = new Enemy(0);
   }
  enemies.push(enemy);
}

//faster enemy
var FastEnemy = function(progress) {
  Enemy.call(this,progress);
};
FastEnemy.prototype = Object.create(Enemy.prototype);
FastEnemy.prototype.constructor = FastEnemy;

FastEnemy.prototype.speed = Enemy.prototype.speed*1.4;
FastEnemy.prototype.color = 'DarkRed';

//stronger enemy
var StrongEnemy = function(progress) {
  Enemy.call(this,progress);
};
StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

StrongEnemy.prototype.color = 'FireBrick';
StrongEnemy.prototype.maxLife = Enemy.prototype.maxLife*2;


//list of enemy types
var enemyTypes = [Enemy,FastEnemy,StrongEnemy];
