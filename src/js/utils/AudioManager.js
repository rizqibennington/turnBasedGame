export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isMuted = false;
        this.volume = 0.7;
        this.musicVolume = 0.3;

        // BGM related properties
        this.currentMusic = null;
        this.currentTrackName = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicTracks = {};
        this.isPlaying = false;
        this.musicInterval = null;

        this.initializeAudioContext();
        this.createSounds();
        this.createSimpleBackgroundMusic();
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes for music and SFX
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();

            this.musicGain.gain.value = this.musicVolume;
            this.sfxGain.gain.value = this.volume;

            this.musicGain.connect(this.audioContext.destination);
            this.sfxGain.connect(this.audioContext.destination);

            console.log('🎵 Audio system initialized with BGM support');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    createSounds() {
        // Create procedural sound effects using Web Audio API
        this.sounds = {
            attack: () => this.createAttackSound(),
            special: () => this.createSpecialSound(),
            defend: () => this.createDefendSound(),
            heal: () => this.createHealSound(),
            victory: () => this.createVictorySound(),
            damage: () => this.createDamageSound(),
            critical: () => this.createCriticalSound()
        };
    }

    createSimpleBackgroundMusic() {
        // Create simple background music system
        this.musicTracks = {
            menu: { frequency: 440, type: 'sine', tempo: 'slow' },
            battle: { frequency: 220, type: 'sawtooth', tempo: 'fast' },
            victory: { frequency: 523, type: 'triangle', tempo: 'medium' }
        };
    }

    // Simple continuous background music
    startSimpleMusic(trackName) {
        if (!this.audioContext || !this.musicGain || this.isMuted) return;

        this.stopSimpleMusic();

        const track = this.musicTracks[trackName];
        if (!track) return;

        this.currentTrackName = trackName;
        this.isPlaying = true;

        const playNote = () => {
            if (!this.isPlaying || this.isMuted) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.musicGain);

            oscillator.type = track.type;
            oscillator.frequency.setValueAtTime(track.frequency, this.audioContext.currentTime);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.musicVolume, this.audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.8);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 1);
        };

        // Play notes at intervals based on tempo
        const intervals = {
            slow: 2000,
            medium: 1500,
            fast: 1000
        };

        playNote(); // Play first note immediately
        this.musicInterval = setInterval(playNote, intervals[track.tempo] || 1500);

        console.log(`🎵 Playing simple BGM: ${trackName}`);
    }

    stopSimpleMusic() {
        this.isPlaying = false;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        console.log('⏹️ Simple music stopped');
    }

    createAttackSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    createSpecialSound() {
        if (!this.audioContext) return;

        // Create a more complex sound for special attacks
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator1.type = 'sine';
        oscillator2.type = 'square';

        oscillator1.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);

        oscillator2.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.3);
        oscillator2.stop(this.audioContext.currentTime + 0.3);
    }

    createDefendSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(300, this.audioContext.currentTime + 0.15);

        gainNode.gain.setValueAtTime(this.volume * 0.25, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    createHealSound() {
        if (!this.audioContext) return;

        // Create a soothing heal sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5

        gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    createVictorySound() {
        if (!this.audioContext) return;

        // Create a victory fanfare
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        let time = this.audioContext.currentTime;

        notes.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, time);

            gainNode.gain.setValueAtTime(this.volume * 0.4, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

            oscillator.start(time);
            oscillator.stop(time + 0.3);

            time += 0.15;
        });
    }

    createDamageSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(this.volume * 0.35, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    createCriticalSound() {
        if (!this.audioContext) return;

        // Create an intense critical hit sound
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator1.type = 'sawtooth';
        oscillator2.type = 'square';

        oscillator1.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15);

        oscillator2.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.15);

        gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.15);
        oscillator2.stop(this.audioContext.currentTime + 0.15);
    }

    playSound(soundName) {
        if (this.isMuted || !this.audioContext) return;

        // Resume audio context if it's suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (this.sounds[soundName]) {
            try {
                this.sounds[soundName]();
            } catch (error) {
                console.warn('Error playing sound:', error);
            }
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    mute() {
        this.isMuted = true;
    }

    unmute() {
        this.isMuted = false;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            // Stop current background music when muted
            this.stopSimpleMusic();
            console.log('🔇 Audio muted');
        } else {
            // Restart music when unmuted if there was a track playing
            if (this.currentTrackName) {
                setTimeout(() => {
                    this.startSimpleMusic(this.currentTrackName);
                }, 100);
            }
            console.log('🔊 Audio unmuted');
        }

        return this.isMuted;
    }

    // Play sounds for specific game events
    playAttackSound() {
        this.playSound('attack');
    }

    playSpecialSound() {
        this.playSound('special');
    }

    playDefendSound() {
        this.playSound('defend');
    }

    playHealSound() {
        this.playSound('heal');
    }

    playVictorySound() {
        this.playSound('victory');
    }

    playDamageSound() {
        this.playSound('damage');
    }

    playCriticalSound() {
        this.playSound('critical');
    }

    // Background Music Methods
    playBackgroundMusic(trackName) {
        this.startSimpleMusic(trackName);
    }

    stopBackgroundMusic() {
        this.stopSimpleMusic();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }

    setSFXVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.volume;
        }
    }

    // Get current mute state
    isMutedState() {
        return this.isMuted;
    }

    // Convenience methods for specific screens
    playMenuMusic() {
        this.playBackgroundMusic('menu');
    }

    playBattleMusic() {
        this.playBackgroundMusic('battle');
    }

    playVictoryMusic() {
        this.playBackgroundMusic('victory');
    }
}
