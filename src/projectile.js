export class Projectile {
  constructor(x, y, dirX, dirY) {
    this.x = x;
    this.y = y;
    const speed = 7;
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    this.velocityX = (dirX / length) * speed;
    this.velocityY = (dirY / length) * speed;
    this.size = 8;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  isOffscreen(width, height) {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}