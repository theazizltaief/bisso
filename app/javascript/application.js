// Import de base
import { Turbo } from "@hotwired/turbo-rails"
import "controllers"

// Configuration Turbo
Turbo.config.forms.confirm = (message) => {
  // Fallback sécurisé si window.confirm est bloqué
  try {
    return window.confirm(message)
  } catch (e) {
    console.error("Confirm blocked:", e)
    return true // Autorise la soumission par défaut
  }
}

// Initialisation après chargement
document.addEventListener("turbo:load", () => {
  // Gestion du flash
  const flashContainer = document.getElementById("flash") || (() => {
    const container = document.createElement('div')
    container.id = "flash"
    container.className = "position-fixed top-0 end-0 p-3"
    document.body.prepend(container)
    return container
  })()

  // Auto-dismiss des alerts après 5s
  flashContainer.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s'
      alert.style.opacity = '0'
      setTimeout(() => alert.remove(), 500)
    }, 5000)
  })

  // Tooltips Bootstrap
  if (typeof bootstrap?.Tooltip === 'function') {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el, {
        trigger: 'hover focus'
      })
    })
  }
})

// Gestion des erreurs Turbo
document.addEventListener("turbo:frame-missing", (event) => {
  event.preventDefault()
  window.location.href = event.detail.response.url
})