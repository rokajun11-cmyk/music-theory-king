
import { 
  noteValueMap, 
  baseNotes, 
  midiToNoteNames, 
  semitoneToInterval,
  scaleIntervals,
  chordOffsetMap 
} from '../constants.js';

export function calculateInterval(note1, note2) {
  const v1 = noteValueMap[note1] || 0;
  const v2 = noteValueMap[note2] || 0;
  let semitones = (v2 - v1 + 12) % 12;

  if (semitones === 6) {
    const note1Index = baseNotes.indexOf(note1[0]);
    const note2Index = baseNotes.indexOf(note2[0]);
    let letterDistance = (note2Index - note1Index + 7) % 7 + 1;
    if (letterDistance === 4) return 'A4';
    else if (letterDistance === 5) return 'd5';
    else return 'A4/d5';
  } else if (semitones === 0) {
    return 'P1/P8';
  }
  return semitoneToInterval[semitones];
}

export function getSpelledNote(midiValue, targetLetter) {
  const possibleNames = midiToNoteNames[midiValue] || [];
  const match = possibleNames.find(name => name.startsWith(targetLetter));
  return match || possibleNames[0] || '?';
}

export function calculateScale(mode, tonic) {
  const startValue = noteValueMap[tonic];
  const intervals = scaleIntervals[mode];
  if (!intervals) return [];

  const tonicLetter = tonic.charAt(0).toUpperCase();
  const tonicLetterIndex = baseNotes.indexOf(tonicLetter);

  return intervals.slice(0, 7).map((semitoneOffset, index) => {
    const noteValue = (startValue + semitoneOffset) % 12;
    const expectedLetter = baseNotes[(tonicLetterIndex + index) % 7];
    return getSpelledNote(noteValue, expectedLetter);
  });
}

export function extractChordType(roman) {
  let type = roman.replace(/[IVX]/g, '').replace('$\\text{dim7}$', 'dim7').replace('°', '°').replace('+', '+');
  if (roman.includes('maj7')) type = 'Maj7';
  else if (roman.includes('m7(b5)')) type = 'm7(b5)';
  else if (roman.includes('m7')) type = 'm7';
  else if (roman.includes('7')) type = '7';
  else if (roman.includes('dim7')) type = 'dim7';
  else if (roman.includes('mM7')) type = 'mM7';
  else if (roman.includes('Maj7#5')) type = 'Maj7#5';
  else if (type === '') {
    if (['I', 'IV', 'V'].includes(roman)) type = 'I';
    else if (['i', 'iv', 'v', 'vi'].includes(roman)) type = 'i';
  }
  return type;
}

export function calculateChordTones(root, type) {
  const offsets = chordOffsetMap[type] || [0, 4, 7];
  const rootVal = noteValueMap[root];
  const rootLetter = root.charAt(0).toUpperCase();
  const rootLetterIndex = baseNotes.indexOf(rootLetter);

  return offsets.map((offset, index) => {
    const noteValue = (rootVal + offset) % 12;
    
    // Default thirds stacking: 1(0), 3(2), 5(4), 7(6)
    let step = 0;
    if (index === 1) step = 2; // 3rd
    else if (index === 2) step = 4; // 5th
    else if (index === 3) step = 6; // 7th

    const expectedLetter = baseNotes[(rootLetterIndex + step) % 7];
    return getSpelledNote(noteValue, expectedLetter);
  });
}
