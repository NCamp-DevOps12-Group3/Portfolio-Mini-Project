document.addEventListener('DOMContentLoaded', function () {

            let currentPortfolioIndex = null;

            // 업로드 모달에서 썸네일 이미지가 올라갔을때 (change) 실행되는 콜백
            document.getElementById('uploadThumbnailImage').addEventListener('change', function () {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var upload_thumbnailPreview = document.getElementById('uploadThumbnailPreview');
                    upload_thumbnailPreview.src = e.target.result;
                    upload_thumbnailPreview.style.display = 'block';
                };
                reader.readAsDataURL(this.files[0]);
            });

            $('#uploadModal').on('hidden.bs.modal', function () {
                // 폼을 초기화
                $('#uploadForm')[0].reset();
                // 썸네일 미리보기도 초기화
                var thumbnailPreview = document.getElementById('uploadThumbnailPreview');
                thumbnailPreview.src = '';
                thumbnailPreview.style.display = 'none';
            }); 

            // 업로드 버튼 클릭(submit)시 실행되는 콜백
            document.getElementById('uploadForm').addEventListener('submit', function (e) {

                e.preventDefault();

                // 실제 로컬 스토리지 저장 형태는 [{...}, {...}, {...}] 형태
                var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');

                // 포트폴리오 데이터 형식 지정
                // html, css, js, 썸네일 이미지, 소개글, 태그, 댓글
                var newPortfolio = {
                    htmlContent: '',
                    cssContent: '',
                    jsContent: '',
                    thumbnailImage: '',
                    portfolioDescription: document.getElementById('uploadPortfolioDescription').value,
                    portfolioTags: document.getElementById('uploadPortfolioTags').value,
                    comments: []
                };

                // FileReader 객체 생성
                var thumbnailReader = new FileReader();

                // thumbnailReader의 onload 이벤트시 콜백함수 선언
                thumbnailReader.onload = function (e) {
                    newPortfolio.thumbnailImage = e.target.result;

                    var files = document.getElementById('uploadCodeFiles').files;
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
                                    newPortfolio.htmlContent = e.target.result;
                                } else if (file.name.endsWith('.css')) {
                                    newPortfolio.cssContent = e.target.result;
                                } else if (file.name.endsWith('.js')) {
                                    newPortfolio.jsContent = e.target.result;
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
                        portfolioData.push(newPortfolio);
                        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                        alert('대기열에 등록되었습니다! 감사합니다.');
                        $('#uploadModal').modal('hide');
                        document.getElementById('uploadForm').reset();
                        document.getElementById('uploadThumbnailPreview').style.display = 'none';
                        loadPortfolios();
                    }).catch(function (error) {
                        console.error('파일 읽기 중 오류 발생:', error);
                    });
                };

                thumbnailReader.readAsDataURL(document.getElementById('uploadThumbnailImage').files[0]);
            });

            // 포트폴리오 로드하는 로직
            function loadPortfolios() {
                var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                var portfolioContainer = document.getElementById('portfolioContainer');
                if (portfolioContainer) {
                    portfolioContainer.innerHTML = ''; // 기존 항목을 비움

                    portfolioData.reverse().forEach(function (portfolio, index) {
                        var portfolioItem = `
                            <div class="col-md-3 portfolio-item">
                                <img src="${portfolio.thumbnailImage}" alt="Portfolio ${index + 1}" class="portfolio-img" data-index="${portfolioData.length - 1 - index}">
                            </div>
                        `;
                        portfolioContainer.insertAdjacentHTML('beforeend', portfolioItem);
                    });
                }
            }

            // 현재 저장되어 있는 모든 포트폴리오 표시
            loadPortfolios();

            // 포트폴리오 로드하는 로직에서 loadShadowContent 호출을 loadIframeContent로 변경
            portfolioContainer.addEventListener('click', function (e) {
                if (e.target.classList.contains('portfolio-img')) {
                    let index = e.target.getAttribute('data-index');
                    var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                    var portfolio = portfolioData[index];
                    if (portfolio) {
                        currentPortfolioIndex = index;
                        loadIframeContent(portfolio, index);
                    }
                }
            });


            function loadIframeContent(portfolio, index) {
                const iframe = document.getElementById('modalPortfolioIframe');
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            
                window.addEventListener('wheel', (event) => {
                    if (iframeDocument) {
                        iframeDocument.documentElement.scrollTop += event.deltaY;
                    }
                });
            
                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>${portfolio.cssContent}
                        body::-webkit-scrollbar {
                        display: none;
                        }</style>
                    </head>
                    <body>
                        ${portfolio.htmlContent} 
                         <script type="text/javascript">
                            ${portfolio.jsContent}
                        <\/script>
                    </body>
                    </html>
                `;
            
                // Write the HTML content to the iframe
                iframeDocument.open();
                iframe.srcdoc = htmlContent;
                iframeDocument.close();

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
                            }
                        }
                    });
                }
            }

               // iframe 외부 스크롤 이벤트 핸들러 설정
               window.addEventListener('wheel', function(event) {
                const iframe = document.getElementById('modalPortfolioIframe');
                if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    iframeDoc.documentElement.scrollTop += event.deltaY;
                }
                }
            });
            

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

            window.addEventListener('click', function(e) {
                console.log('Clicked element:', e.target.id);
            });

            // 모달이 떴을 때 iframe 외부를 클릭하면 닫히는 방식으로 이벤트 핸들러 추가
            document.getElementById('modalPortfolioOverlay').addEventListener('click', function (e) {
                if (e.target.id === 'modalPortfolioOverlayBond' || e.target.id === 'modalPortfolioOverlay') {
                    document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
                    document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
                    document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
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
                document.getElementById('modalPortfolioIframe').classList.add('modal-portfolio-iframe-faded');
            });

            // closeBtn을 누르면 코멘트창이 사라지고 뒤 배경 불투명도 감소
            document.getElementById('modalCommentCloseBtn').addEventListener('click', function (e) {
                document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
                document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
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
                document.getElementById('modalOptionsOverlay').classList.add('modal-options-active');
            });

            // 옵션창 외부 클릭시 옵션창 닫힘
            document.getElementById('modalOptionsOverlay').addEventListener('click', function (e) {
                if (e.target === document.getElementById('modalOptions'))
                    document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
            });

            // 취소 클릭시도 옵션창 닫힘
            document.getElementById('modalOptionsItemCancle').addEventListener('click', function (e) {
                document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
            });

            // 삭제 클릭시 삭제 모달 열림
            document.getElementById('modalOptionsItemDelete').addEventListener('click', function (event) {
                document.getElementById('modalDelete').classList.add('modal-delete-active');
            });

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
                        document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
                        document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
                        document.getElementById('modalDelete').classList.remove('modal-delete-active');

                        // 포트폴리오 목록 업데이트
                        loadPortfolios();

                        currentPortfolioIndex = null;
                    }
                }
            });

            // 아니오 클릭시 옵션창까지 꺼짐
            document.getElementById('modalDeleteBtnNo').addEventListener('click', function (event) {
                document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
                document.getElementById('modalDelete').classList.remove('modal-delete-active');
            });

            // 신고 클릭시 신고하는 이유 물어봄
            document.getElementById('modalOptionsItemReport').addEventListener('click', function (event) {
                window.alert("신고하시는 이유가 무엇인가요?");
            });

            // 수정 클릭시 수정하는 모달 열기
            document.getElementById('modalOptionsItemModify').addEventListener('click', function (event) {
                document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
                var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                var portfolio = portfolioData[currentPortfolioIndex];
                if (portfolio) {
                    // 수정 폼에 기존 포트폴리오 데이터 채우기
                    document.getElementById('modifyPortfolioDescription').value = portfolio.portfolioDescription;
                    document.getElementById('modifyPortfolioTags').value = portfolio.portfolioTags;
                    var thumbnailPreview = document.getElementById('modifyThumbnailPreview');
                    thumbnailPreview.src = portfolio.thumbnailImage;
                    thumbnailPreview.style.display = 'block';

                    // 수정 모달 열기
                    var modifyModal = new bootstrap.Modal(document.getElementById('modifyModal'));
                    modifyModal.show();
                }
            });

            // 썸네일 이미지 변경 시 미리보기 업데이트
            document.getElementById('modifyThumbnailImage').addEventListener('change', function () {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var thumbnailPreview = document.getElementById('modifyThumbnailPreview');
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
                    portfolio.portfolioDescription = document.getElementById('modifyPortfolioDescription').value;
                    portfolio.portfolioTags = document.getElementById('modifyPortfolioTags').value;

                    var files = document.getElementById('modifyCodeFiles').files;
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
                        if (document.getElementById('modifyThumbnailImage').files[0]) {
                            var thumbnailReader = new FileReader();
                            thumbnailReader.onload = function (e) {
                                portfolio.thumbnailImage = e.target.result;
                                saveUpdatedPortfolioData(portfolioData);
                            };
                            thumbnailReader.readAsDataURL(document.getElementById('modifyThumbnailImage').files[0]);
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
                document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
                document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
                loadPortfolios();
            }
        });
