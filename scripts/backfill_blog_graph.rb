require_relative 'pixela'

username  = ENV.fetch('PIXELA_USERNAME')
token     = ENV.fetch('PIXELA_USER_TOKEN')
posts_dir = File.expand_path('../src/_posts', __dir__)

counts = Hash.new(0)
Dir.glob(File.join(posts_dir, '*.md')).each do |path|
  m = File.basename(path).match(/\A(\d{4}-\d{2}-\d{2})-/)
  counts[m[1]] += 1 if m
end

puts "#{counts.size} dates to backfill..."
counts.each do |date, count|
  puts "  blog/#{date}: #{count}"
  Pixela.upsert(username: username, token: token, graph_id: 'blog', date: date, quantity: count)
end
puts 'Done.'
