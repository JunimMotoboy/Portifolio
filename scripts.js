const elemento = document.getElementById("cargo");

const palavras = [
  { texto: "Web Developer", destaque: [0, 3] },
    { texto: "Frontend Developer", destaque: [0, 8] },
  { texto: "JavaScript Developer", destaque: [0, 10] }
];
let i = 0;              
let index = 0;         
let modo = "digitando"; 
let timer = null;

function atualizarHTML(texto, destaque, tamanho) {
  const ini = texto.substring(0, destaque[0]);
  const meio = texto.substring(destaque[0], Math.min(destaque[1], tamanho));
  const fim = texto.substring(Math.min(destaque[1], tamanho), tamanho);

  elemento.innerHTML = `${ini}<span class="insta">${meio}</span>${fim}`;
}

function passo() {
  clearTimeout(timer); 

  const { texto, destaque } = palavras[i];
  const len = texto.length;

  if (modo === "digitando") {
  
    if (index < len) {
      index++;
      atualizarHTML(texto, destaque, index);

      
      timer = setTimeout(passo, 90);
    }

    if (index === len) {
   
      modo = "pausaNoFinal";
      timer = setTimeout(passo, 1500); 
    }
  } else if (modo === "pausaNoFinal") {
  
    modo = "apagando";
    timer = setTimeout(passo, 90);
  } else if (modo === "apagando") {
    if (index > 0) {
      index--;
      atualizarHTML(texto, destaque, index);
      timer = setTimeout(passo, 60);
    }

    if (index === 0) {
      
      modo = "pausaEntrePalavras";
      i = (i + 1) % palavras.length;
      timer = setTimeout(passo, 200); 
    }
  } else if (modo === "pausaEntrePalavras") {
    
    modo = "digitando";
    index = 0;

    timer = setTimeout(passo, 90);
  }
}

// inicializa
index = 0;
modo = "digitando";
atualizarHTML(palavras[0].texto, palavras[0].destaque, 0);
timer = setTimeout(passo, 300); 

// --- comportamento dos ícones de contato (acessibilidade + toque) ---
document.addEventListener('DOMContentLoaded', () => {
  const contactBtn = document.querySelector('.icon-hero > button[aria-controls="icons-list"]');
  const iconsList = document.getElementById('icons-list');

  if (!contactBtn || !iconsList) return;

  function openIcons() {
    contactBtn.setAttribute('aria-expanded', 'true');
    iconsList.classList.add('open');
    iconsList.setAttribute('aria-hidden', 'false');
  }

  function closeIcons() {
    contactBtn.setAttribute('aria-expanded', 'false');
    iconsList.classList.remove('open');
    iconsList.setAttribute('aria-hidden', 'true');
  }

  // Toggle por clique (útil para toque)
  contactBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = contactBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeIcons(); else openIcons();
  });

  // Suporte a teclado (Enter / Space para alternar, Esc para fechar)
  contactBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      contactBtn.click();
    }
    if (e.key === 'Escape') {
      closeIcons();
      contactBtn.blur();
    }
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!iconsList.classList.contains('open')) return;
    if (!e.target.closest('.icon-hero')) closeIcons();
  });
});
