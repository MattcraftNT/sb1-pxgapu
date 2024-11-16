import { Player } from './player.js';
import { Room } from './room.js';
import { Projectile } from './projectile.js';
import { Enemy } from './enemy.js';
import { PowerUp } from './powerup.js';
import { Minimap } from './minimap.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const ROOM_TYPES = [
  'normal', 'normal', 'challenge', 'normal',
  'treasure', 'normal', 'challenge', 'normal',
  'treasure', 'normal', 'challenge', 'normal',
  'treasure', 'normal', 'boss'
];

let currentRoomIndex = 0;

const game = {
  player: new Player(canvas.width / 2, canvas.height / 2),
  rooms: ROOM_TYPES.map(type => new Room(canvas.width, canvas.height, type)),
  currentRoom: null,
  projectiles: [],
  enemies: [],
  powerups: [],
  lastShootTime: 0,
  shootCooldown: 500, // Increased cooldown to 500ms
  minimap: new Minimap(ROOM_TYPES.length),
  keys: {
    w: false,
    s: false,
    a: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  }
};

game.currentRoom = game.rooms[currentRoomIndex];
game.enemies = game.currentRoom.enemies.map(e => new Enemy(e.x, e.y, e.type));
game.powerups = game.currentRoom.powerups.map(p => new PowerUp(p.x, p.y, p.type));

window.addEventListener('keydown', (e) => {
  if (game.keys.hasOwnProperty(e.key)) {
    game.keys[e.key] = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (game.keys.hasOwnProperty(e.key)) {
    game.keys[e.key] = false;
  }
});

function shoot() {
  const currentTime = Date.now();
  if (currentTime - game.lastShootTime < game.shootCooldown) return;

  if (game.keys.ArrowUp || game.keys.ArrowDown || game.keys.ArrowLeft || game.keys.ArrowRight) {
    let direction = { x: 0, y: 0 };
    if (game.keys.ArrowUp) direction.y = -1;
    if (game.keys.ArrowDown) direction.y = 1;
    if (game.keys.ArrowLeft) direction.x = -1;
    if (game.keys.ArrowRight) direction.x = 1;
    
    game.projectiles.push(new Projectile(
      game.player.x,
      game.player.y,
      direction.x,
      direction.y
    ));
    
    game.lastShootTime = currentTime;
  }
}

function checkRoomTransition() {
  const doorWidth = 60;
  const halfDoorWidth = doorWidth / 2;
  
  if (game.enemies.length === 0 && !game.currentRoom.cleared) {
    game.currentRoom.cleared = true;
    game.minimap.setRoomCleared(currentRoomIndex);
    
    let newIndex = currentRoomIndex;
    
    // Top door
    if (game.player.y < game.currentRoom.wallThickness && 
        Math.abs(game.player.x - canvas.width/2) < halfDoorWidth) {
      newIndex = currentRoomIndex + 1;
      if (newIndex < game.rooms.length) {
        game.player.y = canvas.height - game.currentRoom.wallThickness - game.player.size;
      }
    }
    // Bottom door
    else if (game.player.y > canvas.height - game.currentRoom.wallThickness && 
             Math.abs(game.player.x - canvas.width/2) < halfDoorWidth) {
      newIndex = currentRoomIndex + 1;
      if (newIndex < game.rooms.length) {
        game.player.y = game.currentRoom.wallThickness + game.player.size;
      }
    }
    // Left door
    else if (game.player.x < game.currentRoom.wallThickness && 
             Math.abs(game.player.y - canvas.height/2) < halfDoorWidth) {
      newIndex = currentRoomIndex + 1;
      if (newIndex < game.rooms.length) {
        game.player.x = canvas.width - game.currentRoom.wallThickness - game.player.size;
      }
    }
    // Right door
    else if (game.player.x > canvas.width - game.currentRoom.wallThickness && 
             Math.abs(game.player.y - canvas.height/2) < halfDoorWidth) {
      newIndex = currentRoomIndex + 1;
      if (newIndex < game.rooms.length) {
        game.player.x = game.currentRoom.wallThickness + game.player.size;
      }
    }

    if (newIndex < game.rooms.length && newIndex !== currentRoomIndex) {
      currentRoomIndex = newIndex;
      game.currentRoom = game.rooms[currentRoomIndex];
      game.enemies = game.currentRoom.enemies.map(e => new Enemy(e.x, e.y, e.type));
      game.powerups = game.currentRoom.powerups.map(p => new PowerUp(p.x, p.y, p.type));
      game.projectiles = [];
      game.minimap.setCurrentRoom(currentRoomIndex);
    }
  }
}

function update() {
  // Update player position
  if (game.keys.w) game.player.y -= game.player.speed;
  if (game.keys.s) game.player.y += game.player.speed;
  if (game.keys.a) game.player.x -= game.player.speed;
  if (game.keys.d) game.player.x += game.player.speed;

  // Keep player in bounds
  game.player.x = Math.max(20, Math.min(canvas.width - 20, game.player.x));
  game.player.y = Math.max(20, Math.min(canvas.height - 20, game.player.y));

  // Update enemies
  game.enemies.forEach(enemy => {
    enemy.update(game.player.x, game.player.y);
    
    // Check collision with player
    const dx = game.player.x - enemy.x;
    const dy = game.player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < (game.player.size / 2 + enemy.size / 2)) {
      game.player.takeDamage();
    }
  });

  // Update projectiles and check collisions
  game.projectiles.forEach((projectile, pIndex) => {
    projectile.update();
    
    // Check collision with enemies
    game.enemies.forEach((enemy, eIndex) => {
      if (enemy.checkCollision(projectile)) {
        enemy.health -= game.player.damage;
        game.projectiles.splice(pIndex, 1);
        
        if (enemy.health <= 0) {
          game.enemies.splice(eIndex, 1);
        }
      }
    });

    if (projectile.isOffscreen(canvas.width, canvas.height)) {
      game.projectiles.splice(pIndex, 1);
    }
  });

  // Check power-up collection
  game.powerups.forEach((powerup, index) => {
    if (!powerup.collected && powerup.checkCollision(game.player)) {
      powerup.effect(game.player);
      powerup.collected = true;
    }
  });

  checkRoomTransition();
  shoot();
}

function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  game.currentRoom.draw(ctx);
  
  game.powerups.forEach(powerup => {
    powerup.draw(ctx);
  });
  
  game.enemies.forEach(enemy => {
    enemy.draw(ctx);
  });
  
  game.projectiles.forEach(projectile => {
    projectile.draw(ctx);
  });
  
  game.player.draw(ctx);
  game.minimap.draw(ctx);
}

function gameLoop() {
  if (game.player.health <= 0) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
    return;
  }

  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();