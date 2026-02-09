// BMI Calculator App

let currentUnit = 'metric';
let bmiData = null;

// 초기화
document.addEventListener('DOMContentLoaded', async () => {
    await i18n.initI18n();
    hideLoader();
    setupEventListeners();
    loadHistory();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 단위 변경
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.addEventListener('click', switchUnit);
    });

    // 계산 버튼
    document.getElementById('calculate-btn').addEventListener('click', calculateBMI);

    // 입력 필드 엔터 키
    document.getElementById('height-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateBMI();
    });
    document.getElementById('weight-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateBMI();
    });

    // 공유 버튼
    document.getElementById('share-btn').addEventListener('click', shareBMI);

    // 언어 선택
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguageMenu);
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            await i18n.setLanguage(e.target.dataset.lang);
            updateUI();
            closeLanguageMenu();
        });
    });

    // 문서 클릭 시 언어 메뉴 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            closeLanguageMenu();
        }
    });

    // 실시간 계산 (입력 변경 시)
    document.getElementById('height-input').addEventListener('input', calculateBMI);
    document.getElementById('weight-input').addEventListener('input', calculateBMI);
}

// 단위 전환
function switchUnit(e) {
    const newUnit = e.target.dataset.unit;

    if (newUnit === currentUnit) return;

    const heightInput = document.getElementById('height-input');
    const weightInput = document.getElementById('weight-input');

    if (currentUnit === 'metric' && newUnit === 'imperial') {
        // cm -> ft/in, kg -> lb
        const heightCm = parseFloat(heightInput.value);
        const weightKg = parseFloat(weightInput.value);

        const heightFeet = heightCm / 30.48; // 1 ft = 30.48 cm
        const weightLb = weightKg * 2.20462; // 1 kg = 2.20462 lb

        heightInput.value = parseFloat(heightFeet.toFixed(2));
        weightInput.value = parseFloat(weightLb.toFixed(2));

        document.getElementById('height-unit').textContent = 'ft';
        document.getElementById('weight-unit').textContent = 'lb';
    } else {
        // ft -> cm, lb -> kg
        const heightFeet = parseFloat(heightInput.value);
        const weightLb = parseFloat(weightInput.value);

        const heightCm = heightFeet * 30.48;
        const weightKg = weightLb / 2.20462;

        heightInput.value = parseFloat(heightCm.toFixed(2));
        weightInput.value = parseFloat(weightKg.toFixed(2));

        document.getElementById('height-unit').textContent = 'cm';
        document.getElementById('weight-unit').textContent = 'kg';
    }

    currentUnit = newUnit;

    // 버튼 스타일 업데이트
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === newUnit);
    });

    calculateBMI();
}

// BMI 계산
function calculateBMI() {
    const heightInput = document.getElementById('height-input');
    const weightInput = document.getElementById('weight-input');

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        hideResults();
        return;
    }

    let bmi;
    if (currentUnit === 'metric') {
        // BMI = weight(kg) / (height(m))^2
        const heightM = height / 100;
        bmi = weight / (heightM * heightM);
    } else {
        // BMI = (weight(lb) / (height(in))^2) * 703
        const heightInches = height * 12;
        bmi = (weight / (heightInches * heightInches)) * 703;
    }

    bmi = parseFloat(bmi.toFixed(1));

    // 결과 저장
    bmiData = {
        bmi: bmi,
        height: height,
        weight: weight,
        unit: currentUnit,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    displayResults(bmi, height, weight);
    drawGauge(bmi);
    addToHistory(bmi, height, weight);
    // GA4: 도구 사용
    if (typeof gtag === 'function') {
        gtag('event', 'tool_use', {
            tool_name: 'bmi-calculator',
            action: 'calculate',
            bmi_value: bmi,
            unit: currentUnit
        });
    }
    recordGA4Event('bmi_calculated', { bmi: bmi });
}

// 결과 표시
function displayResults(bmi, height, weight) {
    const resultContainer = document.getElementById('result-container');
    const statusBadge = document.getElementById('status-badge');
    const statusEmoji = document.getElementById('status-emoji');
    const statusText = document.getElementById('status-text');

    let category, emoji, tip;

    if (bmi < 18.5) {
        category = i18n.t('bmi.underweight');
        emoji = '😔';
        tip = i18n.t('bmi.tipsUnderweight');
    } else if (bmi < 25) {
        category = i18n.t('bmi.normal');
        emoji = '😊';
        tip = i18n.t('bmi.tipsNormal');
    } else if (bmi < 30) {
        category = i18n.t('bmi.overweight');
        emoji = '😐';
        tip = i18n.t('bmi.tipsOverweight');
    } else {
        category = i18n.t('bmi.obese');
        emoji = '😟';
        tip = i18n.t('bmi.tipsObese');
    }

    statusEmoji.textContent = emoji;
    statusText.textContent = category;

    // BMI 값 표시
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);

    // 상세 정보 표시
    if (currentUnit === 'metric') {
        document.getElementById('result-height').textContent = `${height} cm`;
        document.getElementById('result-weight').textContent = `${weight} kg`;
    } else {
        document.getElementById('result-height').textContent = `${height.toFixed(2)} ft`;
        document.getElementById('result-weight').textContent = `${weight.toFixed(2)} lb`;
    }
    document.getElementById('result-bmi-value').textContent = bmi.toFixed(1);

    // 이상적 체중 범위 계산
    const minBMI = 18.5;
    const maxBMI = 24.9;

    let minWeight, maxWeight;
    if (currentUnit === 'metric') {
        const heightM = height / 100;
        minWeight = (minBMI * heightM * heightM).toFixed(1);
        maxWeight = (maxBMI * heightM * heightM).toFixed(1);
        document.getElementById('min-weight').textContent = `${minWeight} kg`;
        document.getElementById('max-weight').textContent = `${maxWeight} kg`;
    } else {
        const heightInches = height * 12;
        minWeight = ((minBMI * heightInches * heightInches) / 703).toFixed(1);
        maxWeight = ((maxBMI * heightInches * heightInches) / 703).toFixed(1);
        document.getElementById('min-weight').textContent = `${minWeight} lb`;
        document.getElementById('max-weight').textContent = `${maxWeight} lb`;
    }

    // 건강 팁
    document.getElementById('tip-text').textContent = tip;

    resultContainer.classList.remove('hidden');
}

// 게이지 그리기
function drawGauge(bmi) {
    const canvas = document.getElementById('bmi-gauge');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Canvas 해상도 설정
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height * 0.8;
    const radius = 80;

    // 배경 그리기
    ctx.fillStyle = 'rgba(0, 184, 148, 0.1)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.fill();

    // 색상 구간 그리기
    const segments = [
        { min: 0, max: 18.5, color: '#3498db', label: '저체중' },
        { min: 18.5, max: 25, color: '#00b894', label: '정상' },
        { min: 25, max: 30, color: '#f39c12', label: '과체중' },
        { min: 30, max: 50, color: '#e74c3c', label: '비만' }
    ];

    segments.forEach((segment) => {
        const startAngle = Math.PI + (segment.min / 50) * Math.PI;
        const endAngle = Math.PI + (segment.max / 50) * Math.PI;

        ctx.strokeStyle = segment.color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
        ctx.stroke();
    });

    // 바늘 그리기
    const needleAngle = Math.PI + (Math.min(Math.max(bmi, 0), 50) / 50) * Math.PI;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(needleAngle - Math.PI / 2);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius + 10);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 범위 표시
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, Segoe UI';
    ctx.textAlign = 'center';

    ctx.fillText('0', centerX - radius - 10, centerY + 5);
    ctx.fillText('50', centerX + radius + 10, centerY + 5);
}

// 결과 숨기기
function hideResults() {
    document.getElementById('result-container').classList.add('hidden');
}

// 히스토리에 추가
function addToHistory(bmi, height, weight) {
    let history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');

    const entry = {
        bmi: bmi,
        height: height,
        weight: weight,
        unit: currentUnit,
        date: new Date().toLocaleString('ko-KR')
    };

    history.unshift(entry);
    if (history.length > 10) history.pop();

    localStorage.setItem('bmiHistory', JSON.stringify(history));
    loadHistory();
}

// 히스토리 로드
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    const historyList = document.getElementById('calc-history');

    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">' + i18n.t('history.empty') + '</p>';
        return;
    }

    historyList.innerHTML = history.map(entry => {
        const unit = entry.unit === 'metric' ? 'cm/kg' : 'ft/lb';
        return `
            <div class="history-item">
                <span class="history-item-text">
                    BMI: <strong>${entry.bmi.toFixed(1)}</strong>
                    (${entry.height.toFixed(1)} ${unit.split('/')[0]} / ${entry.weight.toFixed(1)} ${unit.split('/')[1]})
                </span>
                <span class="history-item-time">${new Date(entry.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
    }).join('');
}

// 히스토리 삭제
function clearHistory() {
    if (confirm(i18n.t('history.confirmClear') || '정말 삭제하시겠습니까?')) {
        localStorage.removeItem('bmiHistory');
        loadHistory();
    }
}

// BMI 결과 공유
function shareBMI() {
    if (!bmiData) return;

    const text = `나의 BMI는 ${bmiData.bmi}입니다! 🏃‍♂️ BMI 계산기: https://dopabrain.com/bmi-calculator/`;

    // GA4: 결과 공유
    if (typeof gtag === 'function') {
        gtag('event', 'share', {
            method: navigator.share ? 'native' : 'clipboard',
            app_name: 'bmi-calculator',
            content_type: 'calculation_result'
        });
    }

    if (navigator.share) {
        navigator.share({
            title: 'BMI 계산기',
            text: text,
            url: 'https://dopabrain.com/bmi-calculator/'
        }).catch(() => {});
    } else {
        // 폴백: 클립보드에 복사
        navigator.clipboard.writeText(text).then(() => {
            alert(i18n.t('share.copied') || '복사되었습니다!');
        });
    }

    recordGA4Event('bmi_shared');
}

// 언어 메뉴 토글
function toggleLanguageMenu() {
    const menu = document.getElementById('lang-menu');
    menu.classList.toggle('hidden');
}

// 언어 메뉴 닫기
function closeLanguageMenu() {
    document.getElementById('lang-menu').classList.add('hidden');
}

// 로더 숨기기
function hideLoader() {
    const loader = document.getElementById('app-loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 500);
}

// UI 업데이트
function updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        element.textContent = i18n.t(key);
    });
    loadHistory();
}

// GA4 이벤트 기록
function recordGA4Event(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
}
