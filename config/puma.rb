# frozen_string_literal: true

# NOTE: Bridgetown's boot & config loader overrides this port; changing it here has no effect.
port(ENV.fetch("BRIDGETOWN_PORT", 4000))

workers(ENV.fetch("BRIDGETOWN_CONCURRENCY", 4)) if ENV["BRIDGETOWN_ENV"] == "production"

max_threads_count = ENV.fetch("BRIDGETOWN_MAX_THREADS", 5)
min_threads_count = ENV.fetch("BRIDGETOWN_MIN_THREADS") { max_threads_count }
threads(min_threads_count, max_threads_count)

pidfile(ENV["PIDFILE"] || "tmp/pids/server.pid")

preload_app!

require "bridgetown-core/rack/logger"

log_formatter do |msg|
  Bridgetown::Rack::Logger.message_with_prefix(msg)
end
