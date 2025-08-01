import { application } from "./application"

// On importe et enregistre chaque contrôleur manuellement
import HelloController from "./hello_controller"
import ConfirmController from "./confirm_controller"
import vitrine1_controller from "./vitrine1_controller"
import vitrine2_controller from "./vitrine2_controller"
import vitrine3_controller from "./vitrine3_controller"

application.register("hello", HelloController)
application.register("confirm", ConfirmController)
application.register("vitrine1",vitrine1_controller)
application.register("vitrine2",vitrine2_controller)
application.register("vitrine3",vitrine3_controller)