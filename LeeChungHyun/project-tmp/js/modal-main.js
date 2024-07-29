document.addEventListener('DOMContentLoaded', function () {

    // 댓글 헤더의 옵션버튼 클릭하면 옵션창이 뜸
    document.getElementById('modalCommentHeaderOptionBtn').addEventListener('click', function (e) {
        document.getElementById('modalOptionsOverlay').classList.add('modal-options-active');
    });


    let currentPortfolioIndex = null;

    // // 포트폴리오 이미지 클릭 시 모달 표시
    // document.querySelectorAll('.portfolio-item img').forEach(function (img) {
    //     img.addEventListener('click', function () {
    //         const index = this.getAttribute('data-index');
    //         const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
    //         const portfolio = portfolioData[index];
    //         currentPortfolioIndex = index;

    //         if (portfolio) {
    //             loadIframeContent(portfolio, index);
    //         }
    //     });
    // });

    // // 업로드 모달에서 썸네일 이미지가 올라갔을때 (change) 실행되는 콜백
    // document.getElementById('uploadThumbnailImage').addEventListener('change', function () {
    //     const reader = new FileReader();
    //     reader.onload = function (e) {
    //         const upload_thumbnailPreview = document.getElementById('uploadThumbnailPreview');
    //         upload_thumbnailPreview.src = e.target.result;
    //         upload_thumbnailPreview.style.display = 'block';
    //     };
    //     reader.readAsDataURL(this.files[0]);
    // });

    // $('#uploadModal').on('hidden.bs.modal', function () {
    //     // 폼을 초기화
    //     $('#uploadForm')[0].reset();
    //     // 썸네일 미리보기도 초기화
    //     const thumbnailPreview = document.getElementById('uploadThumbnailPreview');
    //     thumbnailPreview.src = '';
    //     thumbnailPreview.style.display = 'none';
    // }); 

    // // 업로드 버튼 클릭(submit)시 실행되는 콜백
    // document.getElementById('uploadForm').addEventListener('submit', function (e) {

    //     e.preventDefault();

    //     // 실제 로컬 스토리지 저장 형태는 [{...}, {...}, {...}] 형태
    //     const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');

    //     // 포트폴리오 데이터 형식 지정
    //     // html, css, js, 썸네일 이미지, 소개글, 태그, 댓글
    //     const newPortfolio = {
    //         htmlContent: '',
    //         cssContent: '',
    //         jsContent: '',
    //         thumbnailImage: '',
    //         portfolioDescription: document.getElementById('uploadPortfolioDescription').value,
    //         portfolioTags: document.getElementById('uploadPortfolioTags').value,
    //         comments: []
    //     };

    //     // FileReader 객체 생성
    //     const thumbnailReader = new FileReader();

    //     // thumbnailReader의 onload 이벤트시 콜백함수 선언
    //     thumbnailReader.onload = function (e) {
    //         newPortfolio.thumbnailImage = e.target.result;

    //         const files = document.getElementById('uploadCodeFiles').files;
    //         const fileReaders = [];

    //         const htmlFiles = [];
    //         const cssFiles = [];
    //         const jsFiles = [];

    //         for (let i = 0; i < files.length; i++) {
    //             const file = files[i];
    //             if (file.name.endsWith('.html')) {
    //                 htmlFiles.push(file);
    //             } else if (file.name.endsWith('.css')) {
    //                 cssFiles.push(file);
    //             } else if (file.name.endsWith('.js')) {
    //                 jsFiles.push(file);
    //             }
    //         }

    //         const orderedFiles = htmlFiles.concat(cssFiles, jsFiles);

    //         orderedFiles.forEach(function (file) {
    //             const reader = new FileReader();

    //             const promise = new Promise(function (resolve, reject) {
    //                 reader.onload = function (e) {
    //                     if (file.name.endsWith('.html')) {
    //                         newPortfolio.htmlContent = e.target.result;
    //                     } else if (file.name.endsWith('.css')) {
    //                         newPortfolio.cssContent = e.target.result;
    //                     } else if (file.name.endsWith('.js')) {
    //                         newPortfolio.jsContent = e.target.result;
    //                     }
    //                     resolve();
    //                 };

    //                 reader.onerror = function (e) {
    //                     reject(e);
    //                 };
    //             });

    //             reader.readAsText(file);
    //             fileReaders.push(promise);
    //         });

    //         Promise.all(fileReaders).then(function () {
    //             portfolioData.push(newPortfolio);
    //             localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    //             alert('대기열에 등록되었습니다! 감사합니다.');
    //             $('#uploadModal').modal('hide');
    //             document.getElementById('uploadForm').reset();
    //             document.getElementById('uploadThumbnailPreview').style.display = 'none';
    //             loadPortfolios();
    //         }).catch(function (error) {
    //             console.error('파일 읽기 중 오류 발생:', error);
    //         });
    //     };

    //     thumbnailReader.readAsDataURL(document.getElementById('uploadThumbnailImage').files[0]);
    // });

    function loadPortfolios() {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        const portfolioContainer = document.getElementById('portfolioContainer');
        if (portfolioContainer) {
            portfolioContainer.innerHTML = ''; // 기존 항목을 비움
    
            portfolioData.reverse().forEach(function (portfolio, index) {
                const portfolioItem = `
                      <div class="content-item-wrapper" style="border-bottom: gainsboro 1px solid;">


                                    <div class="content-item-header"
                                        style="padding: 5px; display:flex; align-items: center; padding-bottom:10px; margin-top: 5px;">
                                        <div class="content-item-header-user-logo" style="background-image: url('더미/img/cat1.jpg'); display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                height: 2vw;
                                                width : 2vw;
                                                border-radius: 50%;
                                                background-size: cover;
                                                flex-shrink: 0;">
                                        </div>
                                        <div class="content-item-header-main" style="display: flex;
                                                                flex-direction: column;
                                                                flex-grow: 1;">
                                            <div class="content-item-header-userid" style="font-size: 14px;
                                                            margin-left: 10px;">
                                                <strong>cat1</strong> <strong style="color: gray;">1주전</strong>
                                            </div>
                                            <div class="content-item-header-content" style="
                                                        font-size: 14px;
                                                        margin-left: 10px;">
                                                description1
                                            </div>
                                        </div>
                                    </div>


                                    <div class="content-item"
                                        style="background-image: url('${portfolio.thumbnailImage}'); background-size: cover; border-radius : 5px;" data-index="${portfolioData.length - 1 - index}">
                                    </div>


                                    <div class="content-item-footer"
                                        style="padding-top:10px; display: flex; flex-direction : column;">
                                        <div class="content-item-footer-logos" style="margin:1px;">
                                            <svg xmlns=" http://www.w3.org/2000/svg" width="24" height="24"
                                                fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16"
                                                style="margin-right : 3px;">
                                                <path
                                                    d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                fill="currentColor" class="bi bi-chat" viewBox="0 1 16 16"
                                                style="margin-right : 3px;">
                                                <path
                                                    d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
                                                <path
                                                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                            </svg>
                                        </div>
                                        <div class="content-item-footer-like" style="font-size: 0.8rem; margin:1px">
                                            <strong>좋아요 3만개 </strong>
                                        </div>
                                        <div class="content-item-footer-user" style="font-size: 0.8rem; margin:1px">
                                            <strong>cat1 : description1</strong>
                                        </div>
                                        <div class="content-item-footer-comment"
                                            style="font-size: 0.8rem; color : gray; margin:1px">
                                            <strong>댓글 3만개 모두 보기</strong>
                                        </div>
                                        <div class="content-item-footer-postcomment"
                                            style="font-size: 0.8rem; color : gray; margin:1px; margin-bottom:10px;">
                                            <strong>댓글 달기</strong>
                                        </div>
                                    </div>
                                </div>
                   
                `; 
                // <div class="col-md-3 portfolio-item" style="position: relative;">
                //         <img src="${portfolio.thumbnailImage}" alt="Portfolio ${index + 1}" class="portfolio-img" data-index="${portfolioData.length - 1 - index}">
                //         <div class="hover-content" id="hover-content-${portfolioData.length - 1 - index}" data-index="${portfolioData.length - 1 - index}"></div>
                //     </div>
                portfolioContainer.insertAdjacentHTML('beforeend', portfolioItem);
            });
        }
        // 포트폴리오 항목을 클릭했을 때 모달을 열도록 이벤트 리스너를 추가합니다.
        document.querySelectorAll('.content-item').forEach(function (item) {
            item.addEventListener('click', function () {
                console.log('ads');
                const index = this.getAttribute('data-index');
                console.log(this);
                console.log(index);
                const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                const portfolio = portfolioData[index];
                currentPortfolioIndex = index;

                if (portfolio) {
                    loadIframeContent(portfolio, index);
                }
            });
        });
    }
    
    // 현재 저장되어 있는 모든 포트폴리오 표시
    loadPortfolios();

    function loadIframeContent(portfolio, index) {
        const iframe = document.getElementById('modalPortfolioIframe');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
        // window.addEventListener('wheel', (event) => {
        //     if (iframeDocument && iframeDocument.documentElement) {
        //         iframeDocument.documentElement.scrollTop += event.deltaY;
        //     }
        // });
    
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

            const commentElement = `<div class="modal-comment">
                    <div class="modal-comment-user-logo" style="background-image: url('img/cat1.jpg');"></div>
                    <div class="modal-comment-main">
                        <div class="modal-comment-main-userid"><strong>cat1</strong></div>
                        <div class="modal-comment-main-content">${portfolio.portfolioDescription}</div>
                    </div>
                </div>`;
            document.getElementById('modalCommentMain').insertAdjacentHTML('beforeend', commentElement);

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
                        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                        const currentPortfolio = portfolioData[parseInt(modalCommentInput.getAttribute('data-index'))];
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

    function addComment(comment) {
        // 랜덤한 숫자(2~12) 생성
        const randomNumber = Math.floor(Math.random() * 11) + 2;
        const Id = `${randomNumber}`;
    
        const commentElement = `
            <div class="modal-comment">
                <div class="modal-comment-user-logo" style="background-image: url('img/cat${Id}.jpg');"></div>
                <div class="modal-comment-main">
                    <div class="modal-comment-main-userid"><strong>cat${Id}</strong></div>
                    <div class="modal-comment-main-content">${comment}</div>
                </div>
            </div>
        `;
    
        document.getElementById('modalCommentMain').insertAdjacentHTML('beforeend', commentElement);
    }

    // window.addEventListener('click', function(e) {
    //     console.log('Clicked element:', e.target.id);
    // });

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
        document.getElementById('modalCommentSection').style.top = scrollTop + 'px';
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
            const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
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
        console.log('asdsad');
        window.alert("신고하시는 이유가 무엇인가요?");
    });

    // 수정 클릭시 수정하는 모달 열기
    document.getElementById('modalOptionsItemModify').addEventListener('click', function (event) {
        console.log(currentPortfolioIndex);
        document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        const portfolio = portfolioData[currentPortfolioIndex];
        if (portfolio) {
            // 수정 폼에 기존 포트폴리오 데이터 채우기
            console.log(currentPortfolioIndex);
            document.getElementById('modifyPortfolioDescription').value = portfolio.portfolioDescription;
            document.getElementById('modifyPortfolioTags').value = portfolio.portfolioTags;
            const thumbnailPreview = document.getElementById('modifyThumbnailPreview');
            thumbnailPreview.src = portfolio.thumbnailImage;
            thumbnailPreview.style.display = 'block';

            // 수정 모달 열기
            const modifyModal = new bootstrap.Modal(document.getElementById('modifyModal'));
            modifyModal.show();
        }
    });

    // 썸네일 이미지 변경 시 미리보기 업데이트
    document.getElementById('modifyThumbnailImage').addEventListener('change', function () {
        const reader = new FileReader();
        reader.onload = function (e) {
            const thumbnailPreview = document.getElementById('modifyThumbnailPreview');
            thumbnailPreview.src = e.target.result;
            thumbnailPreview.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    });

    // 수정 폼 제출 시 로컬 스토리지 업데이트
    document.getElementById('modifyForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        const portfolio = portfolioData[currentPortfolioIndex];
        if (portfolio) {
            portfolio.portfolioDescription = document.getElementById('modifyPortfolioDescription').value;
            portfolio.portfolioTags = document.getElementById('modifyPortfolioTags').value;

            const files = document.getElementById('modifyCodeFiles').files;
            const fileReaders = [];

            const htmlFiles = [];
            const cssFiles = [];
            const jsFiles = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.name.endsWith('.html')) {
                    htmlFiles.push(file);
                } else if (file.name.endsWith('.css')) {
                    cssFiles.push(file);
                } else if (file.name.endsWith('.js')) {
                    jsFiles.push(file);
                }
            }

            const orderedFiles = htmlFiles.concat(cssFiles, jsFiles);

            orderedFiles.forEach(function (file) {
                const reader = new FileReader();

                const promise = new Promise(function (resolve, reject) {
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
                    const thumbnailReader = new FileReader();
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
        console.log("여");
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
