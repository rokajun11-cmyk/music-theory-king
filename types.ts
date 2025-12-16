export type ViewState = 'home' | 'interval' | 'chord-type-menu' | 'chord' | 'test';

export type Language = 'zh' | 'en' | 'jp';

export type ChordMode = 'Major' | 'Natural Minor' | 'Harmonic Minor' | 'Melodic Minor';

export type ChordDegree = 3 | 7;

export interface LangData {
  app_title: string;
  home_btn: string;
  back_btn: string;
  interval_menu: string;
  chord_menu: string;
  interval_title: string;
  chord_select_title: string;
  major_title: string;
  natural_minor_title: string;
  harmonic_minor_title: string;
  melodic_minor_title: string;
  test_title: string;
  test_btn: string;
  check_btn: string;
  next_btn: string;
  chromatic_toggle: string;
  chromatic_toggle_basic: string;
  seventh_chord_btn: string;
  triad_btn: string;
  key_major: string;
  key_minor: string;
  feedback_correct: string;
  feedback_wrong: string;
  feedback_reveal: string;
  edit_key_hint: string;
  quiz_template_note: string;
  quiz_template_interval: string;
}

export interface NoteMap {
  [key: string]: number;
}
