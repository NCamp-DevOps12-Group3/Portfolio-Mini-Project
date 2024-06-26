// 다크모드 관련 함수
function saveDarkModeState(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function loadDarkModeState() {
    return localStorage.getItem('darkMode') === 'enabled';
}

function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        $('body').addClass('dark-mode');
        $('#darkModeToggle').text("").append(`<div>라이트 모드</div>`)
    } else {
        $('body').removeClass('dark-mode');
        $('#darkModeToggle').text("").append(`<div>다크 모드</div>`);
    }
}