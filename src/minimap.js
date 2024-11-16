export class Minimap {
  constructor(totalRooms) {
    this.totalRooms = totalRooms;
    this.currentRoom = 0;
    this.clearedRooms = new Set();
    this.size = 150;
    this.roomSize = 10;
    this.padding = 10;
  }

  setCurrentRoom(index) {
    this.currentRoom = index;
  }

  setRoomCleared(index) {
    this.clearedRooms.add(index);
  }

  draw(ctx) {
    // Draw minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(
      ctx.canvas.width - this.size - this.padding,
      this.padding,
      this.size,
      this.size
    );

    // Draw rooms
    for (let i = 0; i < this.totalRooms; i++) {
      const x = ctx.canvas.width - this.size - this.padding + 20 + (i % 5) * (this.roomSize + 5);
      const y = this.padding + 20 + Math.floor(i / 5) * (this.roomSize + 5);

      // Draw room connection line
      if (i > 0) {
        ctx.strokeStyle = '#666';
        ctx.beginPath();
        const prevX = ctx.canvas.width - this.size - this.padding + 20 + ((i - 1) % 5) * (this.roomSize + 5) + this.roomSize/2;
        const prevY = this.padding + 20 + Math.floor((i - 1) / 5) * (this.roomSize + 5) + this.roomSize/2;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x + this.roomSize/2, y + this.roomSize/2);
        ctx.stroke();
      }

      // Draw room
      ctx.fillStyle = this.getRoomColor(i);
      ctx.fillRect(x, y, this.roomSize, this.roomSize);

      // Draw border for current room
      if (i === this.currentRoom) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.roomSize, this.roomSize);
      }
    }
  }

  getRoomColor(index) {
    if (index === this.currentRoom) return '#fff';
    if (this.clearedRooms.has(index)) return '#0f0';
    if (index < this.currentRoom) return '#666';
    return '#333';
  }
}