document.addEventListener('DOMContentLoaded', function () {

    // 그리드 컨테이너 클릭시 loadShadowContent 호출
    const portfolioContainer = document.getElementById('portfolioContainer');
    if (portfolioContainer) {
        portfolioContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('portfolio-img')) {
                let index = e.target.getAttribute('data-index');
                var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                var portfolio = portfolioData[index];
                if (portfolio) {
                    loadShadowContent(portfolio, index);
                }
            }
        });
    }

    // 포트폴리오 데이터를 인자로 받아서 shadow dom 객체를 dom tree에 추가하는 메소드
    function loadShadowContent(portfolio, index) {

        const shadowHost = document.getElementById('modalPortfolioShadowHost');
        const shadowRoot = shadowHost.shadowRoot || shadowHost.attachShadow({ mode: 'open' });

        // Clear existing content
        shadowRoot.innerHTML = '';

        // Create a container for the external content
        const contentContainer = document.createElement('div');
        
        // Construct the HTML content
        const htmlContent = `
            <style>${portfolio.cssContent}</style>
            ${portfolio.htmlContent}
            <script>
                ${portfolio.jsContent}
            </script>
        `;
        contentContainer.innerHTML = htmlContent;

        // Append the external content to the shadow root
        shadowRoot.appendChild(contentContainer);

        // 댓글창 열때마다 초기화
        const modalCommentMain = document.getElementById('modalCommentMain');
        if (modalCommentMain) {
            modalCommentMain.innerHTML = '';

            // 제일 위 댓글은 소개글
            addComment(portfolio.portfolioDescription);
            // 포트폴리오에 저장되어 있는 코멘트를 등록
            for (let i = 0; i < portfolio.comments.length; i++) {
                addComment(portfolio.comments[i]);
            }
        }

        // 모달 오버레이 표시
        const modalPortfolioOverlay = document.getElementById('modalPortfolioOverlay');
        if (modalPortfolioOverlay) {
            modalPortfolioOverlay.classList.add('modal-portfolio-overlay-show');
            // 전체화면의 스크롤은 모달이 떠있을 때는 사용 불가
            document.body.style.overflow = 'hidden';
        }

        // 댓글 입력 이벤트 핸들러 설정
        const modalCommentInput = document.getElementById('modalCommentInput');
        if (modalCommentInput) {
            modalCommentInput.setAttribute('data-index', index);  // 인덱스 값 설정
            modalCommentInput.addEventListener('keypress', function (e) {
                if (e.key.toLowerCase() === "enter") {
                    e.preventDefault();
                    const comment = this.value.trim();
                    if (comment) {
                        addComment(comment);
                        // 댓글 입력창 비우기
                        this.value = '';
                        // 포트폴리오 데이터에 댓글 추가
                        // 로컬 스토리지의 한계상 하나만 수정이 불가능하고 모든 데이터를 다시 받아와서
                        // 하나만 수정하고 다시 집어넣음
                        // 비동기적인 처리 중 index가 변할 수 있으므로 setAttribute('data-index', index)
                        // 를 통해 강제 동기적 처리
                        var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                        var currentPortfolio = portfolioData[parseInt(modalCommentInput.getAttribute('data-index'))];
                        if (Array.isArray(currentPortfolio.comments)) {
                            currentPortfolio.comments.push(comment);
                        } else {
                            currentPortfolio.comments = [comment];
                        }
                        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                        console.log('Updated Comments:', currentPortfolio.comments);
                    }
                }
            }, { once: true });
        }
    }

    // 코멘트를 인자로 받아서 댓글창에 띄워주는 함수
    function addComment(comment) {
        const commentElement = `<div class="modal-comment">
                <div class="modal-comment-user-logo"></div>
                <div class="modal-comment-main">
                    <div class="modal-comment-main-userid"><strong>cat1</strong></div>
                    <div class="modal-comment-main-content">${comment}</div>
                </div>
            </div>`;
        document.getElementById('modalCommentMain').insertAdjacentHTML('beforeend', commentElement);
    }

    // 모달이 떴을 때 shadow host 외부를 클릭하면 닫히는 방식으로 이벤트 핸들러 추가
    document.getElementById('modalPortfolioOverlay').addEventListener('click', function (e) {
        if (e.target.id === 'modalPortfolioOverlayBond' || e.target.id === 'modalPortfolioOverlay') {
            document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
            document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
            document.getElementById('modalPortfolioShadowHost').classList.remove('modal-portfolio-shadow-host-faded');
            // 전체화면의 스크롤 복구
            document.body.style.overflow = '';
        }
    });

    // openBtn과 코멘트창이 스크롤시 따라옴
    document.getElementById('modalPortfolioOverlay').addEventListener('scroll', function (e) {
        const scrollTop = this.scrollTop;
        document.getElementById('modalCommentOpenBtnSection').style.top = scrollTop + 'px';
        document.getElementById('modalCommentSection').style.top = scrollTop + 'px';
    });

    // openBtn을 누르면 코멘트창이 나타나고 뒤 배경 불투명도 증가
    document.getElementById('modalCommentOpenBtn').addEventListener('click', function (e) {
        document.getElementById('modalCommentSection').classList.add('modal-comment-section-active');
        document.getElementById('modalPortfolioShadowHost').classList.add('modal-portfolio-shadow-host-faded');
    });

    // closeBtn을 누르면 코멘트창이 사라지고 뒤 배경 불투명도 감소
    document.getElementById('modalCommentCloseBtn').addEventListener('click', function (e) {
        document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
        document.getElementById('modalPortfolioShadowHost').classList.remove('modal-portfolio-shadow-host-faded');
    });

    // 현재의 좋아요 수를 댓글창에 표시
    let currLikeCnt = 180;
    document.getElementById('modalLikeCntText').innerHTML = `<p> 좋아요 ${currLikeCnt}</p>`;

    // 좋아요 하트 클릭시 색이 빨강으로 바뀌고 좋아요 수 증가
    document.querySelector('.modal-like-logo svg').addEventListener('click', function (e) {
        if (this.querySelector('path').classList.toggle('filled')) {
            currLikeCnt++;
            document.getElementById('modalLikeCntText').innerHTML = `<p> 좋아요 ${currLikeCnt}</p>`;
        } else {
            currLikeCnt--;
            document.getElementById('modalLikeCntText').innerHTML = `<p> 좋아요 ${currLikeCnt}</p>`;
        }
    });

    // 댓글 헤더의 옵션버튼 클릭하면 옵션창이 뜸
    document.getElementById('modalCommentHeaderOptionBtn').addEventListener('click', function (e) {
        document.getElementById('modalOptions').classList.add('modal-options-active');
    });

    // 옵션창 외부 클릭시 옵션창 닫힘
    document.getElementById('modalOptions').addEventListener('click', function (e) {
        if (e.target === document.getElementById('modalOptions'))
            document.getElementById('modalOptions').classList.remove('modal-options-active');
    });

    // 취소 클릭시도 옵션창 닫힘
    document.getElementById('modalOptionsItemCancle').addEventListener('click', function (e) {
        document.getElementById('modalOptions').classList.remove('modal-options-active');
    });

    // 삭제 클릭시 정말로 삭제하는지 물어봄
    document.getElementById('modalOptionsItemDelete').addEventListener('click', function (event) {
        window.alert("정말로 삭제하시겠습니까?");
    });

    // 신고 클릭시 신고하는 이유 물어봄
    document.getElementById('modalOptionsItemReport').addEventListener('click', function (event) {
        window.alert("신고하시는 이유가 무엇인가요?");
    });

    // 수정 클릭시 수정하는 모달
    document.getElementById('modalOptionsItemModify').addEventListener('click', function (event) {
        document.getElementById('modalModify').classList.add('modal-modify-active');
    });

});
