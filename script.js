/********************************************
 * 1. BOTÓN SUBIR (sin cambios)
 ********************************************/
window.addEventListener('scroll', () => {
  const btnSubir = document.getElementById('btn-subir');
  if (!btnSubir) return;
  if (window.scrollY > 300) {
    btnSubir.style.display = 'flex';
  } else {
    btnSubir.style.display = 'none';
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/********************************************
 * 2. MENÚ LATERAL Y OVERLAY (sin cambios)
 ********************************************/
function toggleSideMenu() {
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  if (sideMenu && overlay) {
    sideMenu.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

function closeSideMenu() {
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  if (sideMenu && overlay) {
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
  }
}

/********************************************
 * 3. CARRUSEL
 ********************************************/
let currentSlide = 0;
const slides = document.querySelectorAll('.carrusel-imagenes .servicio');
const totalSlides = slides.length;
const barraCarga = document.getElementById('barra-carga');
let slideInterval;

function moveSlide(direction) {
  // Detenemos el autoSlide para reiniciarlo luego
  clearInterval(slideInterval);

  // Actualizamos el índice del slide
  currentSlide += direction;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }

  // Calculamos la posición del carrusel
  const carruselImagenes = document.querySelector('.carrusel-imagenes');
  if (carruselImagenes) {
    const offset = -currentSlide * 100;
    carruselImagenes.style.transform = `translateX(${offset}%)`;
  }

  // [NUEVO] Cierra (colapsa) todas las descripciones abiertas
  // removiendo .active de cada .servicio
  const allServices = document.querySelectorAll('.carrusel-imagenes .servicio');
  allServices.forEach((serv) => {
    serv.classList.remove('active');
  });

  // Reiniciamos la barra y el autoSlide
  resetBarraCarga();
  autoSlide();
}

function autoSlide() {
  slideInterval = setInterval(() => {
    moveSlide(1);
  }, 5000);
}

function resetBarraCarga() {
  if (barraCarga) {
    barraCarga.style.width = '0%';
  }
}

// Soporte de arrastre en móvil
const carrusel = document.querySelector('.carrusel-imagenes');
let startX = 0;
let endX = 0;

if (carrusel) {
  carrusel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  carrusel.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });
  carrusel.addEventListener('touchend', () => {
    if (startX > endX + 50) {
      moveSlide(1);
    } else if (startX < endX - 50) {
      moveSlide(-1);
    }
  });
}

/********************************************
 * 4. LÓGICA DE SERVICIOS (ACORDEÓN)
 ********************************************/
const servicios = document.querySelectorAll('.servicio');
servicios.forEach((s) => {
  s.addEventListener('click', () => {
    s.classList.toggle('active');
  });
});

/********************************************
 * 5. MODALES (sin cambios)
 ********************************************/
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('mostrar');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('mostrar');
}

document.addEventListener('click', (e) => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (modal.classList.contains('mostrar') && e.target === modal) {
      modal.classList.remove('mostrar');
    }
  });
});

/********************************************
 * 6. ANIMACIONES ON SCROLL (sin cambios)
 ********************************************/
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/********************************************
 * 7. CARGA INICIAL (sin cambios)
 ********************************************/
window.onload = () => {
  if (totalSlides > 0) {
    autoSlide();
  }
  initScrollAnimations();
};

/********************************************
 * 8. CHATBOT "MAX/HBO" + BOTÓN TICKET COMPATIBLE
 ********************************************/

/**
 * toggleChat:
 * Abre o cierra el contenedor del chat. 
 * Cada vez que se abre, actualizamos la hora de Chile y mostramos menú principal.
 */
function toggleChat() {
  const chatContainer = document.getElementById('chat-max-container');
  chatContainer.classList.toggle('active');
  
  if (chatContainer.classList.contains('active')) {
    updateChileTime();
    showMainMenu();
  }
}

/**
 * updateChileTime:
 * Calcula la hora en la zona horaria de Chile y la muestra
 * en el elemento <p class="chat-max-time">.
 */
function updateChileTime() {
  const timeElement = document.querySelector('.chat-max-time');
  if (!timeElement) return;

  const chileDate = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  timeElement.textContent = `Hoy a las ${chileDate}`;
}

/**
 * showMainMenu:
 * Menú principal del chatbot. Incluye un botón de "Crear Ticket"
 * para mandar correo desde PC (o cualquier dispositivo con cliente de correo).
 */
function showMainMenu() {
  const buttonsContainer = document.getElementById('chat-buttons-container');
  if (!buttonsContainer) return;
  buttonsContainer.innerHTML = '';

  // Botón Betel
  const btnBetel = document.createElement('button');
  btnBetel.classList.add('chat-max-btn');
  btnBetel.textContent = 'Betel';
  btnBetel.onclick = () => showBetelMenu();

  // Botón OTEC
  const btnOtec = document.createElement('button');
  btnOtec.classList.add('chat-max-btn');
  btnOtec.textContent = 'OTEC';
  btnOtec.onclick = () => showOtecMenu();

  // Botón "Crear Ticket"
  const btnTicket = document.createElement('button');
  btnTicket.classList.add('chat-max-btn');
  btnTicket.textContent = 'Crear Ticket';
  btnTicket.onclick = () => sendTicket();

  buttonsContainer.appendChild(btnBetel);
  buttonsContainer.appendChild(btnOtec);
  buttonsContainer.appendChild(btnTicket);
}

/**
 * Submenú Betel
 */
function showBetelMenu() {
  const buttonsContainer = document.getElementById('chat-buttons-container');
  if (!buttonsContainer) return;
  buttonsContainer.innerHTML = '';

  const btnQuienesSomos = document.createElement('button');
  btnQuienesSomos.classList.add('chat-max-btn');
  btnQuienesSomos.textContent = '¿Quiénes Somos (Betel)?';
  btnQuienesSomos.onclick = () => botMessage(
    'Somos Betel, empresa comprometida con la salud ocupacional, seguridad y calidad de vida laboral.'
  );

  const btnQueHacemos = document.createElement('button');
  btnQueHacemos.classList.add('chat-max-btn');
  btnQueHacemos.textContent = '¿Qué Hacemos? (Betel)';
  btnQueHacemos.onclick = () => botMessage(
    'Brindamos soluciones integrales: ambulancia 24/7, gestión de ausentismo, telemedicina, etc.'
  );

  const btnServicios = document.createElement('button');
  btnServicios.classList.add('chat-max-btn');
  btnServicios.textContent = 'Nuestros Servicios (Betel)';
  btnServicios.onclick = () => botMessage(
    'Rescate en faenas, asesorías en liderazgo, comunicaciones internas, entre otros.'
  );

  const btnContacto = document.createElement('button');
  btnContacto.classList.add('chat-max-btn');
  btnContacto.textContent = 'Contacto';
  btnContacto.onclick = () => goToContactSection();

  const btnAtras = document.createElement('button');
  btnAtras.classList.add('chat-max-btn');
  btnAtras.textContent = '← Volver';
  btnAtras.onclick = () => showMainMenu();

  buttonsContainer.appendChild(btnQuienesSomos);
  buttonsContainer.appendChild(btnQueHacemos);
  buttonsContainer.appendChild(btnServicios);
  buttonsContainer.appendChild(btnContacto);
  buttonsContainer.appendChild(btnAtras);
}

/**
 * Submenú OTEC
 */
function showOtecMenu() {
  const buttonsContainer = document.getElementById('chat-buttons-container');
  if (!buttonsContainer) return;
  buttonsContainer.innerHTML = '';

  const btnQuienesSomos = document.createElement('button');
  btnQuienesSomos.classList.add('chat-max-btn');
  btnQuienesSomos.textContent = '¿Quiénes Somos (OTEC)?';
  btnQuienesSomos.onclick = () => botMessage(
    'OTEC Betel se dedica a la formación continua, ofreciendo cursos de liderazgo, comunicación, primeros auxilios...'
  );

  const btnQueHacemos = document.createElement('button');
  btnQueHacemos.classList.add('chat-max-btn');
  btnQueHacemos.textContent = '¿Qué Hacemos? (OTEC)';
  btnQueHacemos.onclick = () => botMessage(
    'Diseñamos programas de capacitación en salud ocupacional, calidad de vida, etc.'
  );

  const btnCursos = document.createElement('button');
  btnCursos.classList.add('chat-max-btn');
  btnCursos.textContent = 'Nuestros Cursos (OTEC)';
  btnCursos.onclick = () => botMessage(
    'Cursos a distancia: liderazgo, comunicación efectiva, manejo de conflictos, etc.'
  );

  const btnContacto = document.createElement('button');
  btnContacto.classList.add('chat-max-btn');
  btnContacto.textContent = 'Contacto';
  btnContacto.onclick = () => goToContactSection();

  const btnAtras = document.createElement('button');
  btnAtras.classList.add('chat-max-btn');
  btnAtras.textContent = '← Volver';
  btnAtras.onclick = () => showMainMenu();

  buttonsContainer.appendChild(btnQuienesSomos);
  buttonsContainer.appendChild(btnQueHacemos);
  buttonsContainer.appendChild(btnCursos);
  buttonsContainer.appendChild(btnContacto);
  buttonsContainer.appendChild(btnAtras);
}

/**
 * Muestra un mensaje del bot en el panel del chat
 */
function botMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;
  const newBubble = document.createElement('div');
  newBubble.classList.add('chat-max-bubble', 'bot-bubble');
  newBubble.innerHTML = `<p>${message}</p>`;
  chatMessages.appendChild(newBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Envío de "ticket" vía mailto, compatible con PC (Windows, macOS, Linux)
 * y también con clientes móviles, siempre que exista un cliente de correo configurado.
 */
function sendTicket() {
  // Obtenemos la hora de Chile
  const nowChile = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const bodyText = `Hola,%0D%0A%0D%0A` +
                   `Se ha creado un ticket a las ${nowChile} (hora Chile).%0D%0A` +
                   `Por favor, revisar los detalles.%0D%0A%0D%0A` +
                   `¡Gracias!`;

  // Construimos la URL mailto
  // Nota: Usar encodeURIComponent si deseas codificar espacios y caracteres especiales
  // Aquí uso %0D%0A para saltos de línea.
  const mailtoURL = `mailto:betel@gmail.com?subject=Nuevo%20Ticket%20desde%20Chat&body=${bodyText}`;

  // Abre el enlace mailto
  window.location.href = mailtoURL;
}

/**
 * Desplaza la ventana hasta la sección de contacto
 */
function goToContactSection() {
  window.location.href = '#contacto';
}
