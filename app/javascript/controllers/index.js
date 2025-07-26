import { application } from "@hotwired/stimulus"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"

// Chargez seulement les contrôleurs nécessaires
eagerLoadControllersFrom("controllers", application, ["form_controller"])