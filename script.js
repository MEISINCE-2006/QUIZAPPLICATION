// Full Stack Developer Quiz Studio - Application Logic
const ADMIN_PIN = '2006';

// State Variables
let currentRole = '';
let isAdminLoggedIn = false;
let questions = [];
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = '';
let userAnswers = []; // Records user responses for review
let userCategoryFilter = 'all';
let isSoundEnabled = true;
let questionTimer = null;
let timerSeconds = 30;
let developerProfile = null;


// Default Full Stack Developer Question Bank
const defaultQuestions = [
    {
        difficulty: 'easy',
        category: 'Frontend',
        question: 'Which HTML5 semantic element is most appropriate for enclosing independent, self-contained content like a blog post or comment?',
        codeSnippet: '',
        options: ['<section>', '<article>', '<div>', '<aside>'],
        correct: 'B',
        explanation: '<article> represents a self-contained composition intended to be independently reusable or distributable.'
    },
    {
        difficulty: 'easy',
        category: 'Frontend',
        question: 'What is the output of the following JavaScript code snippet?',
        codeSnippet: 'console.log(typeof NaN);\nconsole.log(0.1 + 0.2 === 0.3);',
        options: ['"number" and true', '"number" and false', '"nan" and false', '"undefined" and true'],
        correct: 'B',
        explanation: 'In JavaScript, typeof NaN is "number", and floating point math precision causes 0.1 + 0.2 to equal 0.30000000000000004 (false).'
    },
    {
        difficulty: 'medium',
        category: 'Frontend',
        question: 'In React, what is the main purpose of providing a unique `key` prop when rendering lists of elements?',
        codeSnippet: 'const listItems = items.map((item) =>\n  <li key={item.id}>{item.name}</li>\n);',
        options: [
            'To format CSS styling for each element',
            'To help React identify which items have changed, been added, or removed for efficient DOM diffing',
            'To bind click event handlers to list items',
            'To automatically sort the array alphabetically'
        ],
        correct: 'B',
        explanation: 'Keys give elements a stable identity, allowing React Reconciliation algorithm to re-render only updated items.'
    },
    {
        difficulty: 'easy',
        category: 'Backend',
        question: 'What is the function of the Express.js middleware function signature `(req, res, next)`?',
        codeSnippet: 'app.use((req, res, next) => {\n  console.log("Request received!");\n  next();\n});',
        options: [
            'To send an HTTP response back to the client immediately',
            'To pass control to the next middleware function in the request-response stack',
            'To terminate the Node.js process',
            'To handle database transaction rollbacks'
        ],
        correct: 'B',
        explanation: 'Calling next() passes control to the next registered middleware in the chain.'
    },
    {
        difficulty: 'medium',
        category: 'Backend',
        question: 'Which Node.js core module is specifically designed to handle non-blocking asynchronous file operations?',
        codeSnippet: 'import fs from "node:fs/promises";\nconst data = await fs.readFile("config.json", "utf-8");',
        options: ['path', 'http', 'fs', 'net'],
        correct: 'C',
        explanation: 'The `fs` (File System) module handles file reading, writing, and manipulation asynchronously.'
    },
    {
        difficulty: 'hard',
        category: 'Backend',
        question: 'What will be printed to the console when executing this Node.js Event Loop code?',
        codeSnippet: 'setTimeout(() => console.log("Timeout"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nprocess.nextTick(() => console.log("NextTick"));\nconsole.log("Main");',
        options: [
            'Main -> NextTick -> Promise -> Timeout',
            'Main -> Timeout -> Promise -> NextTick',
            'Timeout -> Promise -> NextTick -> Main',
            'Main -> Promise -> NextTick -> Timeout'
        ],
        correct: 'A',
        explanation: 'Synchronous code runs first ("Main"), followed by process.nextTick queue, then Microtask queue Promises, then Macrotask queue (setTimeout).'
    },
    {
        difficulty: 'easy',
        category: 'Database',
        question: 'Which SQL command is used to remove a table structure entirely along with all its data from the database?',
        codeSnippet: 'DROP TABLE users;',
        options: ['DELETE TABLE users;', 'REMOVE TABLE users;', 'DROP TABLE users;', 'TRUNCATE TABLE users;'],
        correct: 'C',
        explanation: 'DROP TABLE deletes both the data and the table schema definition permanently.'
    },
    {
        difficulty: 'medium',
        category: 'Database',
        question: 'In MongoDB / NoSQL databases, what is the primary benefit of creating an Index on a field?',
        codeSnippet: 'db.users.createIndex({ email: 1 });',
        options: [
            'To encrypt the field data at rest',
            'To speed up document query execution by reducing scan operations',
            'To enforce strict data types on fields',
            'To duplicate collections across multiple databases'
        ],
        correct: 'B',
        explanation: 'Indexes store a small, sorted subset of data allowing MongoDB to locate documents quickly without scanning every document.'
    },
    {
        difficulty: 'hard',
        category: 'DevOps & Git',
        question: 'What happens when you run `git reset --hard HEAD~1`?',
        codeSnippet: 'git reset --hard HEAD~1',
        options: [
            'Undoes the last commit but keeps changes staged in index',
            'Undoes the last commit and discards all uncommitted working directory changes permanently',
            'Creates a new commit reverting the previous commit',
            'Switches to a new branch named HEAD~1'
        ],
        correct: 'B',
        explanation: '`--hard` resets the index and working directory, wiping out working tree changes and the last commit.'
    },
    {
        difficulty: 'medium',
        category: 'Security',
        question: 'What authentication mechanism uses a cryptographically signed JSON object consisting of Header, Payload, and Signature?',
        codeSnippet: 'Header.Payload.Signature // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        options: ['OAuth 1.0', 'JWT (JSON Web Token)', 'Basic Auth Credentials', 'Session Cookies'],
        correct: 'B',
        explanation: 'JWTs are compact, URL-safe tokens structured with Header.Payload.Signature for secure stateless authentication.'
    },
    {
        difficulty: 'hard',
        category: 'Security',
        question: 'How can developers effectively mitigate Cross-Site Scripting (XSS) vulnerabilities in modern web applications?',
        codeSnippet: '',
        options: [
            'By disabling HTTPS on backend APIs',
            'By sanitizing & escaping untrusted user inputs and applying Content Security Policy (CSP) headers',
            'By storing API keys inside HTML comments',
            'By using GET requests instead of POST'
        ],
        correct: 'B',
        explanation: 'Proper input sanitization, context-aware output encoding, and strict CSP headers stop malicious JS execution.'
    },
    {
        difficulty: 'medium',
        category: 'Frontend',
        question: 'In React 18, what is the behavior of state updates inside async code blocks, promises, and timeouts under the automatic batching mechanism?',
        codeSnippet: 'setTimeout(() => {\n  setCount(c => c + 1);\n  setFlag(f => !f);\n}, 1000);',
        options: [
            'Updates are not batched and will cause two independent renders',
            'React automatically groups these updates and triggers only a single re-render',
            'Only the first update is committed immediately; the second is delayed',
            'Updates inside timeouts are blocked unless wrapped in flushSync()'
        ],
        correct: 'B',
        explanation: 'React 18 introduced automatic batching, meaning all updates (regardless of where they originate) are batched for optimal rendering.'
    },
    {
        difficulty: 'easy',
        category: 'Frontend',
        question: 'Which layout model is primarily intended for designing one-dimensional user interface layouts (either horizontal or vertical)?',
        codeSnippet: '.flex-container {\n  display: flex;\n  flex-direction: column;\n}',
        options: [
            'CSS Grid Layout',
            'CSS Flexbox Layout',
            'CSS Float Layout',
            'CSS Multi-column Layout'
        ],
        correct: 'B',
        explanation: 'CSS Flexbox is designed to align elements along a single axis (either row or column), whereas CSS Grid is for two-dimensional grids.'
    },
    {
        difficulty: 'hard',
        category: 'Frontend',
        question: 'What will be output to the console when executing the following JavaScript closure code?',
        codeSnippet: 'function outer() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\nconst c1 = outer();\nconst c2 = outer();\nc1.increment();\nconsole.log(c1.getCount(), c2.getCount());',
        options: [
            '1 and 1',
            '1 and 0',
            '0 and 0',
            'undefined and undefined'
        ],
        correct: 'B',
        explanation: 'Each call to outer() creates a new, independent lexical environment (scope capsule) with its own count variable.'
    },
    {
        difficulty: 'medium',
        category: 'Backend',
        question: 'Which built-in Node.js module is most appropriate to distribute network traffic among multiple child processes (workers) running on a single server, each listening on the same port?',
        codeSnippet: 'import cluster from "node:cluster";\nif (cluster.isPrimary) {\n  // fork workers\n}',
        options: [
            'child_process',
            'worker_threads',
            'cluster',
            'net'
        ],
        correct: 'C',
        explanation: 'The cluster module creates worker processes that share incoming server connection ports, maximizing multi-core processor usage.'
    },
    {
        difficulty: 'easy',
        category: 'Backend',
        question: 'In RESTful API specifications, which HTTP verb is standard for updating an existing resource by replacing its entire representation?',
        codeSnippet: 'PUT /api/profiles/456 HTTP/1.1\nHost: myapp.com',
        options: [
            'POST',
            'PATCH',
            'PUT',
            'UPDATE'
        ],
        correct: 'C',
        explanation: 'PUT performs a full resource replacement (idempotent), while PATCH performs partial updates (non-idempotent or idempotent depending on implementation).'
    },
    {
        difficulty: 'hard',
        category: 'Backend',
        question: 'In Node.js streams, how do we properly link readable and writable streams while preventing the writable destination from being overwhelmed by a faster readable source (known as backpressure)?',
        codeSnippet: 'import { pipeline } from "node:stream/promises";\nawait pipeline(readableStream, transformStream, writableStream);',
        options: [
            'Using stream.pipe() directly without any callback wrapper',
            'By using the pipeline helper or promise-based pipeline utility, which manages backpressure and error propagation automatically',
            'By manually checking writable.write() return value in a busy-wait loop',
            'By increasing the highWaterMark to infinity'
        ],
        correct: 'B',
        explanation: 'Using the pipeline utility or stream/promises version handles backpressure, buffers, and clean-up of streams when errors occur.'
    },
    {
        difficulty: 'easy',
        category: 'Database',
        question: 'In the context of database transaction properties (ACID), what does the "I" (Isolation) property guarantee?',
        codeSnippet: 'BEGIN TRANSACTION;\nSELECT balance FROM accounts WHERE id = 1;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;',
        options: [
            'Guarantees that database actions are committed in order of time',
            'Ensures that concurrent execution of transactions leaves the database in a state equivalent to sequential execution',
            'Ensures that once a transaction commits, it remains so even in the event of system power loss',
            'Guarantees that all operations inside the transaction succeed or fail as a single unit'
        ],
        correct: 'B',
        explanation: 'Isolation ensures that concurrent transactions do not interfere with each other, preventing dirty, non-repeatable, or phantom reads.'
    },
    {
        difficulty: 'medium',
        category: 'Database',
        question: 'Which of the following describes the core storage architecture of Redis that enables sub-millisecond response latency?',
        codeSnippet: '127.0.0.1:6379> SET api_session_key:123 "active"\nOK',
        options: [
            'A distributed relational database mapping data rows to local filesystem blocks',
            'An in-memory key-value database engine storing records primarily in RAM',
            'An append-only log database storing documents strictly on dynamic SSD blocks',
            'A graph database tracking node connections using local pointer lists'
        ],
        correct: 'B',
        explanation: 'Redis is an in-memory key-value database. Since RAM access is orders of magnitude faster than disk storage, read/write latency is extremely low.'
    },
    {
        difficulty: 'hard',
        category: 'Database',
        question: 'When optimizing SQL queries, what is the main performance benefit and overhead trade-off of introducing a B-Tree Index on a frequently queried column?',
        codeSnippet: 'CREATE INDEX idx_user_email ON users(email);',
        options: [
            'Speeds up SELECT queries but decreases performance of INSERT/UPDATE/DELETE writes because indexes must be updated',
            'Speeds up INSERT queries but slows down SELECT searches because of nested tree traversal',
            'Encrypts sensitive columns while doubling execution time of all database requests',
            'Compresses the physical database size while disabling concurrent connection access'
        ],
        correct: 'A',
        explanation: 'B-Tree indexes speed up lookups (reducing table scans), but incur writing overhead as index trees must be balanced and updated on writes.'
    },
    {
        difficulty: 'medium',
        category: 'DevOps & Git',
        question: 'Which Git command allows developers to temporarily save their modified, tracked files without creating a commit, enabling them to switch branches safely?',
        codeSnippet: 'git stash\ngit checkout feature-hotfix\n// ... resolve hotfix ...\ngit checkout main\ngit stash pop',
        options: [
            'git reset --mixed',
            'git stash',
            'git commit --amend',
            'git branch --temp'
        ],
        correct: 'B',
        explanation: '`git stash` shelves current changes (dirty working tree and index state) and reverts to HEAD state, which can be popped or applied later.'
    },
    {
        difficulty: 'hard',
        category: 'DevOps & Git',
        question: 'In Docker, how can a developer effectively reduce build times and produce smaller production image sizes?',
        codeSnippet: 'FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html',
        options: [
            'By including devDependencies in the final runtime layer and using large base images',
            'By utilizing multi-stage builds to discard build-time dependencies, ordering Dockerfile lines from least-to-most-frequent changes, and using slim/alpine base images',
            'By running Docker container caches in privileged execution mode',
            'By packing all application packages into a single static zip file inside the container'
        ],
        correct: 'B',
        explanation: 'Multi-stage builds allow pulling builder dependencies while copying only final binaries/dist files to a tiny runtime base image. Layer caching is leveraged by putting static package definitions before dynamic code copies.'
    },
    {
        difficulty: 'medium',
        category: 'Security',
        question: 'Which HTTP response header is sent by a server to determine whether web browsers should block cross-origin requests originating from other websites?',
        codeSnippet: 'Access-Control-Allow-Origin: https://devplatform.com\nAccess-Control-Allow-Methods: GET, POST, OPTIONS',
        options: [
            'Cross-Origin-Opener-Policy',
            'Access-Control-Allow-Origin',
            'Strict-Transport-Security',
            'Content-Security-Policy'
        ],
        correct: 'B',
        explanation: 'The `Access-Control-Allow-Origin` header specifies the cross-origin domains that are permitted to read server response data via the client browser.'
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadQuestionsFromStorage();
    setupPinInputs();
    setupFormListeners();
    setupSavedTheme();
    loadDeveloperProfile();
});

// Sound Effects Synthesizer (Web Audio API)
function playSound(type) {
    if (!isSoundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (type === 'click') {
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'incorrect') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.setValueAtTime(140, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'victory') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1);
            osc.frequency.setValueAtTime(783.99, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        }
    } catch (e) {
        console.log('Audio Context muted or unsupported');
    }
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    const btn = document.getElementById('soundToggleBtn');
    btn.textContent = isSoundEnabled ? '🔊' : '🔇';
    playSound('click');
}

// Theme Switcher
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('themeToggleBtn').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', newTheme);
    playSound('click');
}

function setupSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggleBtn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

// Admin PIN Passcode Authentication Modal Logic
function setupPinInputs() {
    const pinInputs = document.querySelectorAll('.pin-digit');
    pinInputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length >= 1) {
                input.value = val[0];
                if (idx < pinInputs.length - 1) {
                    pinInputs[idx + 1].focus();
                }
            }
            if (getEnteredPin().length === 4) {
                submitAdminPin();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && idx > 0) {
                pinInputs[idx - 1].focus();
            } else if (e.key === 'Enter') {
                submitAdminPin();
            }
        });
    });
}

function getEnteredPin() {
    let pin = '';
    document.querySelectorAll('.pin-digit').forEach(input => pin += input.value);
    return pin;
}

function openAdminAccess() {
    playSound('click');
    if (isAdminLoggedIn) {
        selectRole('admin');
        return;
    }
    const modal = document.getElementById('pinModal');
    const pinInputs = document.querySelectorAll('.pin-digit');
    pinInputs.forEach(input => input.value = '');
    document.getElementById('pinErrorMsg').textContent = '';
    modal.classList.add('active');
    setTimeout(() => pinInputs[0].focus(), 150);
}

function closePinModal() {
    playSound('click');
    document.getElementById('pinModal').classList.remove('active');
}

function submitAdminPin() {
    const pin = getEnteredPin();
    const errorMsg = document.getElementById('pinErrorMsg');
    const modalCard = document.getElementById('modalCard');

    if (pin === ADMIN_PIN) {
        playSound('correct');
        isAdminLoggedIn = true;
        closePinModal();
        selectRole('admin');
    } else {
        playSound('incorrect');
        modalCard.classList.add('shake');
        setTimeout(() => modalCard.classList.remove('shake'), 500);
        const pinInputs = document.querySelectorAll('.pin-digit');
        pinInputs.forEach(input => input.value = '');
        pinInputs[0].focus();
    }
}
function selectRole(role) {
    currentRole = role;

    if (role === 'admin') {
        hideAllScreens();
        document.getElementById('adminDashboard').classList.add('active');
        showQuestions();
    } else {
        if (developerProfile) {
            updateWelcomeCard();
            hideAllScreens();
            document.getElementById('userDashboard').classList.add('active');
        } else {
            openRegistrationModal();
        }
    }
}

function goBack() {
    playSound('click');
    hideAllScreens();
    clearInterval(questionTimer);
    document.getElementById('roleSelection').classList.add('active');
    currentRole = '';
}

function goToUserDashboard() {
    playSound('click');
    hideAllScreens();
    clearInterval(questionTimer);
    document.getElementById('userDashboard').classList.add('active');
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

// Developer Registration & Onboarding Handlers (Temporary Session Storage)
function loadDeveloperProfile() {
    // Keep developer profile strictly temporary in session memory (cleared on refresh)
    developerProfile = null;
}

function openRegistrationModal() {
    playSound('click');
    const modal = document.getElementById('registrationModal');
    if (developerProfile) {
        document.getElementById('regName').value = developerProfile.name || '';
        document.getElementById('regEmail').value = developerProfile.email || '';
        document.getElementById('regExp').value = developerProfile.experience || '';
        document.getElementById('regStack').value = developerProfile.stack || '';
    } else {
        document.getElementById('registrationForm').reset();
    }
    modal.classList.add('active');
}

function closeRegistrationModal() {
    playSound('click');
    document.getElementById('registrationModal').classList.remove('active');
}

function submitRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const experience = document.getElementById('regExp').value;
    const stack = document.getElementById('regStack').value;

    if (!name || !email || !experience || !stack) {
        alert('Please fill out all required fields.');
        return;
    }

    // Save strictly in memory for current quiz session
    developerProfile = { name, email, experience, stack };

    updateWelcomeCard();
    closeRegistrationModal();
    playSound('correct');

    // Proceed to Developer Arena
    hideAllScreens();
    document.getElementById('userDashboard').classList.add('active');
}

function updateWelcomeCard() {
    if (developerProfile) {
        document.getElementById('welcomeDevName').textContent = developerProfile.name;
        document.getElementById('welcomeDevDetails').textContent =
            `${developerProfile.experience} ${developerProfile.stack} Developer | ${developerProfile.email}`;
    }
}

function editDeveloperDetails() {
    openRegistrationModal();
}

// Form Handlers & Admin Actions
function setupFormListeners() {
    document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);
}

function showCreateQuestion(editIndex = -1) {
    playSound('click');
    const formCard = document.getElementById('createQuestionForm');
    const listCard = document.getElementById('questionsList');
    formCard.classList.remove('hidden');
    listCard.classList.add('hidden');

    const formTitle = document.getElementById('formTitle');
    const editInput = document.getElementById('editQuestionIndex');
    const saveBtn = document.getElementById('saveQuestionBtn');

    if (editIndex >= 0) {
        const q = questions[editIndex];
        formTitle.textContent = 'Edit Question';
        editInput.value = editIndex;
        saveBtn.textContent = 'Update Question';

        document.getElementById('difficulty').value = q.difficulty;
        document.getElementById('category').value = q.category || 'Frontend';
        document.getElementById('question').value = q.question;
        document.getElementById('codeSnippet').value = q.codeSnippet || '';
        document.getElementById('option1').value = q.options[0];
        document.getElementById('option2').value = q.options[1];
        document.getElementById('option3').value = q.options[2];
        document.getElementById('option4').value = q.options[3];
        document.getElementById('correctAnswer').value = q.correct;
        document.getElementById('explanation').value = q.explanation || '';
    } else {
        formTitle.textContent = 'Add New Developer Question';
        editInput.value = -1;
        saveBtn.textContent = 'Save Question';
        document.getElementById('questionForm').reset();
    }

    formCard.scrollIntoView({ behavior: 'smooth' });
}

function hideCreateQuestion() {
    playSound('click');
    document.getElementById('createQuestionForm').classList.add('hidden');
    document.getElementById('questionForm').reset();
    showQuestions();
}

function showQuestions() {
    document.getElementById('createQuestionForm').classList.add('hidden');
    document.getElementById('questionsList').classList.remove('hidden');
    displayQuestions();
}

function handleQuestionSubmit(e) {
    e.preventDefault();

    const editIndex = parseInt(document.getElementById('editQuestionIndex').value);
    const difficulty = document.getElementById('difficulty').value;
    const category = document.getElementById('category').value;
    const questionText = document.getElementById('question').value.trim();
    const codeSnippet = document.getElementById('codeSnippet').value;
    const option1 = document.getElementById('option1').value.trim();
    const option2 = document.getElementById('option2').value.trim();
    const option3 = document.getElementById('option3').value.trim();
    const option4 = document.getElementById('option4').value.trim();
    const correctAnswer = document.getElementById('correctAnswer').value;
    const explanation = document.getElementById('explanation').value.trim();

    const questionObj = {
        difficulty,
        category,
        question: questionText,
        codeSnippet,
        options: [option1, option2, option3, option4],
        correct: correctAnswer,
        explanation
    };

    if (editIndex >= 0) {
        questions[editIndex] = questionObj;
        alert('Question updated successfully!');
    } else {
        questions.push(questionObj);
        alert('Question added successfully!');
    }

    saveQuestionsToStorage();
    playSound('correct');
    hideCreateQuestion();
}

function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions.splice(index, 1);
        saveQuestionsToStorage();
        displayQuestions();
        playSound('click');
    }
}

function displayQuestions() {
    const container = document.getElementById('questionsContent');
    const totalCount = document.getElementById('totalQuestionCount');
    totalCount.textContent = questions.length;

    if (questions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 30px;">No questions available. Add your first developer question!</p>';
        return;
    }

    let filtered = filterQuestionsList();

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 30px;">No questions match your current search/filter criteria.</p>';
        return;
    }

    let html = '';
    filtered.forEach((q) => {
        const realIndex = questions.indexOf(q);
        const codeHtml = q.codeSnippet ? `<pre class="code-block">${escapeHtml(q.codeSnippet)}</pre>` : '';
        html += `
            <div class="question-item">
                <div class="question-actions-btns">
                    <button class="icon-btn" onclick="showCreateQuestion(${realIndex})" title="Edit Question">✏️</button>
                    <button class="icon-btn delete" onclick="deleteQuestion(${realIndex})" title="Delete Question">🗑️</button>
                </div>
                <div class="question-tags">
                    <span class="badge ${q.difficulty}">${q.difficulty}</span>
                    <span class="badge category">${q.category || 'General'}</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Q${realIndex + 1}: ${escapeHtml(q.question)}</h4>
                ${codeHtml}
                <div style="margin: 10px 0 0 15px; color: var(--text-secondary); font-size: 0.9rem;">
                    <p>A) ${escapeHtml(q.options[0])}</p>
                    <p>B) ${escapeHtml(q.options[1])}</p>
                    <p>C) ${escapeHtml(q.options[2])}</p>
                    <p>D) ${escapeHtml(q.options[3])}</p>
                    <p style="font-weight: 700; color: var(--success-text); margin-top: 6px;">Correct: Option ${q.correct}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function filterQuestionsList() {
    const keyword = document.getElementById('searchKeyword')?.value.toLowerCase() || '';
    const difficultyFilter = document.getElementById('filterDifficulty')?.value || 'all';
    const categoryFilter = document.getElementById('filterCategory')?.value || 'all';

    return questions.filter(q => {
        const matchesKeyword = q.question.toLowerCase().includes(keyword) || (q.codeSnippet && q.codeSnippet.toLowerCase().includes(keyword));
        const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
        const matchesCat = categoryFilter === 'all' || q.category === categoryFilter;
        return matchesKeyword && matchesDiff && matchesCat;
    });
}

function filterQuestions() {
    displayQuestions();
}

function exportQuestions() {
    if (questions.length === 0) {
        alert('No questions to export!');
        return;
    }
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fullstack_quiz_questions.json';
    a.click();
    URL.revokeObjectURL(url);
    playSound('correct');
}

function importQuestions(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                questions = questions.concat(imported);
                saveQuestionsToStorage();
                displayQuestions();
                alert(`Successfully imported ${imported.length} questions!`);
                playSound('correct');
            } else {
                alert('Invalid file format. Expected a JSON array of questions.');
            }
        } catch (err) {
            alert('Error parsing JSON file: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// User Category Selection
function selectQuizCategory(category, element) {
    playSound('click');
    userCategoryFilter = category;
    document.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
}

// User Quiz Arena Engine
function startQuiz(difficulty) {
    loadQuestionsFromStorage();
    // Hide exit modal if active
    const exitModal = document.getElementById('exitModal');
    if (exitModal) exitModal.classList.remove('active');
    playSound('click');

    let filtered = questions.filter(q => q.difficulty === difficulty);
    if (userCategoryFilter !== 'all') {
        filtered = filtered.filter(q => q.category === userCategoryFilter);
    }

    if (filtered.length === 0) {
        alert(`No ${difficulty} level questions available for ${userCategoryFilter === 'all' ? 'any category' : userCategoryFilter}.`);
        return;
    }

    currentQuiz = shuffleArray(filtered).slice(0, Math.min(10, filtered.length));
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];

    hideAllScreens();
    document.getElementById('quizScreen').classList.add('active');
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        showResults();
        return;
    }

    const question = currentQuiz[currentQuestionIndex];
    selectedAnswer = '';

    // Update Progress Bar & Info
    const progressPercent = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.length}`;
    document.getElementById('categoryBadge').textContent = question.category || 'Full Stack';

    // Render Question & Code Snippet
    document.getElementById('currentQuestion').textContent = question.question;
    const codeBox = document.getElementById('codeSnippetBox');
    if (question.codeSnippet) {
        codeBox.textContent = question.codeSnippet;
        codeBox.classList.remove('hidden');
    } else {
        codeBox.classList.add('hidden');
    }

    // Render Options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    question.options.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const optCard = document.createElement('div');
        optCard.className = 'option-card';
        optCard.innerHTML = `
            <div class="option-letter">${letter}</div>
            <div>${escapeHtml(opt)}</div>
        `;
        optCard.onclick = () => selectOption(letter, optCard);
        optionsContainer.appendChild(optCard);
    });

    document.getElementById('explanationBox').classList.add('hidden');
    document.getElementById('nextBtn').classList.add('hidden');

    startTimer();
}

function startTimer() {
    clearInterval(questionTimer);
    timerSeconds = 30;
    document.getElementById('timerCount').textContent = timerSeconds;

    questionTimer = setInterval(() => {
        timerSeconds--;
        document.getElementById('timerCount').textContent = timerSeconds;
        if (timerSeconds <= 0) {
            clearInterval(questionTimer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    playSound('incorrect');
    const question = currentQuiz[currentQuestionIndex];
    userAnswers.push({
        question: question.question,
        codeSnippet: question.codeSnippet,
        selected: 'TIMEOUT',
        correct: question.correct,
        isCorrect: false,
        explanation: question.explanation
    });

    // Highlight correct answer
    document.querySelectorAll('.option-card').forEach((card, idx) => {
        const letter = String.fromCharCode(65 + idx);
        if (letter === question.correct) card.classList.add('correct');
        card.style.pointerEvents = 'none';
    });

    showExplanation(question.explanation);
    document.getElementById('nextBtn').classList.remove('hidden');
}

function selectOption(answer, element) {
    clearInterval(questionTimer);
    playSound('click');

    document.querySelectorAll('.option-card').forEach(opt => {
        opt.classList.remove('selected');
        opt.style.pointerEvents = 'none';
    });

    element.classList.add('selected');
    selectedAnswer = answer;

    setTimeout(() => {
        const question = currentQuiz[currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correct;

        if (isCorrect) {
            score++;
            playSound('correct');
        } else {
            playSound('incorrect');
        }

        userAnswers.push({
            question: question.question,
            codeSnippet: question.codeSnippet,
            selected: selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect,
            explanation: question.explanation
        });

        document.querySelectorAll('.option-card').forEach((card, idx) => {
            const letter = String.fromCharCode(65 + idx);
            if (letter === question.correct) {
                card.classList.add('correct');
                card.classList.remove('selected');
            } else if (letter === selectedAnswer && !isCorrect) {
                card.classList.add('incorrect');
                card.classList.remove('selected');
            }
        });

        showExplanation(question.explanation);
        document.getElementById('nextBtn').classList.remove('hidden');
    }, 350);
}

function showExplanation(explanationText) {
    const expBox = document.getElementById('explanationBox');
    if (explanationText) {
        expBox.innerHTML = `<strong>💡 Explanation:</strong> ${escapeHtml(explanationText)}`;
        expBox.classList.remove('hidden');
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function openExitModal() {
    playSound('click');
    document.getElementById('exitModal').classList.add('active');
}

function closeExitModal() {
    playSound('click');
    document.getElementById('exitModal').classList.remove('active');
}

function confirmExitQuiz() {
    playSound('click');
    document.getElementById('exitModal').classList.remove('active');
    clearInterval(questionTimer);
    goToUserDashboard();
}

function endQuiz() {
    openExitModal();
}

function showResults() {
    clearInterval(questionTimer);
    hideAllScreens();
    document.getElementById('resultsScreen').classList.add('active');

    const total = currentQuiz.length;
    const percentage = Math.round((score / total) * 100);

    document.getElementById('scoreText').textContent = `${score}/${total}`;
    document.getElementById('scorePercent').textContent = `${percentage}%`;

    // Animate Circular Stroke
    const fillCircle = document.getElementById('scoreCircleFill');
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    fillCircle.style.strokeDashoffset = offset;

    let icon = '🏆';
    let title = 'Senior Developer!';
    let msg = 'Outstanding performance across Full Stack concepts!';

    if (percentage >= 80) {
        icon = '🚀';
        title = 'Exceptional Mastery!';
        msg = 'You demonstrated top-tier Full Stack Engineering skills!';
        triggerConfetti();
        playSound('victory');
    } else if (percentage >= 60) {
        icon = '⚡';
        title = 'Solid Performance!';
        msg = 'Great job! A bit more practice on edge cases will make you unstoppable.';
    } else {
        icon = '📚';
        title = 'Keep Building!';
        msg = 'Review the detailed answer breakdown below to plug your knowledge gaps.';
    }

    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = msg;

    if (developerProfile) {
        document.getElementById('resCandidateName').textContent = `Candidate: ${developerProfile.name}`;
        document.getElementById('resCandidateMeta').textContent = `${developerProfile.email} | ${developerProfile.experience} ${developerProfile.stack} Developer`;
        document.getElementById('resultsCandidateBanner').style.display = 'block';
    } else {
        document.getElementById('resultsCandidateBanner').style.display = 'none';
    }

    renderAnswerReview();
}

function renderAnswerReview() {
    const container = document.getElementById('reviewListContent');
    let html = '';
    userAnswers.forEach((ans, idx) => {
        const itemClass = ans.isCorrect ? 'correct-item' : 'incorrect-item';
        const code = ans.codeSnippet ? `<pre class="code-block">${escapeHtml(ans.codeSnippet)}</pre>` : '';
        html += `
            <div class="review-item ${itemClass}">
                <h5 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">Q${idx + 1}: ${escapeHtml(ans.question)}</h5>
                ${code}
                <div style="font-size: 0.88rem; margin-top: 8px;">
                    <span style="color: ${ans.isCorrect ? 'var(--success-text)' : 'var(--error-text)'}; font-weight: 700;">
                        Your Choice: Option ${ans.selected}
                    </span> | 
                    <span style="color: var(--success-text); font-weight: 700;">
                        Correct: Option ${ans.correct}
                    </span>
                </div>
                ${ans.explanation ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">💡 ${escapeHtml(ans.explanation)}</p>` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

function toggleAnswerReview() {
    playSound('click');
    const panel = document.getElementById('answerReviewPanel');
    panel.classList.toggle('hidden');
}

// Canvas Confetti Celebration Engine
function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#10b981', '#38bdf8', '#fbbf24'];

    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360
        });
    }

    let animationFrame;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 2;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (particles.some(p => p.y < canvas.height)) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}

// Utility Helpers & LocalStorage Sync
function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function saveQuestionsToStorage() {
    try {
        localStorage.setItem('fullstack_questions', JSON.stringify(questions));
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

function loadQuestionsFromStorage() {
    try {
        const stored = localStorage.getItem('fullstack_questions');
        if (stored) {
            questions = JSON.parse(stored);
        } else {
            questions = defaultQuestions;
            saveQuestionsToStorage();
        }
    } catch (e) {
        questions = defaultQuestions;
    }
}

// PDF Assessment Report Generator
function downloadPdfReport() {
    playSound('click');

    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const total = currentQuiz.length;
    const percentage = Math.round((score / total) * 100);
    const devName = (typeof developerProfile !== 'undefined' && developerProfile?.name) ? developerProfile.name : 'Developer Candidate';
    const devDetails = (typeof developerProfile !== 'undefined' && developerProfile?.email) ? `${developerProfile.email} | ${developerProfile.experience || ''} ${developerProfile.stack || ''}` : 'Full Stack Engineering Assessment';

    let grade = 'Junior Developer';
    if (percentage >= 80) grade = 'Senior Full Stack Specialist';
    else if (percentage >= 60) grade = 'Mid-Level Full Stack Developer';

    const reportElement = document.createElement('div');
    reportElement.style.padding = '30px';
    reportElement.style.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    reportElement.style.color = '#0f172a';
    reportElement.style.backgroundColor = '#ffffff';

    let questionsHtml = '';
    userAnswers.forEach((ans, idx) => {
        const isPass = ans.isCorrect;
        const statusBadge = isPass 
            ? `<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px;">CORRECT ✅</span>`
            : `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px;">INCORRECT ❌</span>`;

        const codeSnippet = ans.codeSnippet ? `
            <pre style="background: #0f172a; color: #38bdf8; padding: 10px 14px; border-radius: 8px; font-size: 12px; font-family: monospace; white-space: pre-wrap; margin: 8px 0;">${escapeHtml(ans.codeSnippet)}</pre>
        ` : '';

        questionsHtml += `
            <div style="border: 1px solid #e2e8f0; border-left: 4px solid ${isPass ? '#10b981' : '#ef4444'}; border-radius: 10px; padding: 16px; margin-bottom: 14px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="font-size: 14px; color: #1e293b;">Q${idx + 1}: ${escapeHtml(ans.question)}</strong>
                    ${statusBadge}
                </div>
                ${codeSnippet}
                <div style="font-size: 13px; color: #475569; margin-top: 6px;">
                    <span>User Choice: <strong>Option ${ans.selected}</strong></span> | 
                    <span style="color: #059669;">Correct Answer: <strong>Option ${ans.correct}</strong></span>
                </div>
                ${ans.explanation ? `<p style="font-size: 12px; color: #64748b; margin-top: 6px; font-style: italic;">💡 ${escapeHtml(ans.explanation)}</p>` : ''}
            </div>
        `;
    });

    reportElement.innerHTML = `
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin: 0; font-size: 24px; color: #1e1b4b;">⚡ Full Stack Developer Assessment</h1>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Official Evaluation Report & Performance Summary</p>
                </div>
                <div style="text-align: right; font-size: 12px; color: #64748b;">
                    <div>Date: <strong>${dateStr}</strong></div>
                    <div>Candidate: <strong>${escapeHtml(devName)}</strong></div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; background: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="text-align: center;">
                <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700;">Score</span>
                <div style="font-size: 22px; font-weight: 800; color: #4f46e5; margin-top: 4px;">${score} / ${total}</div>
            </div>
            <div style="text-align: center; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">
                <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700;">Percentage</span>
                <div style="font-size: 22px; font-weight: 800; color: #0891b2; margin-top: 4px;">${percentage}%</div>
            </div>
            <div style="text-align: center;">
                <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700;">Rating</span>
                <div style="font-size: 16px; font-weight: 700; color: #059669; margin-top: 6px;">${grade}</div>
            </div>
        </div>

        <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Detailed Question Evaluation</h3>
        ${questionsHtml}

        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            Generated by Full Stack Developer Quiz Studio • ${dateStr}
        </div>
    `;

    if (typeof html2pdf !== 'undefined') {
        const opt = {
            margin:       10,
            filename:     `FullStack_Quiz_Report_${Date.now()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(reportElement).save();
    } else {
        const printWin = window.open('', '_blank');
        printWin.document.write(`
            <html>
                <head>
                    <title>Full Stack Quiz Report</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
                        @media print { body { padding: 0; } }
                    </style>
                </head>
                <body>
                    ${reportElement.innerHTML}
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWin.document.close();
    }
}
