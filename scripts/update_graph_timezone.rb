require_relative 'pixela'

username = ENV.fetch('PIXELA_USERNAME')
token    = ENV.fetch('PIXELA_USER_TOKEN')

%w[blog external].each do |graph_id|
  puts "Updating timezone for graph: #{graph_id}"
  Pixela.update_graph(username: username, token: token, graph_id: graph_id, timezone: 'Asia/Tokyo')
  puts "  Done."
end
