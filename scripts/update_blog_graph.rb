require_relative 'pixela'

username = ENV.fetch('PIXELA_USERNAME')
token    = ENV.fetch('PIXELA_USER_TOKEN')

changed_files = $stdin.read.split("\n").map(&:strip).reject(&:empty?)

if changed_files.empty?
  puts 'No post files changed, skipping.'
  exit 0
end

counts = Hash.new(0)
changed_files.each do |path|
  basename = File.basename(path)
  m = basename.match(/\A(\d{4}-\d{2}-\d{2})-/)
  counts[m[1]] += 1 if m
end

counts.each do |date, count|
  puts "Updating blog/#{date}: #{count}"
  Pixela.upsert(username: username, token: token, graph_id: 'blog', date: date, quantity: count)
end
