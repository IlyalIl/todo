/* === FILTERS === */
const filtersButtons = document.querySelectorAll('#filters button');
let currentFilter = 'all';

function applyFilter() {
    document.querySelectorAll('.task').forEach(task => {
        const status = task.dataset.status;

        if (currentFilter === 'all') {
            task.style.display = '';
        } else if (currentFilter === 'completed' && status !== '1') {
            task.style.display = 'none';
        } else if (currentFilter === 'active' && status !== '0') {
            task.style.display = 'none';
        } else {
            task.style.display = '';
        }
    });
}

filtersButtons.forEach(button => {
    button.addEventListener('click', () => {
        filtersButtons.forEach(button => button.classList.remove('active'));

        button.classList.add('active');

        currentFilter = button.dataset.filter;

        applyFilter()
    });
});

document.querySelector('#filters button[data-filter="all"]').classList.add('active');

/* === ADD TASK === */
const addButton = document.querySelector('.add-task-form__btn')

addButton.addEventListener('click', () => {
    const textarea = document.querySelector('.add-task-form textarea')
    const title = textarea.value.trim()

    fetch('/public/addTask.php', {
        method: "POST",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: `title=${encodeURIComponent(title)}`
    })
        .then(response => response.text())
        .then(text => {
            return JSON.parse(text)
        })
        .then(data => {
            if (data.success) {
                const tasksList = document.querySelector('.main-content__tasks-list');

                const taskHTML = `
                <div class="task" data-status="0">
                    <div class="task__description">
                        <p>${data.title}</p>
                    </div>
                    <div class="task__actions">
                        <form class="task__action task__action--toggle">
                            <input type="hidden" name="action" value="toggle">
                            <button type="button" class="task__btn task__btn--toggle" data-id="${data.id}">
                            </button>
                        </form>
                        <form class="task__action task__action--delete">
                            <input type="hidden" name="action" value="delete">
                            <button type="button" class="task__btn task__btn--delete"></button>
                        </form>
                    </div>
                </div>
            `;

                tasksList.insertAdjacentHTML('beforeend', taskHTML);
                textarea.value = '';

                applyFilter()
            } else {
                alert('Ошибка: ' + data.error)
            }
        })
        .catch(err => console.error('Ошибка:', err));
})

/* === TOGGLE=== */
const tasksList = document.querySelector('.main-content__tasks-list')

tasksList.addEventListener('click', (event) => {
    const btn = event.target.closest('.task__btn--toggle')
    if (!btn) return
    const task = btn.closest('.task')
    const id = btn.dataset.id
    const isCompleted = task.dataset.status === '1'
    const newStatus = isCompleted ? '0' : '1'

    fetch('/public/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: 'action=toggle&id=${encodeURIComponent(id)}'
    })
        .then(response => response.text())
        .then(text => {
                return JSON.parse(text)
            }
        )
        .then(data => {
            if (data.success) {
                task.dataset.status = newStatus

                if (newStatus === '1') {
                    btn.innerHTML = '<img src="/src/assets/images/check.svg" alt="Выполнено">';
                    task.classList.add('completed')
                } else {
                    btn.innerHTML = ''
                    task.classList.remove('completed')
                }

                applyFilter()
            } else {
                alert('Ошибка toggle:' + data.error)
            }
        })
        .catch(err => console.error('error:', err))
})
/* === DElETE === */
tasksList.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.task__btn--delete')
    if (!deleteBtn) return

    const task = deleteBtn.closest('.task')
    const id = deleteBtn.dataset.id

    fetch('/public/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `action=delete&id=${encodeURIComponent(id)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                task.remove()
            } else {
                alert("Ошибка удаления:" + data.error);
            }
            applyFilter()
        })
        .catch(err => console.error('Ошибка:', err));
})