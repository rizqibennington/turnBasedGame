export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isMuted = false;
        this.volume = 0.7;
        this.musicVolume = 0.4;

        // BGM related properties
        this.currentMusic = null;
        this.currentTrackName = null; // Track what music should be playing
        this.musicGain = null;
        this.sfxGain = null;
        this.musicTracks = {};

        this.initializeAudioContext();
        this.createSounds();
        this.createBackgroundMusic();
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

    createBackgroundMusic() {
        // Create different background music tracks
        this.musicTracks = {
            menu: () => this.createMenuMusic(),
            battle: () => this.createBattleMusic(),
            victory: () => this.createVictoryMusic()
        };
    }

    createMenuMusic() {
        if (!this.audioContext || !this.musicGain) return null;

        // Create a peaceful menu theme
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.musicGain);

        // Peaceful chord progression: C - Am - F - G
        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';

        // Main melody
        oscillator1.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
        oscillator1.frequency.setValueAtTime(440, this.audioContext.currentTime + 2); // A4
        oscillator1.frequency.setValueAtTime(349, this.audioContext.currentTime + 4); // F4
        oscillator1.frequency.setValueAtTime(392, this.audioContext.currentTime + 6); // G4

        // Harmony
        oscillator2.frequency.setValueAtTime(261, this.audioContext.currentTime); // C4
        oscillator2.frequency.setValueAtTime(220, this.audioContext.currentTime + 2); // A3
        oscillator2.frequency.setValueAtTime(174, this.audioContext.currentTime + 4); // F3
        oscillator2.frequency.setValueAtTime(196, this.audioContext.currentTime + 6); // G3

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

        return { oscillator1, oscillator2, gainNode, duration: 8 };
    }

    createBattleMusic() {
        if (!this.audioContext || !this.musicGain) return null;

        // Create an intense battle theme
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const oscillator3 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        oscillator3.connect(gainNode);
        gainNode.connect(this.musicGain);

        // Intense minor progression: Am - F - C - G
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'square';
        oscillator3.type = 'triangle';

        // Lead melody (higher octave)
        oscillator1.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
        oscillator1.frequency.setValueAtTime(698, this.audioContext.currentTime + 1.5); // F5
        oscillator1.frequency.setValueAtTime(1047, this.audioContext.currentTime + 3); // C6
        oscillator1.frequency.setValueAtTime(784, this.audioContext.currentTime + 4.5); // G5

        // Bass line
        oscillator2.frequency.setValueAtTime(110, this.audioContext.currentTime); // A2
        oscillator2.frequency.setValueAtTime(87, this.audioContext.currentTime + 1.5); // F2
        oscillator2.frequency.setValueAtTime(131, this.audioContext.currentTime + 3); // C3
        oscillator2.frequency.setValueAtTime(98, this.audioContext.currentTime + 4.5); // G2

        // Mid harmony
        oscillator3.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
        oscillator3.frequency.setValueAtTime(349, this.audioContext.currentTime + 1.5); // F4
        oscillator3.frequency.setValueAtTime(523, this.audioContext.currentTime + 3); // C5
        oscillator3.frequency.setValueAtTime(392, this.audioContext.currentTime + 4.5); // G4

        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);

        return { oscillator1, oscillator2, oscillator3, gainNode, duration: 6 };
    }

    createVictoryMusic() {
        if (!this.audioContext || !this.musicGain) return null;

        // Create a triumphant victory theme
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.musicGain);

        // Triumphant progression: C - F - G - C
        oscillator1.type = 'triangle';
        oscillator2.type = 'sine';

        // Victory fanfare melody
        oscillator1.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
        oscillator1.frequency.setValueAtTime(698, this.audioContext.currentTime + 1); // F5
        oscillator1.frequency.setValueAtTime(784, this.audioContext.currentTime + 2); // G5
        oscillator1.frequency.setValueAtTime(1047, this.audioContext.currentTime + 3); // C6

        // Harmony
        oscillator2.frequency.setValueAtTime(261, this.audioContext.currentTime); // C4
        oscillator2.frequency.setValueAtTime(349, this.audioContext.currentTime + 1); // F4
        oscillator2.frequency.setValueAtTime(392, this.audioContext.currentTime + 2); // G4
        oscillator2.frequency.setValueAtTime(523, this.audioContext.currentTime + 3); // C5

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 4);

        return { oscillator1, oscillator2, gainNode, duration: 4 };
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
            this.stopBackgroundMusic();
            console.log('🔇 Audio muted');
        } else {
            // Restart music when unmuted if there was a track playing
            if (this.currentTrackName) {
                setTimeout(() => {
                    this.playBackgroundMusic(this.currentTrackName);
                }, 100); // Small delay to ensure audio context is ready
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
        // Store the track name for potential restart after unmute
        this.currentTrackName = trackName;

        if (this.isMuted || !this.audioContext || !this.musicTracks[trackName]) return;

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Stop current music
        this.stopBackgroundMusic();

        try {
            const musicData = this.musicTracks[trackName]();
            if (musicData) {
                this.currentMusic = musicData;

                // Start all oscillators
                Object.keys(musicData).forEach(key => {
                    if (key.startsWith('oscillator') && musicData[key].start) {
                        musicData[key].start(this.audioContext.currentTime);
                        musicData[key].stop(this.audioContext.currentTime + musicData.duration);
                    }
                });

                // Set up looping
                setTimeout(() => {
                    if (this.currentMusic === musicData && this.currentTrackName === trackName) {
                        this.playBackgroundMusic(trackName); // Loop the music
                    }
                }, musicData.duration * 1000);

                console.log(`🎵 Playing BGM: ${trackName}`);
            }
        } catch (error) {
            console.warn('Error playing background music:', error);
        }
    }

    stopBackgroundMusic() {
        if (this.currentMusic) {
            try {
                // Stop all oscillators
                Object.keys(this.currentMusic).forEach(key => {
                    if (key.startsWith('oscillator') && this.currentMusic[key].stop) {
                        this.currentMusic[key].stop();
                    }
                });
            } catch (error) {
                // Oscillators might already be stopped
            }
            this.currentMusic = null;
        }
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
