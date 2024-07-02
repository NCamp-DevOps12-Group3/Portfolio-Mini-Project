$('#notificationIcon').on('click', function (e) {
    e.preventDefault();
    $('#notificationDropdown').toggle();
});

$(document).on('click', function (e) {
    if (!$(e.target).closest('#notificationIcon').length) {
        $('#notificationDropdown').hide();
    }
});