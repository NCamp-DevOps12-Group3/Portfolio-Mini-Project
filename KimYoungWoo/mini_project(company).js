$(document).ready(function () {
    $('#com1').on('click', function () {
      var imageUrl = '웹홈페이지 더미/1.png'; // 이미지 URL 설정
      var iframe = $('#imageIframe');
  
      // 이미지 로드 완료 시 크기 조절
      var img = new Image();
      img.onload = function() {
        var imgWidth = img.width;
        var imgHeight = img.height;
  
        iframe.css({
          width: imgWidth + 'px',
          height: imgHeight + 'px'
        });
  
        $('#CompanyPortFolioModal .modal-content').css({
          width: imgWidth + 'px',
          height: imgHeight + 'px'
        });
  
        $('#CompanyPortFolioModal').modal('show');
      };
      img.src = imageUrl;
    });
  
    $('#CompanyPortFolioModal').on('hidden.bs.modal', function () {
      // 모달이 숨겨질 때 iframe의 src를 초기화
      $('#imageIframe').attr('src', '');
    });
  });