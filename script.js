
// --- CONFIGURACIÓN DE GROQ API ---
const GROQ_API_KEY = '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'; 
// ... (el resto de tu código normal)// --- CONFIGURACIÓN DE GROQ API --- 
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b'; 

// --- VARIABLES GLOBALES ---
let currentPetName = "Lambie";
let currentPetAnimal = "Oveja";
let currentPetsrc = "./assets/lambiemas.png";
let chatHistory = [];

// --- NAVEGACIÓN Y LOGIN ---
// Usamos window. para asegurar que el HTML encuentre la función al hacer clic
window.simularLogin = function() {
    console.log("Intentando iniciar sesión..."); // Mensaje de prueba para la consola
    
    let landingView = document.getElementById('landing-view');
    let navbar = document.querySelector('.navbar');
    let appView = document.getElementById('app-view');

    if (landingView) landingView.style.display = 'none';
    if (navbar) navbar.style.display = 'none';
    
    if (appView) {
        appView.style.display = 'block';
        console.log("¡Pantalla de la app mostrada con éxito!");
    } else {
        console.error("Error: No se encontró el contenedor de la aplicación.");
    }
};

// --- SELECCIÓN DE MASCOTA Y CUESTIONARIO ---
selectPet = function(id, name, animal, src) {
    currentPetName = name;
    currentPetAnimal = animal;
    currentPetsrc = src;
    sessionStorage.setItem('selectedPet', JSON.stringify({
        name: currentPetName, 
        src:currentPetsrc, 
        animal: currentPetAnimal
    }));
    document.getElementById('pet-selection-screen').style.display = 'none';
    document.getElementById('pet-greeting-modal').innerText = `¡Hola! Soy ${currentPetName}`;
    document.getElementById('modal-questionnaire').style.display = 'flex';
};

submitQuestionnaire = function() {
    let challenge = document.getElementById('q-challenge').value;
    let recommendation = "";

    if (challenge === "concentracion") {
        console.log("Pepe");
        recommendation = "Te sugiero usar el **Pomodoro** para enfocarte en bloques cortos.";
    } else if (challenge === "memorizacion") {
        recommendation = "Usemos **Active Recall** y **Flashcards** para fortalecer tu memoria.";
    } else {
        recommendation = "La **Técnica Feynman** será ideal para simplificar esos temas complejos.";
        }

    sessionStorage.setItem('recommendation-shit', recommendation);
};

window.onload = function() {
    const savedRecommendation = sessionStorage.getItem('recommendation-shit');
    const textElement = document.getElementById('recommendation-text');
    const savedPet = JSON.parse(sessionStorage.getItem('selectedPet'))
    if (savedRecommendation && textElement) {
        textElement.innerHTML = savedRecommendation.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }
    if (savedPet && savedPet.src){
        const petImg = document.getElementById('floating-pet-img');
        petImg.src = `${savedPet.src}`;
        
        const bubble = document.getElementById('pet-speech-bubble');
        bubble.innerText = `¡Hola soy ${savedPet.name}! Haz clic en mí para estudiar.`;
    }
};
// --- LÓGICA DEL POMODORO ---
let pomoTimeLeft = 25 * 60;
let pomoInterval = null;
let pomoIsRunning = false;
let pomoCurrentMode = 'pomodoro';

const pomoTimes = { 'pomodoro': 25 * 60, 'short': 5 * 60, 'long': 15 * 60 };

window.setPomodoroMode = function(mode) {
    clearInterval(pomoInterval);
    pomoIsRunning = false;
    pomoCurrentMode = mode;
    pomoTimeLeft = pomoTimes[mode];
    
    document.querySelectorAll('.pomo-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${mode === 'pomodoro' ? 'pomo' : mode}`).classList.add('active');
    document.getElementById('pomo-start-btn').innerText = "START";
    updatePomoDisplay();
};

window.togglePomodoro = function() {
    let btn = document.getElementById('pomo-start-btn');
    if (pomoIsRunning) {
        clearInterval(pomoInterval);
        btn.innerText = "START";
    } else {
        pomoInterval = setInterval(() => {
            pomoTimeLeft--;
            updatePomoDisplay();
            if (pomoTimeLeft <= 0) {
                clearInterval(pomoInterval);
                alert("¡Tiempo terminado!");
                window.skipPomodoro();
            }
        }, 1000);
        btn.innerText = "PAUSE";
    }
    pomoIsRunning = !pomoIsRunning;
};

window.skipPomodoro = function() {
    if (pomoCurrentMode === 'pomodoro') window.setPomodoroMode('short');
    else window.setPomodoroMode('pomodoro');
};

function updatePomoDisplay() {
    let m = Math.floor(pomoTimeLeft / 60).toString().padStart(2, '0');
    let s = (pomoTimeLeft % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${m}:${s}`;
}

// --- LISTA DE TAREAS ---
window.addTask = function() {
    let input = document.getElementById('new-task-input');
    let text = input.value.trim();
    if (text !== "") {
        let li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> <span>${text}</span>`;
        document.getElementById('task-list').appendChild(li);
        input.value = "";
    }
};

// --- CHAT IA ---
window.toggleChat = function() {
    const savedPet = JSON.parse(sessionStorage.getItem('selectedPet'));
    let chat = document.getElementById('chat-container');
    let speechBubble = document.getElementById('pet-speech-bubble');
    
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.style.display = 'flex';
        if(speechBubble) speechBubble.style.display = 'none';
        if (savedPet && savedPet.name){

            const ChatTitle = document.getElementById('chat-title');
            ChatTitle.innerText = `${savedPet.name} (Tu Tutor)`;
            console.log("Si sirve el nombre en el chat")
        }
    } else {
        chat.style.display = 'none';
    }
};

window.triggerAIChat = function(toolMode) {
    if (document.getElementById('chat-container').style.display === 'none') {
        window.toggleChat();
    }
    const savedPet = JSON.parse(sessionStorage.getItem('selectedPet'));
    let currentPetName = savedPet.name ;
    let prompt = "";
    if (toolMode === 'activerecall') prompt = `¡Hola ${currentPetName}! Quiero practicar Active Recall. Hazme una pregunta sobre un tema que te diré a continuación.`;
    else if (toolMode === 'feynman') prompt = `¡Hola ${currentPetName}! Quiero usar la Técnica Feynman. Te voy a explicar un tema y quiero que me digas si lo entendí bien y corrijas mis errores de forma sencilla.`;
    else if (toolMode === 'brainstorm') prompt = `¡Hola ${currentPetName}! Necesito hacer una lluvia de ideas. Ayúdame a generar ideas creativas sobre el tema que te daré en mi siguiente mensaje.`;
    else if (toolMode === 'flashcards') prompt = `¡Hola ${currentPetName}! Ayúdame a crear Flashcards (tarjetas de estudio). Dame conceptos clave en formato "Pregunta / Respuesta".`;
    else if (toolMode === 'mapamental') prompt = `¡Hola ${currentPetName}! Ayúdame a estructurar un Mapa Mental. Dime cuál sería el concepto central y cuáles serían las ramas principales y secundarias del tema que te pediré.`;
    else if (toolMode === 'datos') prompt = `¡Hola ${currentPetName}! Dime un dato interesante o divertido relacionado con la ciencia o tecnología que me motive a seguir estudiando.`;

    document.getElementById('user-input').value = prompt;
};

// Aseguramos que los "escuchadores" de clics del chat se carguen solo cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    let sendBtn = document.getElementById('send-btn');
    let userInput = document.getElementById('user-input');
    
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
});

async function sendMessage() {
    let inputEl = document.getElementById('user-input');
    let text = inputEl.value.trim();
    if (text === "") return;
    
    addMessageToUI(text, 'user');
    inputEl.value = "";
    chatHistory.push({ role: "user", content: text });
    
    let typingId = addMessageToUI("Escribiendo...", 'bot');

    try {

        const savedPet = JSON.parse(sessionStorage.getItem('selectedPet'));
        let currentPetName = savedPet.name;
        let currentPetAnimal = savedPet.animal;
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: `Eres ${currentPetName}, un animal (${currentPetAnimal}) amigable y motivador que ayuda a estudiantes. Responde de forma amena y usa emojis.` },
                    ...chatHistory
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });

        const data = await response.json();
        document.getElementById(typingId).remove();

        if (data.choices && data.choices.length > 0) {
            let botReply = data.choices[0].message.content;
            chatHistory.push({ role: "assistant", content: botReply });
            addMessageToUI(botReply, 'bot', true); 
        } else {
            addMessageToUI("Error de conexión. ¿Intentamos de nuevo?", 'bot');
        }

    } catch (error) {
        console.error("Error API:", error);
        document.getElementById(typingId).remove();
        addMessageToUI("Uy, mi conexión falló.", 'bot');
    }
}

function addMessageToUI(text, sender, isMarkdown = false) {
    let chatBox = document.getElementById('chat-messages');
    let msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');
    let id = 'msg-' + Date.now();
    msgDiv.id = id;

    if (isMarkdown && typeof marked !== 'undefined') msgDiv.innerHTML = marked.parse(text);
    else msgDiv.innerText = text;

    chatBox.appendChild(msgDiv);
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(msgDiv, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}