export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Animation properties
        this.animations = [];
        this.particles = [];
        
        // Character positions
        this.player1Position = { x: 150, y: 200 };
        this.player2Position = { x: 650, y: 200 };
        
        // Background elements
        this.backgroundElements = this.generateBackground();
        
        this.setupCanvas();
    }

    setupCanvas() {
        // Set up high DPI canvas
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.width = rect.width;
        this.height = rect.height;
    }

    generateBackground() {
        const elements = [];
        
        // Generate floating particles
        for (let i = 0; i < 20; i++) {
            elements.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
            });
        }
        
        return elements;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBackground() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(0.5, '#34495e');
        gradient.addColorStop(1, '#2c3e50');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw floating background elements
        this.backgroundElements.forEach(element => {
            this.ctx.save();
            this.ctx.globalAlpha = element.opacity;
            this.ctx.fillStyle = element.color;
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Animate elements
            element.y -= element.speed;
            if (element.y < -10) {
                element.y = this.height + 10;
                element.x = Math.random() * this.width;
            }
        });
        
        // Draw arena floor
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, this.height - 50, this.width, 50);
        
        // Draw center line
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawCharacter(player, position, isActive = false) {
        const character = player.getCharacter();
        if (!character) return;

        const { x, y } = position;
        const size = 80;
        
        this.ctx.save();
        
        // Draw character glow if active
        if (isActive) {
            this.ctx.shadowColor = character.color;
            this.ctx.shadowBlur = 20;
        }
        
        // Draw character background circle
        this.ctx.fillStyle = character.color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
        
        // Draw character icon
        this.ctx.font = `${size * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(character.icon, x, y);
        
        // Draw character border
        this.ctx.strokeStyle = isActive ? '#ffffff' : character.color;
        this.ctx.lineWidth = isActive ? 4 : 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw defending indicator
        if (character.isDefending) {
            this.ctx.strokeStyle = '#00d4ff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size / 2 + 10, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Draw HP bar above character
        this.drawHealthBar(x, y - size / 2 - 30, character);
        
        // Draw character name
        this.ctx.font = '16px Orbitron';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, x, y + size / 2 + 20);
        
        this.ctx.restore();
    }

    drawHealthBar(x, y, character) {
        const barWidth = 100;
        const barHeight = 8;
        const hpPercentage = character.getHPPercentage() / 100;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
        
        // HP fill
        const hpColor = hpPercentage > 0.6 ? '#4ecdc4' : hpPercentage > 0.3 ? '#f39c12' : '#e74c3c';
        this.ctx.fillStyle = hpColor;
        this.ctx.fillRect(x - barWidth / 2, y, barWidth * hpPercentage, barHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - barWidth / 2, y, barWidth, barHeight);
        
        // HP text
        this.ctx.font = '12px Orbitron';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${character.currentHP}/${character.maxHP}`, x, y - 5);
    }

    // Animation methods
    animateAttack(fromPos, toPos, callback) {
        const animation = {
            type: 'attack',
            startTime: Date.now(),
            duration: 500,
            fromPos: { ...fromPos },
            toPos: { ...toPos },
            callback: callback
        };
        
        this.animations.push(animation);
        this.createImpactParticles(toPos);
    }

    animateSpecial(pos, type, callback) {
        const animation = {
            type: 'special',
            specialType: type,
            startTime: Date.now(),
            duration: 800,
            pos: { ...pos },
            callback: callback
        };
        
        this.animations.push(animation);
        this.createSpecialParticles(pos, type);
    }

    animateHeal(pos, callback) {
        const animation = {
            type: 'heal',
            startTime: Date.now(),
            duration: 600,
            pos: { ...pos },
            callback: callback
        };
        
        this.animations.push(animation);
        this.createHealParticles(pos);
    }

    createImpactParticles(pos) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: pos.x + (Math.random() - 0.5) * 20,
                y: pos.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: 0.02,
                size: Math.random() * 4 + 2,
                color: '#ff6b6b'
            });
        }
    }

    createSpecialParticles(pos, type) {
        const colors = {
            berserkerStrike: '#ff6b6b',
            fireball: '#e67e22',
            multiShot: '#00d4ff'
        };
        
        const color = colors[type] || '#ffffff';
        
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: pos.x + (Math.random() - 0.5) * 40,
                y: pos.y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: 0.015,
                size: Math.random() * 6 + 3,
                color: color
            });
        }
    }

    createHealParticles(pos) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: pos.x + (Math.random() - 0.5) * 30,
                y: pos.y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 6 - 2,
                life: 1,
                decay: 0.01,
                size: Math.random() * 5 + 2,
                color: '#4ecdc4'
            });
        }
    }

    updateAnimations() {
        const currentTime = Date.now();
        
        // Update animations
        this.animations = this.animations.filter(animation => {
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            if (progress >= 1) {
                if (animation.callback) animation.callback();
                return false;
            }
            
            return true;
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vy += 0.2; // gravity
            
            return particle.life > 0;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    render(gameState) {
        this.clear();
        this.drawBackground();
        
        if (gameState.player1Status.hasCharacter) {
            this.drawCharacter(
                { getCharacter: () => gameState.player1Status.character, name: gameState.player1Status.name },
                this.player1Position,
                gameState.currentPlayer && gameState.currentPlayer.id === gameState.player1Status.id
            );
        }
        
        if (gameState.player2Status.hasCharacter) {
            this.drawCharacter(
                { getCharacter: () => gameState.player2Status.character, name: gameState.player2Status.name },
                this.player2Position,
                gameState.currentPlayer && gameState.currentPlayer.id === gameState.player2Status.id
            );
        }
        
        this.updateAnimations();
        this.drawParticles();
    }

    // Get character positions for animations
    getPlayer1Position() {
        return this.player1Position;
    }

    getPlayer2Position() {
        return this.player2Position;
    }
}
