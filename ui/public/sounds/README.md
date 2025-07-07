# Fire Alert Sounds

This directory contains audio files for fire alert notifications.

## Required Files

### fire-alarm.mp3
Fire alarm sound that will play when critical fire/gas alerts are triggered.

**Requirements:**
- Format: MP3
- Duration: 3-10 seconds (will loop automatically)
- Volume: Should be loud and attention-grabbing
- Frequency: High frequency sounds (1000-3000 Hz) for better alerting

**Suggested sources:**
- Free alarm sounds from freesound.org
- Emergency alert tones
- Classic fire alarm beeping sounds

## Usage

The fire alert system will automatically play these sounds when:
- Gas levels exceed 2000 PPM (DANGER level)
- Temperature exceeds 50°C (DANGER level) 
- Critical emergency alerts are received

## Implementation

Files are loaded in `useFireAlertSocket.js`:
```javascript
audioRef.current = new Audio('/sounds/fire-alarm.mp3');
```

## Development

For development/testing, you can:
1. Use browser dev tools to disable audio
2. Set `enableSound: false` in component options
3. Use a shorter/quieter test sound file

## Production

Ensure audio files are:
- Properly licensed for commercial use
- Optimized for web (compressed but clear)
- Tested across different browsers and devices 

# Emergency Alert Sounds

## Required Audio Files

To enable emergency alert sounds, add the following audio files to this directory:

### Primary Alert Sound
- **File**: `emergency-alert.mp3`
- **Format**: MP3, 44.1 kHz, 128 kbps
- **Duration**: 3-5 seconds
- **Volume**: Normalized to -3dB
- **Description**: Emergency alarm sound for fire/smoke/gas alerts

### Backup Formats (Optional)
- `emergency-alert.wav` - For better browser compatibility
- `emergency-alert.ogg` - For Firefox compatibility

## Sound Characteristics

### Fire Alert Sound
- **Frequency**: High pitch (800-1000 Hz)
- **Pattern**: Continuous beeping
- **Urgency**: Maximum intensity
- **Example**: Traditional fire alarm beep

### Smoke Alert Sound  
- **Frequency**: Medium pitch (600-800 Hz)
- **Pattern**: Intermittent beeping
- **Urgency**: High intensity
- **Example**: Smoke detector chirp

### Gas Alert Sound
- **Frequency**: Variable pitch (400-1000 Hz)
- **Pattern**: Warbling/siren sound
- **Urgency**: Maximum intensity  
- **Example**: Gas leak alarm

## Implementation

The emergency sound is triggered in:
- `ui/src/services/fcmService.js` → `showEmergencySwal()` function
- Fallback: Generated audio using Web Audio API if file not found

### Code Reference
```javascript
// Play emergency sound if available
const audio = new Audio('/sounds/emergency-alert.mp3');
audio.play().catch(() => {
  console.log('Emergency sound not available');
});
```

## Creating Alert Sounds

### Online Resources
- **Free Alert Sounds**: freesound.org, zapsplat.com
- **Emergency Tones**: Search for "fire alarm", "emergency siren", "alert tone"
- **Generated Sounds**: Use Audacity or online tone generators

### Audio Editing
1. **Audacity** (Free): audacityteam.org
2. **Normalize**: Ensure consistent volume
3. **Trim**: Keep duration under 5 seconds
4. **Export**: MP3 format, 44.1 kHz

### Web Audio API Fallback
If no audio file is found, the system generates a basic alarm tone using:
- Oscillator frequency: 800 Hz (fire), 600 Hz (smoke), 1000 Hz (gas)
- Wave type: Square wave
- Duration: 3 seconds
- Volume: 10% (0.1 gain)

## Testing

### Browser Testing
```javascript
// Test emergency sound
const audio = new Audio('/sounds/emergency-alert.mp3');
audio.play()
  .then(() => console.log('✅ Sound played successfully'))
  .catch(error => console.log('❌ Sound failed:', error));
```

### User Preferences
Consider implementing:
- Sound volume control
- Sound enable/disable toggle
- Custom alert sounds per alert type
- Accessibility alternatives (visual indicators)

## Browser Compatibility

### Sound Support
- ✅ **Chrome**: Full MP3 support
- ✅ **Firefox**: MP3 + OGG support  
- ✅ **Safari**: MP3 + WAV support
- ✅ **Edge**: Full MP3 support

### Autoplay Policies
- **Chrome 66+**: Requires user interaction first
- **Safari**: Restricted autoplay
- **Firefox**: Configurable autoplay policy
- **Solution**: Emergency sounds triggered by user interactions (socket events)

## Production Considerations

### File Size
- Keep under 100KB for fast loading
- Compress without quality loss
- Consider multiple formats for compatibility

### Caching
- Enable browser caching for audio files
- Preload critical alert sounds
- Service worker caching for offline support

### Legal
- Ensure royalty-free or properly licensed sounds
- Check attribution requirements
- Consider liability for loud emergency sounds

## Example Emergency Alert Sound

If you need a quick test sound, you can create one using JavaScript:

```javascript
// Generate a simple emergency tone
const generateEmergencyTone = () => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.type = 'square';
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, 3000);
};
```

## Quick Setup

1. **Download** a free emergency alert sound
2. **Rename** to `emergency-alert.mp3`
3. **Place** in `ui/public/sounds/` directory
4. **Test** using the Fire Alert test interface
5. **Verify** sound plays during emergency alerts

**Emergency alert sounds enhance the urgency and effectiveness of fire safety notifications!** 🔊🚨 