document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const restartBtn = document.getElementById('restart-btn');
  const questionContainer = document.getElementById("question-container");
  const resultContainer = document.getElementById("result-container");
  const startScreen = document.getElementById("start-screen");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const scoreDisplay = document.getElementById("score");
  const scoreDisplayFinal = document.getElementById("score-display");
  const marksDisplay = document.getElementById("marks-display");
  const questionNumber = document.getElementById("question-number");
  const totalQuestions = document.getElementById("total-questions");
  const themeToggle = document.getElementById("theme-toggle");
  const feedbackMessage = document.getElementById("feedback-message");

  // Quiz Data with Marks
  const questions = [
    {
      question: "What does HTML stand for?",
      choices: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      answer: "Hyper Text Markup Language",
      marks: 5
    },
    {
      question: "Which language is used for styling web pages?",
      choices: ["HTML", "CSS", "Python", "Java"],
      answer: "CSS",
      marks: 5
    },
    {
      question: "Which is not a JavaScript Framework?",
      choices: ["React", "Django", "Angular", "Vue"],
      answer: "Django",
      marks: 5
    },
    {
      question: "Inside which HTML element do we put the JavaScript?",
      choices: ["<script>", "<js>", "<javascript>", "<code>"],
      answer: "<script>",
      marks: 5
    },
    {
      question: "What year was JavaScript created?",
      choices: ["1995", "2005", "2015", "1985"],
      answer: "1995",
      marks: 5
    }
  ];

  // Quiz State
  let currentQuestionIndex = 0;
  let score = 0;
  let totalMarks = 0;
  let currentQuestionAnswered = false;
  let isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Initialize theme
  initTheme();

  // Event Listeners
  startBtn.addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartQuiz);
  themeToggle.addEventListener('click', toggleTheme);

  // Theme Management
  function initTheme() {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    initTheme();
  }

  // Quiz Functions
  function startQuiz() {
    startScreen.classList.add('hidden');
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    totalMarks = 0;
    currentQuestionAnswered = false;
    updateScoreDisplay();
    showQuestion();
  }

  function showQuestion() {
    currentQuestionAnswered = false;
    nextBtn.classList.add('hidden');
    
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    questionNumber.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = questions.length;
    
    // Clear previous choices
    choicesList.innerHTML = "";
    
    // Create choice elements
    question.choices.forEach(choice => {
      const choiceDiv = document.createElement('div');
      choiceDiv.className = 'choice-item';
      choiceDiv.textContent = choice;
      choiceDiv.addEventListener('click', () => selectAnswer(choice, choiceDiv));
      choicesList.appendChild(choiceDiv);
    });
  }

  function selectAnswer(choice, choiceElement) {
    if (currentQuestionAnswered) return; // Prevent multiple selections
    
    const question = questions[currentQuestionIndex];
    const correctAnswer = question.answer;
    const isCorrect = choice === correctAnswer;
    
    // Mark question as answered
    currentQuestionAnswered = true;
    
    // Style all choices
    const allChoices = choicesList.querySelectorAll('.choice-item');
    allChoices.forEach(choiceEl => {
      choiceEl.classList.add('disabled');
      
      if (choiceEl.textContent === correctAnswer) {
        choiceEl.classList.add('correct');
      } else if (choiceEl === choiceElement && !isCorrect) {
        choiceEl.classList.add('incorrect');
      }
    });
    
    // Update score and marks (only once per question)
    if (isCorrect) {
      score++;
      totalMarks += question.marks;
      updateScoreDisplay();
    }
    
    // Show feedback message
    showFeedbackMessage(isCorrect);
    
    // Show next button
    nextBtn.classList.remove('hidden');
  }

  function showFeedbackMessage(isCorrect) {
    feedbackMessage.textContent = isCorrect ? "✅ Correct!" : "❌ Incorrect!";
    feedbackMessage.className = `feedback-container ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackMessage.classList.remove('hidden');
    
    // Auto-hide after 2 seconds
    setTimeout(() => {
      feedbackMessage.classList.add('hiding');
      setTimeout(() => {
        feedbackMessage.classList.add('hidden');
        feedbackMessage.classList.remove('hiding');
      }, 300);
    }, 2000);
  }

  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    scoreDisplayFinal.textContent = `${score} out of ${questions.length}`;
    marksDisplay.textContent = `${totalMarks} out of ${questions.reduce((sum, q) => sum + q.marks, 0)}`;
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalMarks = 0;
    currentQuestionAnswered = false;
    resultContainer.classList.add('hidden');
    startQuiz();
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = score;
  }

  // Initialize the app
  updateScoreDisplay();
});