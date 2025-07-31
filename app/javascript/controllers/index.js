import { application } from "./application"

// On importe et enregistre chaque contrôleur manuellement
import HelloController from "./hello_controller"
import ConfirmController from "./confirm_controller"

application.register("hello", HelloController)
application.register("confirm", ConfirmController)

