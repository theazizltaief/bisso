import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.setupValidation()
  }

  setupValidation() {
    // Validation Bootstrap
    this.element.addEventListener('submit', (event) => {
      if (!this.element.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.element.classList.add('was-validated')
    }, false)
  }
}