<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>회원가입</title>
	<link href="css/bootstrap.css" rel="stylesheet">
	<script src="js/jquery-3.7.1.min.js"></script>
	<script src="js/bootstrap.bundle.js"></script>
	<style>
 
	
	</style>
</head>
<body>



<div class="container">
	
	<div class="card"><!-- 회원가입 양식 -->
		<p class="h5 card-title text-center">계정생성</p><!-- 회원가입 양식 텍스트 -->
		<p class="text-center" >이메일로 회원가입 하기</p><!-- 회원가입 양식 텍스트 -->
		<form  action="" id="login-form"><!-- 회원가입 양식 폼 -->
			<div class="mb-3"><!-- 회원가입 양식 입력창 -->
				<div style="height: 60px; margin-bottom: 25px;">닉네임
					<input type="text" class="form-control" id="Nickname" name="Nickname" placeholder="닉네임 ">
					<div id="NicknameAlertholder"></div>
				</div>
				
				<div style="height: 60px; margin-bottom: 25px;">이름
					<input type="text" class="form-control" id="Name" name="Name" placeholder="이름">
					<div id="NameAlertholder"></div>
				</div>
				<div style="height: 60px; margin-bottom: 25px;">성별
					<div class="types">
						<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
							<input type="radio" class="btn-check" name="btngender" id="gender-male" value="gender-male" autocomplete="off" >
							<label class="btn btn-outline-dark" for="gender-male">남성</label>
							
							<input type="radio" class="btn-check" name="btngender" id="gender-female" value="gender-female" autocomplete="off">
							<label class="btn btn-outline-dark" for="gender-female">여성</label>
						</div>
					</div>
					<div id="genderAlertholder"></div>
				</div>
				<div style="height: 60px; margin-bottom: 25px;">소속
					<input type="text" class="form-control" id="job" name="job" placeholder="소속((예)학생,직장인,등... )">
					<div id="JopAlertholder"></div>
				</div>
				
				
				<div style="height: 60px; margin-bottom: 25px;">전화번호
					<input type="tel" class="form-control" id="tel" name="tel" pattern="\d{3}\d{4}\d{4}" placeholder="000-0000-0000 -없이입력" required>
					<div id="TelAlertholder"></div>
				</div>
				<div style="height: 60px; margin-bottom: 25px;">이메일
					<input type="email" class="form-control" id="email" name="email" placeholder="이메일">
					<div id="EmailAlertholder"></div>
				</div>
				<div style="height: 60px; margin-bottom: 50px;">비밀번호
					<input type="password" class="form-control" id="password" name="password" placeholder="특수문자, 숫자, 영문자 조합의 8자리 이상">
					<div id="PasswordAlertholder"></div>
				</div>
				<div style="height: 60px; margin-bottom: 25px;">비밀번호 확인
					<input type="password" class="form-control" id="passwordChk" name="passwordChk" placeholder="비밀번호 확인 ">
					<div id="PasswordChkAlertholder"></div>
				</div>
				
				<div style="height: 60px; margin-bottom: 40px;">
					<div class="types" style="text-align: center;">
						
						<br>
						<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
							<input type="radio" class="btn-check" name="btnuser" id="individualuser" value="individualuser" autocomplete="off" >
							<label class="btn btn-outline-dark" for="individualuser">개인 사용자</label>
							
							
							
							<input type="radio" class="btn-check" name="btnuser" id="corporateusers" value="corporateusers" autocomplete="off">
							<label class="btn btn-outline-dark" for="corporateusers">기업 사용자</label>
						
						</div>
					</div>
					<div id="UserAlertholder"></div>
				</div>
			</div>
			<div class="d-grid mb-3"><!-- 회원가입 양식 텍스트 보내기버튼 -->
				<button type="button" class="btn btn-dark" id="signUp">회원가입</button>
			</div>
		</form>
	
	</div>
</div>
<script>
    $(()=>{
        const userdata = new Object(); // 사용자의 정보를 저장할 객체를 생성합니다.

        // HTML 요소를 선택합니다.
        const aNickname = document.querySelector("input[name='Nickname']"); /*닉네임 선택*/
        const aName = document.querySelector("input[name='Name']"); /*닉네임 선택*/
        const agender = document.querySelector("input[name='btngender']"); /*닉네임 선택*/
        const aTel = document.querySelector("input[name='tel']"); /*전화번호 선택*/
        const aemail = document.querySelector("input[name='email']"); /*이메일 선택*/
        const apassword = document.querySelector("input[name='password']"); /*비밀번호 선택*/
        const apasswordchk = document.querySelector("input[name='passwordChk']"); /*비밀번호 확인 선택*/
        const joinForm = document.querySelector("#login-form"); /*회원가입 양식 폼 선택*/
        const NicknameAlertholder = document.getElementById('NicknameAlertholder'); /*경고창 위치 마커 선택*/
        const NameAlertholder = document.getElementById('NameAlertholder'); /*경고창 위치 마커 선택*/
        const GenderAlertholder = document.getElementById('genderAlertholder');
        const JobAlertholder = document.getElementById('JobAlertholder');
        const EmailAlertholder = document.getElementById('EmailAlertholder'); /*경고창 위치 마커 선택*/
        const PasswordAlertholder = document.getElementById('PasswordAlertholder'); /*경고창 위치 마커 선택*/
        const PasswordChkAlertholder = document.getElementById('PasswordChkAlertholder'); /*경고창 위치 마커 선택*/
        const UserAlertholder = document.getElementById('UserAlertholder'); /*경고창 위치 마커 선택*/


        // 알림 메시지를 추가하는 함수입니다.
        const NicknameappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = NicknameAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {NicknameAlertholder.removeChild(alerts[0]);}
            NicknameAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

        const NameappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = NameAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {NameAlertholder.removeChild(alerts[0]);}
            NameAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

        const GenderappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = GenderAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {GenderAlertholder.removeChild(alerts[0]);}
            GenderAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }



        const TelappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = TelAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {TelAlertholder.removeChild(alerts[0]);}
            TelAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

        const EmailappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = EmailAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {EmailAlertholder.removeChild(alerts[0]);}
            EmailAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

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

        const UserappendAlert = (message, type) => {
            const wrapper = document.createElement('div'); /*wrapper선언하고 div만들기*/
            wrapper.innerHTML = [  /*wrapper 의 내용물(String 배열) 넣기*/`<div class="alert " role="alert">`,
                /*div 열고 wrapper 스타일 부트스트랩*/` <div>${message}</div>`, /*wrapper에들어갈메세지*/'</div>'
                /*div닫기*/].join(''); /*위내용을 문자열로 바꾸기 */
            const alerts = UserAlertholder.querySelectorAll('.alert');
            if (alerts.length >= 1) {UserAlertholder.removeChild(alerts[0]);}
            UserAlertholder.append(wrapper); /*Alert holder 에 써 넣기*/
            setTimeout(() => { wrapper.remove();}, 5000);
        }

        let idValidation = false; // 아이디 유효성 검사를 위한 변수입니다.
        // 닉네임 입력란에 조건을 만족못하고  포커스를 잃었을 때 발생하는 이벤트입니다.
        aNickname.addEventListener("blur", (e) => {
            console.log(e.target.value);
            if(e.target.value.length < 8 || e.target.value.length > 20) {
                NicknameappendAlert('아이디는 8자리이상 20자이하로 지정해주세요.', 'success');
                idValidation = false;
                return;
            }
            idValidation = true;
        });

        let NameValidation = false; // 이름 유효성 검사를 위한 변수입니다.
        // 이름 입력란에 조건을 만족못하고  포커스를 잃었을 때 발생하는 이벤트입니다.
        aName.addEventListener("blur", (e) => {
            console.log(e.target.value);
            if(e.target.value === "") {
                NameappendAlert('이름을 입력 해주세요.', 'success');
                idValidation = false;
                return;
            }
            idValidation = true;
        });

        let TelValidation = false;
        // 전화번호 입력란에 조건을 만족못하고 포커스를 잃었을 때 발생하는 이벤트입니다.
        aTel.addEventListener("blur", (e) => {
            console.log(e.target.value);
            if(e.target.value.length < 11 || e.target.value.length > 11) {
                TelappendAlert('전화번호를 제대로입력해주세요.', 'success');
                TelValidation = false;
                return;
            }
            TelValidation = true;
        });

        let emailValidation = false;
        // 이메일 입력란에 조건을 만족못하고 포커스를 잃었을 때 발생하는 이벤트입니다.
        aemail.addEventListener("blur", (e) => {
            console.log(e.target.value);
            // 이메일 형식을 확인하는 정규 표현식
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailPattern.test(e.target.value)) {
                EmailappendAlert('올바른 이메일 형식을 입력해주세요.', 'success');
                emailValidation = false;
                return;
            }

            emailValidation = true;
        });

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

        // 조건을 만족못하고 회원가입 버튼 클릭 시 발생하는 이벤트입니다.
        $("#signUp").on("click", (e) => {
            // 닉네임 미 입력시
            if($("#Nickname").val() === '') {
                NicknameappendAlert('닉네임을 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            const getNickname = document.getElementById("Nickname");
            userdata.Nickname = getNickname.value;

            if($("#Name").val() === '') {
                NameappendAlert('이름을 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            const getName = document.getElementById("Name");
            userdata.Name = getName.value;




            //성별미입력시
            let genderTypeCtn = 0;

            $("input[name='btngender']").each(function() {
                console.log($("input[name='btngender']").is(":checked"));
                if($(this).is(":checked")) {
                    userdata.gentypetype = $(this).val();
                    genderTypeCtn++;
                }
            });

            if(genderTypeCtn === 0) {
                GenderappendAlert('성별 유형을 지정해주세요.', 'success');
                e.preventDefault();
                return;
            }


            // 전화번호 미 입력시
            if($("#tel").val() === '') {
                appendAlert('전화번호를 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            const gettel = document.getElementById("tel");
            let telValue = gettel.value.replace(/-/g, ''); // 하이픈 제거
            userdata.tel = telValue;
            // 이메일 미 입력시
            if($("#email").val() === '') {
                appendAlert('이메일를 입력하세요', 'success');
                e.preventDefault();
                return;
            }
            const getemail = document.getElementById("email");
            userdata.email = getemail.value;
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


            let userTypeCtn = 0;

            $("input[name='btnuser']").each(function() {
                console.log($("input[name='btnuser']").is(":checked"));
                if($(this).is(":checked")) {
                    userdata.usertype = $(this).val();
                    userTypeCtn++;
                }
            });

            if(userTypeCtn === 0) {
                UserappendAlert('사용자 유형을 지정해주세요.', 'success');
                e.preventDefault();
                return;
            }

            // 사용자의 정보를 콘솔에 출력합니다. 테스트용
            userdata.info = function() {
                console.log(`닉네임: ${this.Nickname}`);
                console.log(`닉네임: ${this.Name}`);
                console.log(`전화번호: ${this.tel}`);
                console.log(`이메일: ${this.email}`);
                console.log(`비밀번호: ${this.password}`);
            }
            userdata.info();

            // 이아래줄에 데이터베이스에 데이터보내기


            //로그인으로이동
            window.location.href='index.html';
        });
    });
</script>

</body>
</html>


