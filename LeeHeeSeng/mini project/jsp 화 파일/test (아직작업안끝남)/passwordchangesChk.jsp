<%@ page contentType="text/html;charset=UTF-8" language="java" %>





<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>비밀번호 확인</title>
	<link href="css/bootstrap.css" rel="stylesheet">
	<script src="js/jquery-3.7.1.min.js"></script>
	<script src="js/bootstrap.bundle.js"></script>
	<style>
        /* 컨테이너 스타일 */
        .container {
            height: 90vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        /* 카드 스타일 */
        .card {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        /* 폰트 스타일 */
        .text-muted {
            font-size: 0.8rem;
        }
        /* 경고창 위치 마커 스타일 */
        #liveAlertPlaceholder {
            justify-content: center;
            align-items: center;
            height: 50px;
            width:auto;
            text-align: center;
            padding-top: 90px;
        }
	
	
	
	
	</style>
</head>
<body>
<div id="liveAlertPlaceholder" ></div><!-- 경고창 위치 마커-->
<div class="container">
	<div class="card">
		
		<p class="h5 card-title text-center">비밀번호변경</p><!-- 회원가입 양식 텍스트 -->
		<p class="text-center" >본인확인을 위해서 다시한번  <br>비밀번호를 입력하세요 </p><!-- 회원가입 양식 텍스트 -->
		<form  action="" id="login-form">
			<div class="mb-3">
				비밀번호
				<input type="password" class="form-control" id="password" name="password" placeholder="비밀번호">
			</div>
			<div class="d-grid mb-3">
				<button type="button" class="btn btn-dark" id="ChangePassword">비밀번호변경</button>
			</div>
			<div style="text-align: center;">
				<a href="setting.html" style="color: white;">
					<button type="button" class="btn border border-dark" >취소
					</button></a>
			</div>
		
		</form>
	</div>
</div>

<script>
    $(()=>{
        const userdata = new Object();
        const apassword = document.querySelector("input[name='password']"); /*비밀번호 선택*/
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder'); /*경고창 위치 마커 선택*/

        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/

            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/
                `<div class="alert alert-danger alert-dismissible" role="alert">`, /*div 열고 wrapper 스타일 부트스트랩*/
                ` <div>${message}</div>`, /*wrapper에들어갈메세지*/
                '</div>' /*div닫기*/
            ].join(''); /*위내용을 문자열로 바꾸기 */





            const alerts = alertPlaceholder.querySelectorAll('.alert');
            if (alerts.length >= 2) {
                alertPlaceholder.removeChild(alerts[0]);
            }




            alertPlaceholder.append(wrapper); /*liveAlertPlaceholder 에 써 넣기*/

            // 알림 메시지 1.5초 지속하고 서서히 지우기 함수입니다.
            setTimeout(() => {
                wrapper.querySelector('.alert').classList.remove('show');
                wrapper.querySelector('.alert').classList.add('fade');
                setTimeout(() => {
                    wrapper.remove();
                }, 100); // fade-out 효과를 위해 약간의 지연을 줍니다.
            }, 1500);
        }




        $("#password").on("keydown", (e) => {
            if(e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                $("#ChangePassword").click();
            }
        });



        $("#ChangePassword").on("click", (e) => {
            console.log($("#password").val());
            if($("#password").val() === '') {
                appendAlert('비밀번호를  입력하세요', 'success');
                e.preventDefault();
                return;
            }


            // 비밀번호와 서버의 비밀번호 불일치시
            // if($("#password").val() != "helldive@2") {
            //     appendAlert('비밀번호가 일치하지 않습니다.', 'success');
            //     e.preventDefault();
            //     return;
            // }
            const getpassword = document.getElementById("password");
            userdata.password = getpassword.value;
            userdata.info = function() {
                console.log(`비밀번호: ${this.password}`);
            }
            userdata.info();

            // window.location.href='passwordchanges.html';
        });




    })
</script>
</body>
</html>