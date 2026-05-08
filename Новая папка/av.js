// Вопросы для теста
const questions = [
    {
        question: "Вы Руслан?",
        answers: ["Nou", "Нет", "Я пиздабол", "Кирилл"],
        correct: 1 // индекс правильного ответа (0-based)
    },
    {
        question: "Сколько пальцев у Руслана?",
        answers: ["Будет 9", "10", "67", "5"],
        correct: 0
    },
    {
        question: "Какой химический элемент обозначается символом 'O'?",
        answers: ["Золото", "Осмий", "Кислород", "Олово"],
        correct: 2
    },
    {
        question: "Худшее пиво",
        answers: ["Golda", "Bad", "Кулер", "Чешское"],
        correct: 3 // 7 континентов (если считать Антарктиду, Австралию, Африку, Евразию, Северную и Южную Америку)
    },
    {
        question: "Общее число фанаток Руслана",
        answers: ["0", "67", "67", "200+"],
        correct: 3
    },
    {
        question: "Подписан ли на него #мертвый?",
        answers: ["Да", "Нет", "Кнш", "Это кто"],
        correct: 2
    },
    {
        question: "Какое слово самое смешное?",
        answers: ["Блядина", "Шлюха", "Тварь", "Говно"],
        correct: 0
    },
];

// Состояние приложения
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(-1); // -1 означает, что ответ не выбран
let quizStarted = false;

// DOM элементы
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const progressFill = document.getElementById('progress-fill');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');

// Элементы результата
const correctCountSpan = document.getElementById('correct-count');
const totalCountSpan = document.getElementById('total-count');
const scorePercentSpan = document.getElementById('score-percent');
const resultMessageDiv = document.getElementById('result-message');

// Устанавливаем общее количество вопросов
totalQuestionsSpan.textContent = questions.length;
totalCountSpan.textContent = questions.length;

// Функция для отображения текущего вопроса
function renderCurrentQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    
    // Создаем кнопки ответов
    answersContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        if (userAnswers[currentQuestionIndex] === index) {
            answerDiv.classList.add('selected');
        }
        
        answerDiv.innerHTML = `
            <div class="answer-letter">${letters[index]}</div>
            <div class="answer-text">${answer}</div>
            <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
        `;
        
        answerDiv.addEventListener('click', () => {
            selectAnswer(index);
        });
        
        answersContainer.appendChild(answerDiv);
    });
    
    // Обновляем счетчик вопроса
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // Обновляем прогресс-бар
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Обновляем состояние кнопки "Далее"
    nextBtn.disabled = userAnswers[currentQuestionIndex] === -1;
}

// Функция выбора ответа
function selectAnswer(answerIndex) {
    // Сохраняем ответ
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Визуально обновляем стили
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach((option, idx) => {
        if (idx === answerIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Активируем кнопку "Далее"
    nextBtn.disabled = false;
}

// Функция перехода к следующему вопросу
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
    } else {
        // Тест закончен, показываем результаты
        showResults();
    }
}

// Функция подсчета правильных ответов
function calculateScore() {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].correct) {
            correct++;
        }
    }
    return correct;
}

// Функция отображения результатов
function showResults() {
    const correct = calculateScore();
    const percentage = Math.round((correct / questions.length) * 100);
    
    // Обновляем числа
    correctCountSpan.textContent = correct;
    scorePercentSpan.textContent = `${percentage}%`;
    
    // Определяем сообщение в зависимости от результата
    let message = '';
    let messageClass = '';
    
    if (percentage >= 80) {
        message = 'Ты просто босс сука';
        messageClass = 'excellent';
    } else if (percentage >= 60) {
        message = 'Посидим еще посидим';
        messageClass = 'good';
    } else if (percentage >= 40) {
        message = 'Пиздец ты хуйло';
        messageClass = 'average';
    } else {
        message = 'Просто не пиши Руслану, можешь вешаться';
        messageClass = 'bad';
    }
    
    resultMessageDiv.textContent = message;
    resultMessageDiv.className = `result-message ${messageClass}`;
    
    // Переключаем экраны
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
}

// Функция перезапуска теста
function restartQuiz() {
    // Сбрасываем состояние
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(-1);
    
    // Переключаем экраны
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// Функция начала теста
function startQuiz() {
    // Сбрасываем состояние на всякий случай
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(-1);
    
    // Отображаем первый вопрос
    renderCurrentQuestion();
    
    // Переключаем экраны
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
}

// Обработчики событий
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Дополнительно: обработка клавиши Enter для кнопки "Далее"
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && quizScreen.classList.contains('active') && !nextBtn.disabled) {
        nextQuestion();
    }
});
// Анимация при наведении (добавляем небольшой эффект для ответов)
// В CSS уже есть, но можно добавить дополнительные эффекты