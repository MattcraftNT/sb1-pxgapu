export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.speed = 5;
    this.color = '#ff0000';
    this.health = 3;
    this.maxHealth = 6;
    this.damage = 1;
    this.invulnerable = false;
    this.invulnerableTime = 1000; // milliseconds
  }

  draw(ctx) {
    // Flash effect when invulnerable
    if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
      ctx.globalAlpha = 0.5;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw face
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x - 5, this.y - 5, 3, 0, Math.PI * 2);
    ctx.arc(this.x + 5, this.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y + 5, 5, 0, Math.PI);
    ctx.stroke();

    // Draw health
    for (let i = 0; i < this.maxHealth; i++) {
      ctx.fillStyle = i < this.health ? '#ff0000' : '#666';
      ctx.fillRect(10 + i * 25, 10, 20, 20);
    }

    ctx.globalAlpha = 1;
  }

  takeDamage() {
    if (!this.invulnerable) {
      this.health--;
      this.invulnerable = true;
      setTimeout(() => {
        this.invulnerable = false;
      }, this.invulnerableTime);
    }
  }
}