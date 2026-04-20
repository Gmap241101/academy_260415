        (function () {
            const loginForm = document.getElementById('loginForm');
            const userIdInput = document.getElementById('userId');
            const passwordInput = document.getElementById('password');
            const loginButton = document.getElementById('loginButton');

            const userIdError = document.getElementById('userIdError');
            const passwordError = document.getElementById('passwordError');

            let lastFocusedElement = null;

            function setFieldError(input, errorElement, message) {
                input.setAttribute('aria-invalid', 'true');
                errorElement.textContent = message;
                errorElement.classList.add('active');
            }

            function clearFieldError(input, errorElement) {
                input.removeAttribute('aria-invalid');
                errorElement.textContent = '';
                errorElement.classList.remove('active');
            }

            function clearAllErrors() {
                clearFieldError(userIdInput, userIdError);
                clearFieldError(passwordInput, passwordError);
            }

            function validateForm() {
                clearAllErrors();

                const userIdValue = userIdInput.value.trim();
                const passwordValue = passwordInput.value.trim();
                let isValid = true;
                let firstInvalidField = null;

                if (!userIdValue) {
                    setFieldError(userIdInput, userIdError, '아이디를 입력해 주세요.');
                    isValid = false;
                    firstInvalidField = firstInvalidField || userIdInput;
                }

                if (!passwordValue) {
                    setFieldError(passwordInput, passwordError, '비밀번호를 입력해 주세요.');
                    isValid = false;
                    firstInvalidField = firstInvalidField || passwordInput;
                }

                if (!isValid && firstInvalidField) {
                    firstInvalidField.focus();
                }

                return isValid;
            }

            function createModal() {
                if (document.getElementById('modalOverlay')) {
                    return;
                }

                const modalHTML = `
                    <div
                        id="modalOverlay"
                        class="modal-overlay"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modalTitle"
                        aria-describedby="modalDescription"
                        aria-hidden="true"
                    >
                        <div class="modal-content" tabindex="-1">
                            <div class="modal-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"></circle>
                                    <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                                    <circle cx="12" cy="16" r="1" fill="white"></circle>
                                </svg>
                            </div>
                            <h3 id="modalTitle">로그인 실패</h3>
                            <p id="modalDescription">
                                아이디와 비밀번호를 확인하십시오.<br>
                                아이디 신규 생성 및 로그인 관련 문의는<br>
                                인재경영팀(내선 729)으로 연락바랍니다.
                            </p>
                            <button type="button" class="modal-close-btn" id="modalCloseBtn">확인</button>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHTML);

                const modalOverlay = document.getElementById('modalOverlay');
                const modalCloseBtn = document.getElementById('modalCloseBtn');

                modalCloseBtn.addEventListener('click', closeModal);

                modalOverlay.addEventListener('click', function (e) {
                    if (e.target === modalOverlay) {
                        closeModal();
                    }
                });
            }

            function getModalElements() {
                return {
                    overlay: document.getElementById('modalOverlay'),
                    content: document.querySelector('#modalOverlay .modal-content'),
                    closeBtn: document.getElementById('modalCloseBtn')
                };
            }

            function getFocusableElements(container) {
                if (!container) return [];
                return container.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
            }

            function openModal() {
                createModal();

                const { overlay, closeBtn } = getModalElements();
                if (!overlay) return;

                lastFocusedElement = document.activeElement;

                overlay.classList.add('active');
                overlay.setAttribute('aria-hidden', 'false');
                document.body.classList.add('modal-open');

                if (closeBtn) {
                    closeBtn.focus();
                }
            }

            function closeModal() {
                const { overlay } = getModalElements();
                if (!overlay) return;

                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');

                if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                    lastFocusedElement.focus();
                } else {
                    loginButton.focus();
                }
            }

            function setLoadingState(isLoading) {
                loginButton.disabled = isLoading;
                loginButton.setAttribute('aria-busy', String(isLoading));
                loginButton.textContent = isLoading ? '확인 중...' : '로그인';
            }

            function simulateLoginFailure() {
                setLoadingState(true);

                window.setTimeout(function () {
                    setLoadingState(false);
                    openModal();
                }, 350);
            }

            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                if (!validateForm()) {
                    return;
                }

                simulateLoginFailure();
            });

            userIdInput.addEventListener('input', function () {
                if (userIdInput.value.trim()) {
                    clearFieldError(userIdInput, userIdError);
                }
            });

            passwordInput.addEventListener('input', function () {
                if (passwordInput.value.trim()) {
                    clearFieldError(passwordInput, passwordError);
                }
            });

            document.addEventListener('keydown', function (e) {
                const { overlay, content } = getModalElements();
                const isModalOpen = overlay && overlay.classList.contains('active');

                if (!isModalOpen) {
                    return;
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeModal();
                    return;
                }

                if (e.key === 'Tab') {
                    const focusableElements = getFocusableElements(content);

                    if (!focusableElements.length) {
                        e.preventDefault();
                        return;
                    }

                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        })();
