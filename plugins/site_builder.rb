# frozen_string_literal: true
# Base class for the site's builders. Bridgetown auto-discovers and runs every
# SiteBuilder.descendants on the site:pre_read hook (see bridgetown-builder.rb),
# so this wrapper is the registration mechanism — not dead indirection.
class SiteBuilder < Bridgetown::Builder
end
