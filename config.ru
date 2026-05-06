# frozen_string_literal: true
require "bridgetown-core/rack/boot"

Bridgetown::Rack.boot

run RodaApp.freeze.app # see server/roda_app.rb
