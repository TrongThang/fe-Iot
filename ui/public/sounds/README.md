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