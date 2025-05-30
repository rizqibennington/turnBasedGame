export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.volume = 0.7;
        this.musicVolume = 0.4;

        // BGM related properties
        this.currentMusic = null;
        this.currentTrackName = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicTracks = {};
        this.isPlaying = false;
        this.musicInterval = null;
        this.musicOscillators = [];

        this.initializeAudioContext();
        this.createSounds();
        this.createEnhancedBackgroundMusic();
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create master gain node for global audio control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 1.0;
            this.masterGain.connect(this.audioContext.destination);

            // Create gain nodes for music and SFX
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();

            this.musicGain.gain.value = this.musicVolume;
            this.sfxGain.gain.value = this.volume;

            // Connect through master gain
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
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

    createEnhancedBackgroundMusic() {
        // Create enhanced background music with chord progressions and harmonies
        this.musicTracks = {
            menu: {
                name: 'Peaceful Preparation',
                chords: [
                    { notes: [261.63, 329.63, 392.00], duration: 2000 }, // C Major
                    { notes: [293.66, 369.99, 440.00], duration: 2000 }, // D Minor
                    { notes: [246.94, 311.13, 369.99], duration: 2000 }, // B Diminished
                    { notes: [261.63, 329.63, 392.00], duration: 2000 }  // C Major
                ],
                tempo: 'slow',
                volume: 0.3,
                waveType: 'sine'
            },
            battle: {
                name: 'Epic Battle Theme',
                chords: [
                    { notes: [220.00, 277.18, 329.63], duration: 800 },  // A Minor
                    { notes: [246.94, 311.13, 369.99], duration: 800 },  // B Diminished
                    { notes: [261.63, 329.63, 392.00], duration: 800 },  // C Major
                    { notes: [293.66, 369.99, 440.00], duration: 800 },  // D Minor
                    { notes: [329.63, 415.30, 493.88], duration: 1200 }, // E Major (climax)
                    { notes: [220.00, 277.18, 329.63], duration: 800 }   // A Minor (return)
                ],
                tempo: 'fast',
                volume: 0.35,
                waveType: 'sawtooth'
            },
            victory: {
                name: 'Victory Fanfare',
                chords: [
                    { notes: [261.63, 329.63, 392.00, 523.25], duration: 1500 }, // C Major 7th
                    { notes: [293.66, 369.99, 440.00, 587.33], duration: 1500 }, // D Minor 7th
                    { notes: [329.63, 415.30, 493.88, 659.25], duration: 2000 }, // E Major 7th
                    { notes: [261.63, 329.63, 392.00, 523.25], duration: 2500 }  // C Major 7th (finale)
                ],
                tempo: 'medium',
                volume: 0.4,
                waveType: 'triangle'
            }
        };
    }

    // Enhanced continuous background music with chord progressions
    startEnhancedMusic(trackName) {
        if (!this.audioContext || !this.musicGain) return;

        this.stopEnhancedMusic();

        const track = this.musicTracks[trackName];
        if (!track) {
            console.warn(`Track "${trackName}" not found`);
            return;
        }

        this.currentTrackName = trackName;
        this.isPlaying = true;
        this.musicOscillators = [];

        let chordIndex = 0;

        const playChord = () => {
            if (!this.isPlaying) return;

            // Stop previous oscillators
            this.musicOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            this.musicOscillators = [];

            const chord = track.chords[chordIndex];
            const chordGain = this.audioContext.createGain();
            chordGain.connect(this.musicGain);

            // Create multiple oscillators for harmony
            chord.notes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const noteGain = this.audioContext.createGain();

                oscillator.connect(noteGain);
                noteGain.connect(chordGain);

                oscillator.type = track.waveType;
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

                // Create envelope for musical phrasing
                const attackTime = 0.1;
                const sustainTime = chord.duration / 1000 - 0.3;
                const releaseTime = 0.2;

                noteGain.gain.setValueAtTime(0, this.audioContext.currentTime);
                noteGain.gain.linearRampToValueAtTime(
                    track.volume / chord.notes.length,
                    this.audioContext.currentTime + attackTime
                );
                noteGain.gain.setValueAtTime(
                    track.volume / chord.notes.length,
                    this.audioContext.currentTime + attackTime + sustainTime
                );
                noteGain.gain.linearRampToValueAtTime(
                    0,
                    this.audioContext.currentTime + attackTime + sustainTime + releaseTime
                );

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + attackTime + sustainTime + releaseTime);

                this.musicOscillators.push(oscillator);
            });

            // Move to next chord
            chordIndex = (chordIndex + 1) % track.chords.length;

            // Schedule next chord
            if (this.isPlaying) {
                this.musicInterval = setTimeout(playChord, chord.duration);
            }
        };

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                playChord();
            });
        } else {
            playChord();
        }


    }

    stopEnhancedMusic() {
        this.isPlaying = false;

        // Clear timeout
        if (this.musicInterval) {
            clearTimeout(this.musicInterval);
            this.musicInterval = null;
        }

        // Stop all oscillators
        this.musicOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Oscillator might already be stopped
            }
        });
        this.musicOscillators = [];


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

    async playSound(soundName) {
        if (!this.audioContext) return;

        // Resume audio context if it's suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
                return;
            }
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
        this.startEnhancedMusic(trackName);
    }

    stopBackgroundMusic() {
        this.stopEnhancedMusic();
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
