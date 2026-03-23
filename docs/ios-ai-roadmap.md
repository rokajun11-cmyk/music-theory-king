# iOS + AI Roadmap

## Current status

- The existing web app can now be built with `npm run build`.
- A Capacitor iOS wrapper has been generated under `ios/`.
- The native project can be opened from `ios/App/App.xcodeproj` in Xcode.

## Recommended implementation order

1. Keep the current theory tool as the base app and verify it runs on iPhone through Capacitor.
2. Convert training material from the PDF into structured JSON instead of trying to query the PDF directly at runtime.
3. Add camera/photo import on iOS.
4. Add image recognition and song matching.
5. Render chord analysis overlays from the structured dataset.

## Training material pipeline

The PDF should become a searchable corpus, not a live dependency.

### Target output

Each song should be stored as structured data with:

- song title
- key candidates
- sections
- measures
- detected chords
- chord analysis for each chord

### Suggested schema

```json
{
  "songId": "all-of-me",
  "title": "All of Me",
  "source": "Jazz Standard Bible",
  "charts": [
    {
      "key": "C",
      "sections": [
        {
          "label": "A",
          "measures": [
            {
              "index": 1,
              "chords": [
                {
                  "symbol": "Cmaj7",
                  "analysis": {
                    "roman": "Imaj7",
                    "function": "T",
                    "parentMode": "Ionian",
                    "recommendedMode": "Ionian",
                    "avoidNotes": ["F"],
                    "chordTones": [
                      { "note": "C", "degreeInChord": "1" },
                      { "note": "E", "degreeInChord": "3" },
                      { "note": "G", "degreeInChord": "5" },
                      { "note": "B", "degreeInChord": "7" }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Analysis fields you asked for

For every chord in every chart, store:

- scale degree / Roman numeral in the song key
- harmonic function
- matching medieval/church mode or jazz-parent scale mapping
- avoid notes
- chord tones
- each chord tone's scale degree inside that chord

This should be precomputed and saved, not inferred on every photo upload.

## Recognition pipeline

### On-device responsibilities

Swift should handle:

- camera capture
- photo picker
- image cropping
- perspective correction
- optional local preprocessing before upload

### AI/backend responsibilities

A backend service should handle:

- OCR or vision model parsing
- chord chart extraction
- song matching against the structured corpus
- confidence scoring
- fallback when a chart is partially recognized

### App responsibilities

The app should:

- send the captured image
- receive candidate song matches
- show the recognized title, key, and chord chart
- overlay analysis tags on top of each recognized chord

## Why not do this directly from the PDF

The PDF is useful as a source, but not as the runtime database.

Problems with runtime PDF parsing:

- layout varies by page
- OCR errors will be noisy
- repeated analysis becomes expensive
- debugging recognition quality is difficult

A normalized JSON corpus makes recognition, matching, and correction manageable.

## Architecture split

### Web layer

- existing theory pages
- analysis result display
- training views
- song/chord detail UI

### Swift layer

- camera
- image picker
- native image preprocessing
- future native annotation canvas if needed

### Backend layer

- AI calls
- OCR / VLM processing
- PDF-to-dataset generation
- song matching

## Immediate next coding tasks

1. Add a basic home entry for "Song Scan".
2. Add Capacitor camera/photo import.
3. Create a `data/` folder with a first manual JSON song sample.
4. Build a chord analysis module that can enrich a chart into the schema above.
5. Add an upload flow that returns mock recognition results before connecting real AI.
