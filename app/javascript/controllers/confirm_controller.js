import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  confirm(event) {
    const message = this.element.dataset.confirmMessage || "Êtes-vous sûr de vouloir supprimer ?"
    if (!window.confirm(message)) {
      event.preventDefault()
    }
  }
}