const elemento = document.getElementById('cargo')

const palavras = [
  { texto: 'Web Developer', destaque: [0, 3] },
  { texto: 'Frontend Developer', destaque: [0, 8] },
  { texto: 'JavaScript Developer', destaque: [0, 10] },
]
let i = 0
let index = 0
let modo = 'digitando'
let timer = null

function atualizarHTML(texto, destaque, tamanho) {
  const ini = texto.substring(0, destaque[0])
  const meio = texto.substring(destaque[0], Math.min(destaque[1], tamanho))
  const fim = texto.substring(Math.min(destaque[1], tamanho), tamanho)

  elemento.innerHTML = `${ini}<span class="insta">${meio}</span>${fim}`
}

function passo() {
  clearTimeout(timer)

  const { texto, destaque } = palavras[i]
  const len = texto.length

  if (modo === 'digitando') {
    if (index < len) {
      index++
      atualizarHTML(texto, destaque, index)

      timer = setTimeout(passo, 90)
    }

    if (index === len) {
      modo = 'pausaNoFinal'
      timer = setTimeout(passo, 1500)
    }
  } else if (modo === 'pausaNoFinal') {
    modo = 'apagando'
    timer = setTimeout(passo, 90)
  } else if (modo === 'apagando') {
    if (index > 0) {
      index--
      atualizarHTML(texto, destaque, index)
      timer = setTimeout(passo, 60)
    }

    if (index === 0) {
      modo = 'pausaEntrePalavras'
      i = (i + 1) % palavras.length
      timer = setTimeout(passo, 200)
    }
  } else if (modo === 'pausaEntrePalavras') {
    modo = 'digitando'
    index = 0

    timer = setTimeout(passo, 90)
  }
}

index = 0
modo = 'digitando'
atualizarHTML(palavras[0].texto, palavras[0].destaque, 0)
timer = setTimeout(passo, 300)

// --- Letras caindo ---
function createFallingLetters() {
  const container = document.querySelector('.falling-letters')
  if (!container) return

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]();HTML CSS JS'
  const numberOfLetters = 30

  for (let i = 0; i < numberOfLetters; i++) {
    const span = document.createElement('span')
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    span.textContent = randomLetter

    span.style.left = Math.random() * 100 + '%'


    const duration = Math.random() * 7 + 8
    span.style.animationDuration = duration + 's'


    span.style.animationDelay = Math.random() * 5 + 's'

  
    span.style.fontSize = Math.random() * 10 + 16 + 'px'

    container.appendChild(span)
  }
}

// --- Animação de entrada das habilidades ---
function animateSkills() {
  const skillCards = document.querySelectorAll('.skill-card')
  const skillsSection = document.querySelector('.section-skills')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Adicionar classe animate a todos os cards quando a seção aparecer
          skillCards.forEach((card) => {
            card.classList.add('animate')
          })
          // Parar de observar após animar
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.3, // Animar quando 30% da seção estiver visível
    }
  )

  if (skillsSection) {
    observer.observe(skillsSection)
  }
}

// --- Animação de entrada dos projetos ---
function animateProjects() {
  const projectCards = document.querySelectorAll('.project-card')
  const projectsSection = document.querySelector('.section-projects')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Adicionar classe animate a todos os cards quando a seção aparecer
          projectCards.forEach((card) => {
            card.classList.add('animate')
          })
          // Parar de observar após animar
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.2, // Animar quando 20% da seção estiver visível
    }
  )

  if (projectsSection) {
    observer.observe(projectsSection)
  }
}

// --- comportamento dos ícones de contato (acessibilidade + toque) ---
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar letras caindo
  createFallingLetters()

  // Inicializar animação de habilidades
  animateSkills()

  // Inicializar animação de projetos
  animateProjects()

  console.log('[icons] scripts.js carregado')
  const contactBtn = document.querySelector(
    '.icon-hero > button[aria-controls="icons-list"]'
  )
  const iconsList = document.getElementById('icons-list')

  if (!contactBtn || !iconsList) return

  function openIcons() {
    contactBtn.setAttribute('aria-expanded', 'true')
    iconsList.classList.add('open')
    iconsList.setAttribute('aria-hidden', 'false')
    console.log('[icons] aberto')
  }

  function closeIcons() {
    contactBtn.setAttribute('aria-expanded', 'false')
    iconsList.classList.remove('open')
    iconsList.setAttribute('aria-hidden', 'true')
    console.log('[icons] fechado')
  }

  // Toggle por clique (útil para toque)
  contactBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const expanded = contactBtn.getAttribute('aria-expanded') === 'true'
    console.log('[icons] clique - expanded =', expanded)
    if (expanded) closeIcons()
    else openIcons()
  })

  // Suporte a teclado (Enter / Space para alternar, Esc para fechar)
  contactBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      contactBtn.click()
    }
    if (e.key === 'Escape') {
      closeIcons()
      contactBtn.blur()
    }
  })

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!iconsList.classList.contains('open')) return
    if (!e.target.closest('.icon-hero')) closeIcons()
  })

  // --- Toast helper ---
  const toastContainer = document.getElementById('toast-container')

  function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) return null

    const toast = document.createElement('div')
    toast.className = `toast ${type}`
    toast.setAttribute('role', 'status')
    toast.setAttribute('aria-live', 'polite')

    // spinner only for info (in progress)
    const spinner = document.createElement('div')
    spinner.className = 'spinner'

    const msg = document.createElement('div')
    msg.className = 'msg'
    msg.textContent = message

    if (type === 'info') {
      toast.appendChild(spinner)
    }
    toast.appendChild(msg)

    toastContainer.appendChild(toast)

    // ensure animation trigger
    requestAnimationFrame(() => toast.classList.add('show'))

    let timeoutId = null
    if (duration > 0) {
      timeoutId = setTimeout(() => closeToast(toast), duration)
    }

    // return controls for caller if they want to close earlier
    return {
      element: toast,
      close: () => {
        clearTimeout(timeoutId)
        closeToast(toast)
      },
    }
  }

  function closeToast(toast) {
    if (!toast) return
    toast.classList.remove('show')
    // wait for transition then remove
    setTimeout(() => {
      toast.remove()
    }, 220)
  }

  // --- Download do currículo ---
  // Botão na hero-section com id="download-cv"
  const downloadLink = document.getElementById('download-cv')
  if (downloadLink) {
    downloadLink.addEventListener('click', async (e) => {
      // Evita comportamento padrão para usar fetch e garantir download
      e.preventDefault()

      const url = downloadLink.getAttribute('href')
      if (!url) return

      // exibe toast de progresso (sem fechar automaticamente)
      const progressToast = showToast('Iniciando download...', 'info', 0)

      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Arquivo não encontrado')

        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        // nome de arquivo sugerido para o download (nome real fornecido pelo usuário)
        a.download = 'Paulo Vitor Silva Santana.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()

        // libera memória
        URL.revokeObjectURL(blobUrl)
        // fechar toast de progresso e mostrar sucesso
        if (progressToast) progressToast.close()
        showToast('Download concluído — arquivo salvo', 'success', 3000)
      } catch (err) {
        // fechar toast de progresso
        if (progressToast) progressToast.close()
        console.error('[download] erro ao baixar currículo:', err)
        showToast('Erro ao baixar o arquivo', 'error', 4500)
        // fallback: abrir em nova aba (ou o navegador fará o download se possível)
        window.open(url, '_blank')
      }
    })
  }
})
