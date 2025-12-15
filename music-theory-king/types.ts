export type Language = 'zh' | 'en' | 'jp';
export type View = 'home' | 'interval' | 'chord-type-menu' | 'chord' | 'test';
export type ScaleMode = 'Major' | 'Natural Minor' | 'Harmonic Minor' | 'Melodic Minor';

export interface LangStrings {
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
    [key: string]: string;
}

export const LANGUAGES: Record<Language, LangStrings> = {
    zh: {
        app_title: '乐理学习大王',
        home_btn: '首页',
        back_btn: '返回',
        interval_menu: '音程关系',
        chord_menu: '和弦组成音',
        interval_title: '音程关系学习',
        chord_select_title: '和弦调式选择',
        major_title: '自然大调',
        natural_minor_title: '自然小调',
        harmonic_minor_title: '和声小调',
        melodic_minor_title: '旋律小调',
        test_title: '音程测试',
        test_btn: '开始测试',
        check_btn: '检查答案',
        next_btn: '下一题',
        chromatic_toggle: '切换到：带升降音',
        chromatic_toggle_basic: '切换到：基础音名',
        seventh_chord_btn: '七和弦',
        triad_btn: '三和弦',
        key_major: '大调',
        key_minor: '小调',
        feedback_correct: '太棒了！正确',
        feedback_wrong: '哎呀！错误',
        feedback_reveal: '正确答案是：',
        edit_key_hint: '点击修改调性'
    },
    en: {
        app_title: 'Music Theory King',
        home_btn: 'Home',
        back_btn: 'Back',
        interval_menu: 'Intervals',
        chord_menu: 'Chords',
        interval_title: 'Intervals',
        chord_select_title: 'Select Mode',
        major_title: 'Major Scale',
        natural_minor_title: 'Natural Minor',
        harmonic_minor_title: 'Harmonic Minor',
        melodic_minor_title: 'Melodic Minor',
        test_title: 'Quiz',
        test_btn: 'Start Quiz',
        check_btn: 'Check',
        next_btn: 'Next',
        chromatic_toggle: 'Mode: Chromatic',
        chromatic_toggle_basic: 'Mode: Basic',
        seventh_chord_btn: 'Sevenths',
        triad_btn: 'Triads',
        key_major: 'Major',
        key_minor: 'Minor',
        feedback_correct: 'Correct!',
        feedback_wrong: 'Wrong!',
        feedback_reveal: 'Answer is: ',
        edit_key_hint: 'Click to change key'
    },
    jp: {
        app_title: '楽典のキング',
        home_btn: 'ホーム',
        back_btn: '戻る',
        interval_menu: '音程',
        chord_menu: 'コード',
        interval_title: '音程学習',
        chord_select_title: 'モード選択',
        major_title: '長調',
        natural_minor_title: '自然的短調',
        harmonic_minor_title: '和声的短調',
        melodic_minor_title: '旋律的短調',
        test_title: 'テスト',
        test_btn: 'テスト開始',
        check_btn: '確認',
        next_btn: '次へ',
        chromatic_toggle: '切替: 変化記号',
        chromatic_toggle_basic: '切替: 基本音',
        seventh_chord_btn: '7和音',
        triad_btn: '3和音',
        key_major: '長調',
        key_minor: '短調',
        feedback_correct: '正解！',
        feedback_wrong: '不正解',
        feedback_reveal: '正解は：',
        edit_key_hint: 'キーを変更'
    }
};