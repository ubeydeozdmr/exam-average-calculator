const addLessonBtn = document.getElementById('add-lesson-btn');
const panel = document.getElementById('add-new-lesson-panel');
const averageInfo = document.getElementById('average');

let lessons;

function updateLocalStorage() {
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

function avg(...args) {
  args = args.filter((arg) => arg);
  const sum = args.reduce((acc, cur) => acc + cur, 0);
  return +(sum / args.length).toFixed(2) || null;
}

function generalAverage() {
  if (!lessons.length) {
    averageInfo.textContent = '-';
    return;
  }
  let sum = 0;
  let sumCoefficient = 0;
  for (const lesson of lessons) {
    if (!avg(...lesson.marks.exam, ...lesson.marks.perf)) continue;
    sum += avg(...lesson.marks.exam, ...lesson.marks.perf) * lesson.coefficient;
    sumCoefficient += lesson.coefficient;
  }
  averageInfo.textContent = +(sum / sumCoefficient).toFixed(2);
}

function showPanel() {
  const addBtn = document.getElementById('add-new-lesson-panel__form__button');
  const cancelBtn = document.getElementById('add-new-lesson-panel__cancel-btn');

  panel.classList.add('show');

  addBtn.addEventListener('click', addLesson);
  cancelBtn.addEventListener('click', hidePanel);
}

function hidePanel() {
  panel.classList.remove('show');
}

function lessonRow(lesson) {
  const markup = `
    <tr class="tbody__row" id="row__${lesson.id}">
      <td class="tbody__item">
        <input
          type="text"
          class="tbody__input"
          id="lesson-name__${lesson.id}"
          value="${lesson.name}"
          placeholder="Lesson name"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="coefficient__${lesson.id}"
          value="${lesson.coefficient}"
          placeholder="Coefficient"
          min="1"
          max="10"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="exam-1__${lesson.id}"
          value="${lesson.marks.exam[0] || ''}"
          placeholder="Exam 1"
          min="0"
          max="100"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="exam-2__${lesson.id}"
          value="${lesson.marks.exam[1] || ''}"
          placeholder="Exam 2"
          min="0"
          max="100"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="exam-3__${lesson.id}"
          value="${lesson.marks.exam[2] || ''}"
          placeholder="Exam 3"
          min="0"
          max="100"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="perf-1__${lesson.id}"
          value="${lesson.marks.perf[0] || ''}"
          placeholder="Perf 1"
          min="0"
          max="100"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="perf-2__${lesson.id}"
          value="${lesson.marks.perf[1] || ''}"
          placeholder="Perf 2"
          min="0"
          max="100"
        />
      </td>
      <td class="tbody__item">
        <input
          type="number"
          class="tbody__input"
          id="perf-3__${lesson.id}"
          value="${lesson.marks.perf[2] || ''}"
          placeholder="Perf 3"
          min="0"
          max="100"
        />
      </td>
      <td class="tbody__item tbody__item--avg" id="avg__${lesson.id}">
        ${avg(...lesson.marks.exam, ...lesson.marks.perf) || '-'}
      </td>
      <td class="tbody__item">
        <button class="tbody__btn" id="delete__${
          lesson.id
        }">Delete Lesson</button>
      </td>
    </tr>
  `;
  document.querySelector('.tbody').insertAdjacentHTML('beforeend', markup);

  const deleteLessonBtns = document.querySelectorAll('.tbody__btn');
  deleteLessonBtns.forEach((btn) => {
    btn.addEventListener('click', deleteLesson);
  });
}

function addLesson() {
  const name = document.getElementById('lesson-name').value;
  const coefficient = +document.getElementById('coefficient').value;
  const exam1 = +document.getElementById('exam-1').value;
  const exam2 = +document.getElementById('exam-2').value;
  const exam3 = +document.getElementById('exam-3').value;
  const perf1 = +document.getElementById('perf-1').value;
  const perf2 = +document.getElementById('perf-2').value;
  const perf3 = +document.getElementById('perf-3').value;
  if (!(name && coefficient)) return alert('Name and coefficient are required');
  const lesson = {
    id: Date.now(),
    name,
    coefficient,
    marks: {
      exam: [exam1, exam2, exam3],
      perf: [perf1, perf2, perf3],
    },
  };
  const marksFlat = [...lesson.marks.exam, ...lesson.marks.perf];
  if (marksFlat.find((mark) => mark > 100 || mark < 0)) {
    return alert('Marks must be between 0 and 100');
  }
  lessonRow(lesson);
  lessons.push(lesson);
  updateLocalStorage();
  generalAverage();
}

function editLesson(e) {
  const id = e.target.id.split('__')[1];
  const lesson = lessons.find((lesson) => lesson.id === +id);
  const input = e.target.id.split('__')[0];
  const value = +e.target.value;

  switch (input) {
    case 'lesson-name':
      lesson.name = value;
      break;
    case 'coefficient':
      lesson.coefficient = value;
      break;
    case 'exam-1':
      lesson.marks.exam[0] = value;
      break;
    case 'exam-2':
      lesson.marks.exam[1] = value;
      break;
    case 'exam-3':
      lesson.marks.exam[2] = value;
      break;
    case 'perf-1':
      lesson.marks.perf[0] = value;
      break;
    case 'perf-2':
      lesson.marks.perf[1] = value;
      break;
    case 'perf-3':
      lesson.marks.perf[2] = value;
      break;
    default:
      break;
  }

  const avgInfo = document.getElementById(`avg__${id}`);
  avgInfo.textContent = avg(...lesson.marks.exam, ...lesson.marks.perf) || '-';

  updateLocalStorage();
  generalAverage();
}

function deleteLesson(e) {
  if (!confirm('Are you sure you want to delete this lesson?')) return;
  const id = e.target.id.split('__')[1];
  const lesson = lessons.find((lesson) => lesson.id === +id);
  const index = lessons.indexOf(lesson);
  lessons.splice(index, 1);

  const lessonRow = document.getElementById(`row__${id}`);
  lessonRow.remove();

  updateLocalStorage();
  generalAverage();
}

function init() {
  if (localStorage.getItem('lessons') === null) {
    localStorage.setItem('lessons', JSON.stringify([]));
  } else {
    lessons = JSON.parse(localStorage.getItem('lessons'));
  }

  addLessonBtn.addEventListener('click', showPanel);

  lessons.forEach((lesson) => {
    lessonRow(lesson);
  });

  generalAverage();

  const inputFields = document.querySelectorAll('.tbody__input');
  inputFields.forEach((input) => {
    input.addEventListener('input', editLesson);
  });
}

init();
