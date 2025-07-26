# config/importmap.rb

# Core Rails
pin "application", preload: true
pin "@rails/actioncable", to: "actioncable.esm.js"

# Hotwire
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true

# Contrôleurs
pin_all_from "app/javascript/controllers", under: "controllers", preload: true

# Utilitaires
pin "@rails/request.js", to: "request.js"
