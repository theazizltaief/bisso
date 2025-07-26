import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  confirm(event) {
    if (!confirm(this.element.dataset.turboConfirm)) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }
}