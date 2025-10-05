/* === FILTERS === */
const filtersButtons = document.querySelectorAll('#filters button');
let currentFilter = 'all';

function applyFilter() {
    const tasks = Array.from(document.querySelectorAll('.task'))

    tasks.forEach(task => {
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
    })

    if (currentFilter === 'all') {
        const taskContainer = document.querySelector('.main-content__tasks-list')

        tasks
            .sort((a,b) => a.dataset.status - b.dataset.status)
            .forEach(task => taskContainer.appendChild(task))
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyFilter(); // сортировка + фильтр при первой загрузке
});

filtersButtons.forEach(button => {
    button.addEventListener('click', () => {
        filtersButtons.forEach(button => button.classList.remove('active'));

        button.classList.add('active');

        currentFilter = button.dataset.filter;

        applyFilter()
    });
});
document.querySelector('#filters button[data-filter="all"]').classList.add('active');

function sendAction(action, params = {}) {
    const body = new URLSearchParams({action, ...params}).toString()

    return fetch('index.php', {
        method: "POST",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body
    })
        .then(response => response.json())
}

/* === ADD TASK === */
const addButton = document.querySelector('.add-task-form__btn')

addButton.addEventListener('click', () => {
    const textarea = document.querySelector('.add-task-form textarea')
    const title = textarea.value.trim()

    sendAction('create', {title}).then(data => {
            if (data.success) {
                const tasksList = document.querySelector('.main-content__tasks-list');

                const taskHTML = `
                <div class="task" data-status="0" data-id="${data.id}">
                    <div class="task__description">
                        <p>${data.title}</p>
                    </div>
                    <div class="task__actions">
                        <form class="task__action task__action--toggle">
                            <input type="hidden" name="action" value="toggle">
                            <button type="button" class="task__btn task__btn--toggle"></button>
                        </form>
                        <form class="task__action task__action--delete">
                            <input type="hidden" name="action" value="delete">
                            <button type="button" class="task__btn task__btn--delete"></button>
                        </form>
                    </div>
                </div>`

                tasksList.insertAdjacentHTML('beforeend', taskHTML);
                textarea.value = '';

                applyFilter()
            } else {
                alert('Ошибка: ' + data.error)
            }
        }
    )
})
/* === TOGGLE=== */
const tasksList = document.querySelector('.main-content__tasks-list')

tasksList.addEventListener('click', (event) => {
    const btn = event.target.closest('.task__btn--toggle')
    if (!btn) return

    const task = btn.closest('.task')
    const id = task.dataset.id

    sendAction('toggle', {id}).then(data => {
        if (data.success) {
            const isCompleted = task.dataset.status === '1'
            const newStatus = task.dataset.status = isCompleted ? '0' : '1'

            if (newStatus === '1') {
                btn.innerHTML = '<img src="/src/assets/images/check.svg" alt="Выполнено">'
            } else {
                btn.innerHTML = ''
            }
        }

        applyFilter()
    })
})

/* === DElETE === */
tasksList.addEventListener('click', (event) => {
    const btn = event.target.closest('.task__btn--delete')
    if (!btn) return

    const task = btn.closest('.task')
    const id = task.dataset.id

    sendAction('delete', {id}).then(data => {
        if (data.success) {
            task.remove()
        } else {
            alert('Ошибка удаления:' + data.error)
        }

        applyFilter()
    })
        .catch(err => console.error('Ошибка:', err))
})