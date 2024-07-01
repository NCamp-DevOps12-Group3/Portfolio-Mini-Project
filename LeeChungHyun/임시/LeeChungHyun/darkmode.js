 // 다크모드 상태 로컬 스토리지 저장
 function saveDarkModeState(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// 다크모드 상태 불러오기
function loadDarkModeState() {
    return localStorage.getItem('darkMode') === 'enabled';
}

// 불러온 다크모드 상태 적용
function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        $('body').addClass('dark-mode');
        $('#darkModeToggle').text('라이트 모드');
    } else {
        $('body').removeClass('dark-mode');
        $('#darkModeToggle').text('다크 모드');
    }
}

// Load dark mode state
var isDarkMode = loadDarkModeState();
applyDarkMode(isDarkMode);

$('#darkModeToggle').on('click', function () {
    isDarkMode = !$('body').hasClass('dark-mode');
    applyDarkMode(isDarkMode);
    saveDarkModeState(isDarkMode);
});