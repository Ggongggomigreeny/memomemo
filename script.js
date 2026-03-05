// script.js
document.addEventListener('DOMContentLoaded', function() {
    const memoInput = document.getElementById('memo-input');
    const saveBtn = document.getElementById('save-btn');

    // 메모 불러오기
    async function loadMemos() {
        // 기존 포스트잇 제거
        document.querySelectorAll('.post-it').forEach(el => el.remove());
        try {
            const querySnapshot = await getDocs(collection(window.db, 'memos'));
            querySnapshot.forEach((doc) => {
                const memoData = doc.data();
                createPostIt(memoData.text);
            });
        } catch (error) {
            console.error('메모 불러오기 오류:', error);
        }
    }

    // 포스트잇 생성
    function createPostIt(text) {
        const postIt = document.createElement('div');
        postIt.className = 'post-it';
        postIt.textContent = text;
        // 좌측 상단부터 순차적으로 배치
        const existingPostIts = document.querySelectorAll('.post-it');
        const x = 20;
        const y = 100 + existingPostIts.length * 170; // 각 포스트잇 높이 150 + 여백 20
        postIt.style.left = x + 'px';
        postIt.style.top = y + 'px';
        document.body.appendChild(postIt);

        // 드래그 기능
        let isDragging = false;
        let offsetX, offsetY;

        postIt.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - postIt.offsetLeft;
            offsetY = e.clientY - postIt.offsetTop;
            postIt.style.zIndex = 100;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                postIt.style.left = (e.clientX - offsetX) + 'px';
                postIt.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            postIt.style.zIndex = 10;
        });
    }

    // 메모 저장
    async function saveMemo() {
        const memoText = memoInput.value.trim();
        if (memoText) {
            try {
                await addDoc(collection(window.db, 'memos'), {
                    text: memoText,
                    timestamp: new Date()
                });
                memoInput.value = '';
                createPostIt(memoText); // 즉시 포스트잇 생성
            } catch (error) {
                console.error('메모 저장 오류:', error);
            }
        }
    }

    saveBtn.addEventListener('click', saveMemo);

    // 엔터키 입력 시 저장
    memoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveMemo();
        }
    });

    // 초기 메모 불러오기
    loadMemos();
});