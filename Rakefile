# frozen_string_literal: true
require "bridgetown"

Bridgetown.load_tasks

task default: :deploy

desc "Build the Bridgetown site for deployment"
task deploy: [:clean, "frontend:build"] do
  Bridgetown::Commands::Build.start
end

desc "Build the site in a test environment"
task :test do
  ENV["BRIDGETOWN_ENV"] = "test"
  Bridgetown::Commands::Build.start
end

desc "Runs the clean command"
task :clean do
  Bridgetown::Commands::Clean.start
end

namespace :frontend do
  desc "Build the frontend with esbuild for deployment"
  task :build do
    sh "node esbuild.config.js --minify"
  end

  desc "Watch the frontend with esbuild during development"
  task :dev do
    sh "node esbuild.config.js --watch"
  rescue Interrupt
  end
end
