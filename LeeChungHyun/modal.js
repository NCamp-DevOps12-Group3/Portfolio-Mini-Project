document.addEventListener('DOMContentLoaded', function () {

    let currentPortfolioIndex = null;

    // 그리드 컨테이너 클릭시 loadShadowContent 호출
    const portfolioContainer = document.getElementById('portfolioContainer');
    if (portfolioContainer) {
        portfolioContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('portfolio-img')) {
                let index = e.target.getAttribute('data-index');
                var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                var portfolio = portfolioData[index];
                if (portfolio) {
                    currentPortfolioIndex = index;
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

    // 삭제 클릭시 삭제 모달 열림
    document.getElementById('modalOptionsItemDelete').addEventListener('click', function (event) {
        document.getElementById('modalDelete').classList.add('modal-delete-active');
    });

    // 포트폴리오 로드하는 로직
    function loadPortfolios() {
        var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        var portfolioContainer = document.getElementById('portfolioContainer');
        if (portfolioContainer) {
            portfolioContainer.innerHTML = ''; // 기존 항목을 비움

            portfolioData.forEach(function (portfolio, index) {
                var portfolioItem = `
            <div class="col-md-3 portfolio-item">
                <img src="${portfolio.thumbnailImage}" alt="Portfolio ${index + 1}" class="portfolio-img" data-index="${index}">
            </div>
        `;
                portfolioContainer.insertAdjacentHTML('beforeend', portfolioItem);
            });
        }
    }

   // 예 클릭시 실제로 삭제되고 모달 전부 꺼짐
   document.getElementById('modalDeleteBtnYes').addEventListener('click', function (event) {
    if (currentPortfolioIndex !== null) {
        var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        if (portfolioData.length > currentPortfolioIndex) {
            portfolioData.splice(currentPortfolioIndex, 1);
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
            alert('포트폴리오가 삭제되었습니다.');

            // 모달 전부 꺼짐
            document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
            document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
            document.getElementById('modalPortfolioShadowHost').classList.remove('modal-portfolio-shadow-host-faded');
            document.getElementById('modalOptions').classList.remove('modal-options-active');
            document.getElementById('modalDelete').classList.remove('modal-delete-active');

            // 포트폴리오 목록 업데이트
            loadPortfolios();

            currentPortfolioIndex = null;
        }
    }

    });

    // 아니오 클릭시 옵션창까지 꺼짐
    document.getElementById('modalDeleteBtnNo').addEventListener('click', function (event) {
        document.getElementById('modalOptions').classList.remove('modal-options-active');
        document.getElementById('modalDelete').classList.remove('modal-delete-active');
    });


    // 신고 클릭시 신고하는 이유 물어봄
    document.getElementById('modalOptionsItemReport').addEventListener('click', function (event) {
        window.alert("신고하시는 이유가 무엇인가요?");
    });

    // 수정 클릭시 수정하는 모달
    document.getElementById('modalOptionsItemModify').addEventListener('click', function (event) {
        document.getElementById('modalOptions').classList.remove('modal-options-active');
    });

    // 수정 클릭시 수정하는 모달 열기
    document.getElementById('modalOptionsItemModify').addEventListener('click', function (event) {
        var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        var portfolio = portfolioData[currentPortfolioIndex];
        if (portfolio) {
            // 수정 폼에 기존 포트폴리오 데이터 채우기
            document.getElementById('portfolioDescription').value = portfolio.portfolioDescription;
            document.getElementById('portfolioTags').value = portfolio.portfolioTags;
            var thumbnailPreview = document.getElementById('thumbnailPreview');
            thumbnailPreview.src = portfolio.thumbnailImage;
            thumbnailPreview.style.display = 'block';

            // 수정 모달 열기
            var modifyModal = new bootstrap.Modal(document.getElementById('modifyModal'));
            modifyModal.show();
        }
    });

    // 썸네일 이미지 변경 시 미리보기 업데이트
    document.getElementById('thumbnailImage').addEventListener('change', function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            var thumbnailPreview = document.getElementById('thumbnailPreview');
            thumbnailPreview.src = e.target.result;
            thumbnailPreview.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    });

    // 수정 폼 제출 시 로컬 스토리지 업데이트
    document.getElementById('modifyForm').addEventListener('submit', function (e) {
        e.preventDefault();

        var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        var portfolio = portfolioData[currentPortfolioIndex];
        if (portfolio) {
            portfolio.portfolioDescription = document.getElementById('portfolioDescription').value;
            portfolio.portfolioTags = document.getElementById('portfolioTags').value;

            var files = document.getElementById('codeFiles').files;
            var fileReaders = [];

            var htmlFiles = [];
            var cssFiles = [];
            var jsFiles = [];

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.name.endsWith('.html')) {
                    htmlFiles.push(file);
                } else if (file.name.endsWith('.css')) {
                    cssFiles.push(file);
                } else if (file.name.endsWith('.js')) {
                    jsFiles.push(file);
                }
            }

            var orderedFiles = htmlFiles.concat(cssFiles, jsFiles);

            orderedFiles.forEach(function (file) {
                var reader = new FileReader();

                var promise = new Promise(function (resolve, reject) {
                    reader.onload = function (e) {
                        if (file.name.endsWith('.html')) {
                            portfolio.htmlContent = e.target.result;
                        } else if (file.name.endsWith('.css')) {
                            portfolio.cssContent = e.target.result;
                        } else if (file.name.endsWith('.js')) {
                            portfolio.jsContent = e.target.result;
                        }
                        resolve();
                    };

                    reader.onerror = function (e) {
                        reject(e);
                    };
                });

                reader.readAsText(file);
                fileReaders.push(promise);
            });

            Promise.all(fileReaders).then(function () {
                if (document.getElementById('thumbnailImage').files[0]) {
                    var thumbnailReader = new FileReader();
                    thumbnailReader.onload = function (e) {
                        portfolio.thumbnailImage = e.target.result;
                        saveUpdatedPortfolioData(portfolioData);
                    };
                    thumbnailReader.readAsDataURL(document.getElementById('thumbnailImage').files[0]);
                } else {
                    saveUpdatedPortfolioData(portfolioData);
                }
            }).catch(function (error) {
                console.error('파일 읽기 중 오류 발생:', error);
            });
        }
    });

    function saveUpdatedPortfolioData(portfolioData) {
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        alert('포트폴리오가 수정되었습니다.');
        
        $('#modifyModal').modal('hide');
        document.querySelector('.modal-backdrop').remove();
        document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
            document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
            document.getElementById('modalPortfolioShadowHost').classList.remove('modal-portfolio-shadow-host-faded');
            document.getElementById('modalOptions').classList.remove('modal-options-active');
        loadPortfolios();
    }
});
