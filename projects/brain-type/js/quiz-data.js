// 두뇌 유형 정의
const BRAIN_TYPES = {
    creator: {
        id: 'creator',
        emoji: '🎨',
        nameKey: 'type.creator',
        taglineKey: 'type.creator_tagline',
        descriptionKey: 'type.creator_description',
        strengthsKey: ['type.creator_strength_1', 'type.creator_strength_2', 'type.creator_strength_3'],
        weaknessesKey: ['type.creator_weakness_1', 'type.creator_weakness_2'],
        compatibleKey: 'type.creator_compatible',
        incompatibleKey: 'type.creator_incompatible',
        famousKey: 'type.creator_famous',
        deepAnalysisKey: 'type.creator_deep_analysis'
    },
    analyst: {
        id: 'analyst',
        emoji: '🧮',
        nameKey: 'type.analyst',
        taglineKey: 'type.analyst_tagline',
        descriptionKey: 'type.analyst_description',
        strengthsKey: ['type.analyst_strength_1', 'type.analyst_strength_2', 'type.analyst_strength_3'],
        weaknessesKey: ['type.analyst_weakness_1', 'type.analyst_weakness_2'],
        compatibleKey: 'type.analyst_compatible',
        incompatibleKey: 'type.analyst_incompatible',
        famousKey: 'type.analyst_famous',
        deepAnalysisKey: 'type.analyst_deep_analysis'
    },
    empath: {
        id: 'empath',
        emoji: '🌈',
        nameKey: 'type.empath',
        taglineKey: 'type.empath_tagline',
        descriptionKey: 'type.empath_description',
        strengthsKey: ['type.empath_strength_1', 'type.empath_strength_2', 'type.empath_strength_3'],
        weaknessesKey: ['type.empath_weakness_1', 'type.empath_weakness_2'],
        compatibleKey: 'type.empath_compatible',
        incompatibleKey: 'type.empath_incompatible',
        famousKey: 'type.empath_famous',
        deepAnalysisKey: 'type.empath_deep_analysis'
    },
    speedster: {
        id: 'speedster',
        emoji: '⚡',
        nameKey: 'type.speedster',
        taglineKey: 'type.speedster_tagline',
        descriptionKey: 'type.speedster_description',
        strengthsKey: ['type.speedster_strength_1', 'type.speedster_strength_2', 'type.speedster_strength_3'],
        weaknessesKey: ['type.speedster_weakness_1', 'type.speedster_weakness_2'],
        compatibleKey: 'type.speedster_compatible',
        incompatibleKey: 'type.speedster_incompatible',
        famousKey: 'type.speedster_famous',
        deepAnalysisKey: 'type.speedster_deep_analysis'
    },
    intuitive: {
        id: 'intuitive',
        emoji: '🔮',
        nameKey: 'type.intuitive',
        taglineKey: 'type.intuitive_tagline',
        descriptionKey: 'type.intuitive_description',
        strengthsKey: ['type.intuitive_strength_1', 'type.intuitive_strength_2', 'type.intuitive_strength_3'],
        weaknessesKey: ['type.intuitive_weakness_1', 'type.intuitive_weakness_2'],
        compatibleKey: 'type.intuitive_compatible',
        incompatibleKey: 'type.intuitive_incompatible',
        famousKey: 'type.intuitive_famous',
        deepAnalysisKey: 'type.intuitive_deep_analysis'
    },
    scholar: {
        id: 'scholar',
        emoji: '📚',
        nameKey: 'type.scholar',
        taglineKey: 'type.scholar_tagline',
        descriptionKey: 'type.scholar_description',
        strengthsKey: ['type.scholar_strength_1', 'type.scholar_strength_2', 'type.scholar_strength_3'],
        weaknessesKey: ['type.scholar_weakness_1', 'type.scholar_weakness_2'],
        compatibleKey: 'type.scholar_compatible',
        incompatibleKey: 'type.scholar_incompatible',
        famousKey: 'type.scholar_famous',
        deepAnalysisKey: 'type.scholar_deep_analysis'
    },
    strategist: {
        id: 'strategist',
        emoji: '🎯',
        nameKey: 'type.strategist',
        taglineKey: 'type.strategist_tagline',
        descriptionKey: 'type.strategist_description',
        strengthsKey: ['type.strategist_strength_1', 'type.strategist_strength_2', 'type.strategist_strength_3'],
        weaknessesKey: ['type.strategist_weakness_1', 'type.strategist_weakness_2'],
        compatibleKey: 'type.strategist_compatible',
        incompatibleKey: 'type.strategist_incompatible',
        famousKey: 'type.strategist_famous',
        deepAnalysisKey: 'type.strategist_deep_analysis'
    },
    spirit: {
        id: 'spirit',
        emoji: '🌊',
        nameKey: 'type.spirit',
        taglineKey: 'type.spirit_tagline',
        descriptionKey: 'type.spirit_description',
        strengthsKey: ['type.spirit_strength_1', 'type.spirit_strength_2', 'type.spirit_strength_3'],
        weaknessesKey: ['type.spirit_weakness_1', 'type.spirit_weakness_2'],
        compatibleKey: 'type.spirit_compatible',
        incompatibleKey: 'type.spirit_incompatible',
        famousKey: 'type.spirit_famous',
        deepAnalysisKey: 'type.spirit_deep_analysis'
    }
};

// 퀴즈 질문 (10개)
const QUIZ_QUESTIONS = [
    {
        id: 1,
        textKey: 'question.1',
        options: [
            { textKey: 'option.1_1', types: { creator: 3, intuitive: 1 } },
            { textKey: 'option.1_2', types: { analyst: 3, scholar: 1 } },
            { textKey: 'option.1_3', types: { strategist: 3, speedster: 1 } },
            { textKey: 'option.1_4', types: { empath: 3, spirit: 1 } }
        ]
    },
    {
        id: 2,
        textKey: 'question.2',
        options: [
            { textKey: 'option.2_1', types: { speedster: 3, analyst: 1 } },
            { textKey: 'option.2_2', types: { strategist: 3, scholar: 1 } },
            { textKey: 'option.2_3', types: { creator: 3, spirit: 1 } },
            { textKey: 'option.2_4', types: { intuitive: 3, empath: 1 } }
        ]
    },
    {
        id: 3,
        textKey: 'question.3',
        options: [
            { textKey: 'option.3_1', types: { scholar: 3, analyst: 1 } },
            { textKey: 'option.3_2', types: { empath: 3, intuitive: 1 } },
            { textKey: 'option.3_3', types: { creator: 3, speedster: 1 } },
            { textKey: 'option.3_4', types: { strategist: 3, spirit: 1 } }
        ]
    },
    {
        id: 4,
        textKey: 'question.4',
        options: [
            { textKey: 'option.4_1', types: { intuitive: 3, spirit: 1 } },
            { textKey: 'option.4_2', types: { creator: 3, empath: 1 } },
            { textKey: 'option.4_3', types: { analyst: 3, strategist: 1 } },
            { textKey: 'option.4_4', types: { speedster: 3, scholar: 1 } }
        ]
    },
    {
        id: 5,
        textKey: 'question.5',
        options: [
            { textKey: 'option.5_1', types: { strategist: 3, analyst: 1 } },
            { textKey: 'option.5_2', types: { spirit: 3, empath: 1 } },
            { textKey: 'option.5_3', types: { scholar: 3, creator: 1 } },
            { textKey: 'option.5_4', types: { speedster: 3, intuitive: 1 } }
        ]
    },
    {
        id: 6,
        textKey: 'question.6',
        options: [
            { textKey: 'option.6_1', types: { empath: 3, spirit: 1 } },
            { textKey: 'option.6_2', types: { creator: 3, intuitive: 1 } },
            { textKey: 'option.6_3', types: { speedster: 3, analyst: 1 } },
            { textKey: 'option.6_4', types: { scholar: 3, strategist: 1 } }
        ]
    },
    {
        id: 7,
        textKey: 'question.7',
        options: [
            { textKey: 'option.7_1', types: { analyst: 3, scholar: 1 } },
            { textKey: 'option.7_2', types: { strategist: 3, speedster: 1 } },
            { textKey: 'option.7_3', types: { creator: 3, spirit: 1 } },
            { textKey: 'option.7_4', types: { intuitive: 3, empath: 1 } }
        ]
    },
    {
        id: 8,
        textKey: 'question.8',
        options: [
            { textKey: 'option.8_1', types: { speedster: 3, strategist: 1 } },
            { textKey: 'option.8_2', types: { intuitive: 3, creator: 1 } },
            { textKey: 'option.8_3', types: { empath: 3, scholar: 1 } },
            { textKey: 'option.8_4', types: { spirit: 3, analyst: 1 } }
        ]
    },
    {
        id: 9,
        textKey: 'question.9',
        options: [
            { textKey: 'option.9_1', types: { creator: 3, scholar: 1 } },
            { textKey: 'option.9_2', types: { analyst: 3, empath: 1 } },
            { textKey: 'option.9_3', types: { spirit: 3, speedster: 1 } },
            { textKey: 'option.9_4', types: { strategist: 3, intuitive: 1 } }
        ]
    },
    {
        id: 10,
        textKey: 'question.10',
        options: [
            { textKey: 'option.10_1', types: { intuitive: 3, spirit: 1 } },
            { textKey: 'option.10_2', types: { empath: 3, creator: 1 } },
            { textKey: 'option.10_3', types: { scholar: 3, analyst: 1 } },
            { textKey: 'option.10_4', types: { speedster: 3, strategist: 1 } }
        ]
    }
];

// 추천 앱 (최대 6개)
const RECOMMENDED_APPS = [
    {
        id: 'reaction-test',
        emoji: '⚡',
        nameKey: 'app.reaction_test'
    },
    {
        id: 'dream-fortune',
        emoji: '🌙',
        nameKey: 'app.dream_fortune'
    },
    {
        id: 'mbti-love',
        emoji: '💕',
        nameKey: 'app.mbti_love'
    },
    {
        id: 'hsp-test',
        emoji: '😌',
        nameKey: 'app.hsp_test'
    },
    {
        id: 'emotion-temp',
        emoji: '🌡️',
        nameKey: 'app.emotion_temp'
    },
    {
        id: 'color-memory',
        emoji: '🎨',
        nameKey: 'app.color_memory'
    }
];

// 결과 계산 함수
function calculateResult(answers) {
    const scores = {};

    // 모든 유형 초기화
    Object.keys(BRAIN_TYPES).forEach(type => {
        scores[type] = 0;
    });

    // 점수 계산
    answers.forEach(answerIndex => {
        const question = QUIZ_QUESTIONS[answers.indexOf(answerIndex)];
        const option = question.options[answerIndex];

        Object.entries(option.types).forEach(([type, points]) => {
            scores[type] += points;
        });
    });

    // 가장 높은 점수 찾기
    let maxScore = 0;
    let resultType = 'creator';

    Object.entries(scores).forEach(([type, score]) => {
        if (score > maxScore) {
            maxScore = score;
            resultType = type;
        }
    });

    return resultType;
}

// 특정 유형에 대한 호환성 정보
function getCompatibility(resultType) {
    const compatibilityMap = {
        creator: {
            compatible: ['empath', 'intuitive'],
            incompatible: ['analyst', 'speedster']
        },
        analyst: {
            compatible: ['scholar', 'strategist'],
            incompatible: ['creator', 'spirit']
        },
        empath: {
            compatible: ['creator', 'spirit'],
            incompatible: ['analyst', 'speedster']
        },
        speedster: {
            compatible: ['strategist', 'scholar'],
            incompatible: ['empath', 'intuitive']
        },
        intuitive: {
            compatible: ['creator', 'spirit'],
            incompatible: ['analyst', 'speedster']
        },
        scholar: {
            compatible: ['analyst', 'strategist'],
            incompatible: ['spirit', 'empath']
        },
        strategist: {
            compatible: ['analyst', 'speedster'],
            incompatible: ['creator', 'intuitive']
        },
        spirit: {
            compatible: ['empath', 'intuitive'],
            incompatible: ['analyst', 'scholar']
        }
    };

    return compatibilityMap[resultType] || { compatible: [], incompatible: [] };
}
