require_relative 'pixela'
require 'net/http'
require 'uri'
require 'rexml/document'
require 'time'

username = ENV.fetch('PIXELA_USERNAME')
token    = ENV.fetch('PIXELA_USER_TOKEN')

RSS_URLS = [
  'https://speakerdeck.com/abnoumaru.rss',
  'https://zenn.dev/abnoumaru/feed',
  'https://note.com/abnoumaru/rss'
].freeze

JST = '+09:00'
counts = Hash.new(0)

RSS_URLS.each do |url|
  res = Net::HTTP.get_response(URI(url))
  raise "Failed to fetch #{url}: HTTP #{res.code}" unless res.code == '200'

  doc   = REXML::Document.new(res.body)
  items = doc.get_elements('//item') + doc.get_elements('//entry')

  items.each do |item|
    raw = item.get_text('pubDate')&.value || item.get_text('published')&.value
    next unless raw

    date = Time.parse(raw).localtime(JST).to_date.to_s
    counts[date] += 1
  end
end

puts "#{counts.size} dates to backfill..."
counts.each do |date, count|
  puts "  external/#{date}: #{count}"
  Pixela.upsert(username: username, token: token, graph_id: 'external', date: date, quantity: count)
end
puts 'Done.'
