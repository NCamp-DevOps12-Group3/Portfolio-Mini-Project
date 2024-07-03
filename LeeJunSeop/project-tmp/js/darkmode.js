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
        $('#darkModeToggle').text("").append(`<i class="bi bi-moon-fill"></i><div>화면 모드</div>`)
        applyDisplayDarkMode(isDarkMode);
    } else {
        $('body').removeClass('dark-mode');
        $('#darkModeToggle').text("").append(`<i class="bi bi-brightness-high"></i><div>화면 모드</div>`);
    }
}

function applyDisplayDarkMode(isDarkMode){
    if(isDarkMode){
        $('#darkModeToggle').parent().childeren().hover(function(){
            $(this).childeren().css("background", "#dddddd");
        }, function(){
            $(this).childeren().css("background", "#121212");
        })
    }
}