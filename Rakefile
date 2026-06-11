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

namespace :post do
  desc "Scaffold a new blog post: rake \"post:new[2026-06-04,記事タイトル]\""
  task :new, %i[date title] do |_t, args|
    require "date"
    require "fileutils"

    date = args[:date] ? Date.parse(args[:date]) : Date.today
    iso = date.strftime("%Y-%m-%d")
    title = args[:title].to_s

    post_path = File.join("src", "_posts", "#{iso}-post.md")
    asset_dir = File.join("src", iso)

    abort "既に存在します: #{post_path}" if File.exist?(post_path)

    File.write(post_path, <<~MARKDOWN)
      ---
      title: #{title}
      description: ''
      date: #{date.strftime("%b %d %Y")}
      layout: post
      permalink: "/blog/#{iso}/"
      ---
      _Written by Human._
    MARKDOWN

    FileUtils.mkdir_p(asset_dir)

    puts "作成しました: #{post_path}"
    puts "アセットディレクトリ: #{asset_dir}/"
  end
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
