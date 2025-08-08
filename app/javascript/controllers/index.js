import { application } from "./application"

// On importe et enregistre chaque contrôleur manuellement
import HelloController from "./hello_controller"
import ConfirmController from "./confirm_controller"
import vitrine1_controller from "./vitrine1_controller"
import brands_slider_controller from "./brands_slider_controller"
import brand_perfumes_controller from "./brand_perfumes_controller"
import category_perfumes_controller from "./category_perfumes_controller"
import cart_controller from "./cart_controller"
import all_perfumes_controller from "./all_perfumes_controller"
import search_controller from "./search_controller"


application.register("hello", HelloController)
application.register("confirm", ConfirmController)
application.register("vitrine1",vitrine1_controller)
application.register("brands-slider",brands_slider_controller)
application.register("brand-perfumes",brand_perfumes_controller)
application.register("category-perfumes",category_perfumes_controller)
application.register("cart",cart_controller)
application.register("all-perfumes", all_perfumes_controller)
application.register("search", search_controller)