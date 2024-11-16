export class Room {
  constructor(width, height, type = 'normal') {
    this.width = width;
    this.height = height;
    this.wallThickness = 40;
    this.type = type;
    this.obstacles = this.generateObstacles();
    this.enemies = this.generateEnemies();
    this.powerups = this.generatePowerups();
    this.cleared = false;
    this.background = this.getBackground();
  }

  getBackground() {
    switch(this.type) {
      case 'boss': return '#4a0000';
      case 'treasure': return '#4a4a00';
      case 'challenge': return '#003366';
      default: return '#222';
    }
  }

  generateObstacles() {
    const obstacles = [];
    let count;
    
    switch(this.type) {
      case 'boss': count = 3; break;
      case 'treasure': count = 2; break;
      case 'challenge': count = 8; break;
      default: count = 5;
    }

    for (let i = 0; i < count; i++) {
      obstacles.push({
        x: Math.random() * (this.width - 100) + 50,
        y: Math.random() * (this.height - 100) + 50,
        width: 50,
        height: 50
      });
    }
    return obstacles;
  }

  generateEnemies() {
    const enemies = [];
    let enemyConfigs;
    
    switch(this.type) {
      case 'boss':
        enemyConfigs = [{ type: 'boss', count: 1 }];
        break;
      case 'treasure':
        enemyConfigs = [{ type: 'fast', count: 2 }];
        break;
      case 'challenge':
        enemyConfigs = [
          { type: 'tank', count: 2 },
          { type: 'fast', count: 3 }
        ];
        break;
      default:
        enemyConfigs = [
          { type: 'basic', count: Math.floor(Math.random() * 2) + 2 },
          { type: Math.random() < 0.5 ? 'tank' : 'fast', count: 1 }
        ];
    }

    enemyConfigs.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        enemies.push({
          x: Math.random() * (this.width - 100) + 50,
          y: Math.random() * (this.height - 100) + 50,
          type: config.type
        });
      }
    });

    return enemies;
  }

  generatePowerups() {
    const powerups = [];
    const chance = this.type === 'treasure' ? 1 : 0.3;
    
    if (Math.random() < chance) {
      const types = ['health', 'speed', 'damage'];
      const count = this.type === 'treasure' ? 2 : 1;
      
      for (let i = 0; i < count; i++) {
        powerups.push({
          x: Math.random() * (this.width - 100) + 50,
          y: Math.random() * (this.height - 100) + 50,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
    }
    return powerups;
  }

  draw(ctx) {
    // Draw floor
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw room walls
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, this.width, this.wallThickness); // Top
    ctx.fillRect(0, this.height - this.wallThickness, this.width, this.wallThickness); // Bottom
    ctx.fillRect(0, 0, this.wallThickness, this.height); // Left
    ctx.fillRect(this.width - this.wallThickness, 0, this.wallThickness, this.height); // Right

    // Draw obstacles
    ctx.fillStyle = '#666';
    this.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw door frames
    ctx.fillStyle = this.cleared ? '#8b4513' : '#4a4a4a';
    // Top door
    ctx.fillRect(this.width/2 - 30, 0, 60, this.wallThickness);
    // Bottom door
    ctx.fillRect(this.width/2 - 30, this.height - this.wallThickness, 60, this.wallThickness);
    // Left door
    ctx.fillRect(0, this.height/2 - 30, this.wallThickness, 60);
    // Right door
    ctx.fillRect(this.width - this.wallThickness, this.height/2 - 30, this.wallThickness, 60);
  }
}