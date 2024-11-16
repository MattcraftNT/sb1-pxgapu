export class Enemy {
  constructor(x, y, type = 'basic') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = type === 'boss' ? 40 : 25;
    this.health = this.getInitialHealth();
    this.speed = this.getSpeed();
    this.color = this.getColor();
    this.behaviorTimer = 0;
    this.direction = { x: 0, y: 0 };
  }

  getInitialHealth() {
    switch(this.type) {
      case 'boss': return 30; // Increased from 20
      case 'tank': return 10; // Increased from 6
      case 'fast': return 4;  // Increased from 2
      default: return 5;      // Increased from 3
    }
  }

  getSpeed() {
    switch(this.type) {
      case 'boss': return 1.5;
      case 'tank': return 1;
      case 'fast': return 3;
      default: return 2;
    }
  }

  getColor() {
    switch(this.type) {
      case 'boss': return '#FF4500';
      case 'tank': return '#800080';
      case 'fast': return '#00FF00';
      default: return '#8B0000';
    }
  }

  update(playerX, playerY) {
    this.behaviorTimer++;
    
    switch(this.type) {
      case 'boss':
        if (this.behaviorTimer % 180 < 90) {
          this.chasePlayer(playerX, playerY);
        } else {
          this.circlePlayer(playerX, playerY);
        }
        break;
      
      case 'tank':
        this.chasePlayer(playerX, playerY);
        break;
      
      case 'fast':
        if (this.behaviorTimer % 60 === 0) {
          this.direction = this.getRandomDirection();
        }
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
        break;
      
      default:
        this.chasePlayer(playerX, playerY);
    }
  }

  chasePlayer(playerX, playerY) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  circlePlayer(playerX, playerY) {
    const angle = this.behaviorTimer * 0.05;
    const radius = 100;
    this.x = playerX + Math.cos(angle) * radius;
    this.y = playerY + Math.sin(angle) * radius;
  }

  getRandomDirection() {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw health bar
    const healthBarWidth = this.size;
    const healthBarHeight = 4;
    const healthPercentage = this.health / this.getInitialHealth();
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x - healthBarWidth/2, this.y - this.size/2 - 10, healthBarWidth * healthPercentage, healthBarHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(this.x - healthBarWidth/2, this.y - this.size/2 - 10, healthBarWidth, healthBarHeight);

    // Draw enemy details based on type
    ctx.fillStyle = '#000';
    switch(this.type) {
      case 'boss':
        // Crown
        ctx.beginPath();
        ctx.moveTo(this.x - 15, this.y - 10);
        ctx.lineTo(this.x + 15, this.y - 10);
        ctx.lineTo(this.x + 10, this.y - 15);
        ctx.lineTo(this.x, this.y - 10);
        ctx.lineTo(this.x - 10, this.y - 15);
        ctx.fill();
        break;
      
      case 'tank':
        // Armor plates
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      
      case 'fast':
        // Speed lines
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x - 15, this.y - 15);
        ctx.lineTo(this.x - 10, this.y - 10);
        ctx.moveTo(this.x + 15, this.y - 15);
        ctx.lineTo(this.x + 10, this.y - 10);
        ctx.stroke();
        break;
    }

    // Draw eyes for all enemies
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x - 5, this.y - 5, 2, 0, Math.PI * 2);
    ctx.arc(this.x + 5, this.y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  checkCollision(projectile) {
    const dx = this.x - projectile.x;
    const dy = this.y - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + projectile.size / 2);
  }
}