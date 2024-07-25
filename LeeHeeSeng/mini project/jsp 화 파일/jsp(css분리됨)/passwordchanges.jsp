<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>비밀번호 변경</title>
	<link href="css/bootstrap.css" rel="stylesheet">
	<script src="js/jquery-3.7.1.min.js"></script>
	<script src="js/bootstrap.bundle.js"></script>
	<style>
 
	</style>
</head>
<body>
<div id="liveAlertPlaceholder" ></div><!-- 경고창 위치 마커-->
<div class="container">
	<div class="card">
		
		<p class="h5 card-title text-center">비밀번호 변경</p><!-- 회원가입 양식 텍스트 -->
		<p class="text-center" >새 비밀번호 입력</p><!-- 회원가입 양식 텍스트 -->
		<form  action="" id="login-form">
			<div style="height: 60px; margin-bottom: 50px;">비밀번호
				<input type="password" class="form-control" id="password" name="password" placeholder="특수문자, 숫자, 영문자 조합의 8자리 이상">
				<div id="PasswordAlertholder"></div>
			</div>
			<div style="height: 60px; margin-bottom: 50px;">비밀번호 확인
				<input type="password" class="form-control" id="passwordChk" name="passwordChk" placeholder="비밀번호 확인 ">
				<div id="PasswordChkAlertholder"></div>
			</div>
			
			<div class="d-grid mb-3">
				<button type="button" class="btn btn-dark" id="ChangePassword">비밀번호 변경</button>
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

        const alertPlaceholder = document.getElementById('liveAlertPlaceholder'); /*경고창 위치 마커 선택*/
        const apassword = document.querySelector("input[name='password']"); /*비밀번호 선택*/
        const apasswordchk = document.querySelector("input[name='passwordChk']"); /*비밀번호 확인 선택*/
        const PasswordAlertholder = document.getElementById('PasswordAlertholder'); /*경고창 위치 마커 선택*/
        const PasswordChkAlertholder = document.getElementById('PasswordChkAlertholder'); /*경고창 위치 마커 선택*/




        const PasswordappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = PasswordAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {PasswordAlertholder.removeChild(alerts[0]);}
            PasswordAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

        const PasswordChkappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = PasswordChkAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {PasswordChkAlertholder.removeChild(alerts[0]);}
            PasswordChkAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

        let passwordValidation = false; // 비밀번호 유효성 검사를 위한 변수입니다.

        // 비밀번호 입력란에 조건을 만족못하고 포커스를 잃었을 때 발생하는 이벤트입니다.
        apassword.addEventListener("blur", (e) => {
            let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,15}$/;
            if(!reg.test(e.target.value)) {
                PasswordappendAlert('비밀번호는 특수문자, 숫자, 영문자 조합의 8자리 이상으로 지정하세요.', 'success');
                passwordValidation = false;
                return;
            }
            passwordValidation = true;
        });
        let passwordChkValidation = false; // 비밀번호 유효성 검사를 위한 변수입니다.
        // 비밀번호 확인 입력란에 조건을 만족못하고 포커스를 잃었을 때 발생하는 이벤트입니다.
        apasswordchk.addEventListener("blur", (e) => {
            console.log(e.target.value);
            if($("#password").val() !== $("#passwordChk").val()) {
                PasswordChkappendAlert('비밀번호가 비밀번호확인과 일치하지 않습니다.', 'success');
                passwordChkValidation = false;

                return;
            }
            passwordChkValidation = true;
        });





        $("#password").on("keydown", (e) => {
            if(e.key.toLowerCase() === 'enter') {
                $("#ChangePassword").click();
            }
        });
        $("#passwordChk").on("keydown", (e) => {
            if(e.key.toLowerCase() === 'enter') {
                $("#ChangePassword").click();
            }
        });


        $("#ChangePassword").on("click", (e) => {
            // 비밀번호 미 입력시
            if($("#password").val() === '') {
                PasswordappendAlert('비밀번호를 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            // 비밀번호확인 미 입력시
            if($("#passwordChk").val() === '') {
                PasswordChkappendAlert('비밀번호확인을  입력하세요', 'success');
                e.preventDefault();
                return;
            }
            //비밀번호와 비밀번호확인 불일치시
            if($("#password").val() !== $("#passwordChk").val()) {
                PasswordChkappendAlert('비밀번호가 일치하지 않습니다.', 'success');
                e.preventDefault();
                return;
            }
            const getpassword = document.getElementById("password");
            userdata.password = getpassword.value;



            //비밀번호와 서버의 비밀번호 불일치시
            // if($("#password").val() != "helldive@2") {
            //         appendAlert('비밀번호가 일치하지 않습니다.', 'success');
            //         e.preventDefault();
            //         return;
            //     }

            userdata.info = function() {
                console.log(`비밀번호: ${this.password}`);
            }
            userdata.info();

            window.location.href='setting.html';
        });
    });
</script>
</body>
</html>