export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.type = type;
    this.collected = false;
    
    switch(type) {
      case 'health':
        this.color = '#ff69b4';
        this.effect = (player) => { player.health = Math.min(player.health + 1, player.maxHealth); };
        break;
      case 'speed':
        this.color = '#00ff00';
        this.effect = (player) => { player.speed += 1; };
        break;
      case 'damage':
        this.color = '#ff0000';
        this.effect = (player) => { player.damage += 1; };
        break;
    }
  }

  draw(ctx) {
    if (this.collected) return;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw sparkle effect
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(this.x - 15, this.y);
    ctx.lineTo(this.x + 15, this.y);
    ctx.moveTo(this.x, this.y - 15);
    ctx.lineTo(this.x, this.y + 15);
    ctx.stroke();
  }

  checkCollision(player) {
    if (this.collected) return false;
    
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + player.size / 2);
  }
}