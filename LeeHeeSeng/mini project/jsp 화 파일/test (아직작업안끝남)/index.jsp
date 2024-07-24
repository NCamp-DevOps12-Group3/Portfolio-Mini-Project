<%@ page contentType="text/html;charset=UTF-8" language="java" %>






<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>로그인 페이지</title>
	<link href="css/bootstrap.css" rel="stylesheet">
	<script src="js/jquery-3.7.1.min.js"></script>
	<script src="js/bootstrap.bundle.js"></script>
	<style>
        .container {
            height: 80vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .card {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

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
            padding-top: 100px;
        }
	</style>
</head>
<body>
<div id="liveAlertPlaceholder" ></div><!-- 경고창 위치 마커--><div class="container">
	<div class="card">
		<p class="h5 card-title text-center">로그인</p>
		<p class="text-center">이메일로 로그인하기</p>
		<form  action="" id="login-form">
			<div class="mb-3">
				<label class="d-inline">
					이메일
					<input type="email" class="form-control" id="email" name="email" placeholder="이메일">
				</label>
				<label class="d-inline">
					비밀번호
					<input type="password" class="form-control" id="password" name="password" placeholder="비밀번호">
				</label>
			</div>
			<div class="d-grid mb-3">
				<button type="button" class="btn btn-dark" id="signIn">로그인</button>
			</div>
			
			<div class="d-grid mb-3">
				<button type="button" class="btn btn-dark" id="signUp">이메일로 회원가입</button>
			</div>
		</form>
	</div>
</div>
<script>
    $(()=>{
        const userdata = new Object(); // 사용자의 정보를 저장할 객체를 생성합니다.


        const joinForm = document.querySelector("#login-form"); /*회원가입 양식 폼 선택*/

        const alertPlaceholder = document.getElementById('liveAlertPlaceholder'); /*경고창 위치 마커 선택*/

        // 알림 메시지를 추가하는 함수입니다.
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





            // 알림 메시지 1.2초 지속하고 서서히 지우기 함수입니다.
            setTimeout(() => {
                wrapper.querySelector('.alert').classList.remove('show');
                wrapper.querySelector('.alert').classList.add('fade');
                setTimeout(() => {
                    wrapper.remove();
                }, 100); // fade-out 효과를 위해 약간의 지연을 줍니다.
            }, 1200);
        }


        $("#email").on("keydown", (e) => {
            if(e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                $("#signIn").click();
            }
        });


        $("#password").on("keydown", (e) => {
            if(e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                $("#signIn").click();
            }
        });



        $("#signIn").on("click", (e) => {

            // 이메일 미 입력시
            if($("#email").val() === '') {
                appendAlert('이메일를 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            const getemail = document.getElementById("email");
            // userdata.email = getemail.value;

            // 비밀번호 미 입력시
            if($("#password").val() === '') {
                appendAlert('비밀번호를 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            const getpassword = document.getElementById("password");

            // if($("#email").val() !== 'helldive@naver.com') {
            if($("#email").val() !== 'bitcamp502@naver.com') {
                appendAlert('이메일이나 비밀번호에 문제가있습니다.', 'success')
                e.preventDefault();
                return;
            }
            // if($("#password").val() !== 'helldive@2') {
            if($("#password").val() !== '1') {
                appendAlert('이메일이나 비밀번호에 문제가있습니다.', 'success')
                e.preventDefault();
                return;
            }

            // 오브젝트에 입력
            userdata.email = getemail.value;
            userdata.password = getpassword.value;
            // 사용자의 정보를 콘솔에 출력합니다. 테스트용
            userdata.info = function() {
                console.log(`이메일: ${this.email}`);
                console.log(`비밀번호: ${this.password}`);
            }
            userdata.info();

            window.location.href='main.html';
        });

        $('#signUp').on('click',(e)=>{
            window.location.href='Register.html';
        });
































        // $('#signIn').on('click',(e)=>{
        //    window.location.href='base.html';
        // });
        // $('#signInEmail').on('click',(e)=>{
        //     window.location.href='Register.html';
        // });

    });
</script>

</body>
</html>