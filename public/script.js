async function loadTodos() {
  // get 요청을 통해 데이터를 불러온다.
  const res = await fetch('/todos');
  // 불러온 데이터를 활용하기 위해 json형태로 변환한다.
  const todos = await res.json();

  const ol = document.querySelector('ol');
  // 다시 불러올 때 기존 목록이 중복되지 않도록 비운다.
  ol.innerHTML = '';

  // 불러온 데이터만큼 반복한다.
  todos.forEach((todo) => {
    // li 태그를 만든다.
    const li = document.createElement('li');
    // 체크 박스생성
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'check-box';
    checkbox.checked = todo.isDone;
    // 제목 생성
    const span = document.createElement('span');
    span.textContent = todo.title;
    if (todo.isDone) {
      span.classList.add('completed');
    }
    // 수정 버튼 생성
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '수정';
    // 수정 버튼 클릭 시 새 제목을 입력받아 서버에 반영한다.
    editBtn.addEventListener('click', async () => {
      const newTitle = prompt('새 제목을 입력하세요.', todo.title);
      // 취소를 누르면 prompt()가 null을 반환하므로 아무 작업도 하지 않는다.
      if (newTitle === null) {
        return;
      }

      await fetch(`/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      loadTodos();
    });
    // 삭제 버튼 생성
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '삭제';
    // li태그에 각각의 체크박스, 제목, 수정버튼, 삭제버튼을 추가한다.
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    // 목록에 li태그를 적용한다.
    ol.appendChild(li);
  });
}

loadTodos();

// 입력에 태그 불러오기
const input = document.querySelector('#new-todo-input');
// 추가 버튼 태그 불러오기
const addBtn = document.querySelector('#add-btn');

// 추가 버튼 클릭 시 아래의 코드 진행
addBtn.addEventListener('click', async () => {
  // server.js안에서 /todos 경로의 POST 요청에 대해서 실행
  await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 입력창에서 입력한 값을 테이블에 추가한다.
    body: JSON.stringify({ title: input.value }),
  });

  // 입력한 값을 다 활용했으니 초기화한다.
  input.value = '';
  // 테이블의 데이터를 조회하여 목록에 출력하게 한다.
  // 따라서 추가 시 즉각적으로 추가된 데이터를 목록에서 볼 수 있다.
  loadTodos();
});
