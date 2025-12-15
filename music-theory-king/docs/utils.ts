import { noteValueMap, baseNotes, semitoneToInterval, scaleIntervals, valueNoteMap, chordOffsetMap } from './constants';
import { ScaleMode } from './types';

export function calculateInterval(note1: string, note2: string): string {
    const v1 = noteValueMap[note1] || 0;
    const v2 = noteValueMap[note2] || 0;
    let semitones = (v2 - v1 + 12) % 12; 
    
    if (semitones === 6) {
        const note1Index = baseNotes.indexOf(note1[0]);
        const note2Index = baseNotes.indexOf(note2[0]);
        const letterDistance = (note2Index - note1Index + 7) % 7 + 1;
        if (letterDistance === 4) return 'A4';
        else if (letterDistance === 5) return 'd5';
        else return 'A4/d5'; 
    } else if (semitones === 0) return 'P1/P8';
    return semitoneToInterval[semitones];
}

export function calculateScale(mode: ScaleMode, tonic: string): string[] {
    const startValue = noteValueMap[tonic];
    const intervals = scaleIntervals[mode];
    if (!intervals) return [];
    return intervals.slice(0, 7).map(semitoneOffset => {
        const noteIndex = (startValue + semitoneOffset) % 12;
        return valueNoteMap[noteIndex]; 
    });
}

export function extractChordType(roman: string): string {
    let type = roman.replace(/[IVX]/g, '').replace('$\\text{dim7}$', 'dim7').replace('°', '°').replace('+', '+');
    // Handle the specific TeX-like formatting from original code if present
    type = type.replace('$\text{dim7}$', 'dim7');
    
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

export function calculateChordTones(root: string, type: string): string[] {
    const offsets = chordOffsetMap[type] || [0, 4, 7]; 
    const rootVal = noteValueMap[root];
    return offsets.map(offset => valueNoteMap[(rootVal + offset) % 12]);
}

export function formatChordDisplay(roman: string, type: string, note: string): string {
    const suffix = type.replace('Maj7', 'maj7')
                      .replace('m7', 'min7')
                      .replace('7', '7')
                      .replace('$\text{dim7}$', '°7')
                      .replace('dim7', '°7')
                      .replace('+', '');
    return `${note}${suffix}`;
}