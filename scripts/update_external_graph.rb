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

today     = Time.now.localtime('+09:00').to_date
yesterday = today - 1
targets   = [today.to_s, yesterday.to_s]

counts = Hash.new(0)

RSS_URLS.each do |url|
  res = Net::HTTP.get_response(URI(url))
  raise "Failed to fetch #{url}: HTTP #{res.code}" unless res.code == '200'

  doc   = REXML::Document.new(res.body)
  items = doc.get_elements('//item') + doc.get_elements('//entry')

  items.each do |item|
    raw = item.get_text('pubDate')&.value || item.get_text('published')&.value
    next unless raw

    date = Time.parse(raw).localtime('+09:00').to_date.to_s
    counts[date] += 1 if targets.include?(date)
  end
end

if counts.empty?
  puts 'No external posts in target dates, skipping.'
  exit 0
end

counts.each do |date, count|
  puts "Updating external/#{date}: #{count}"
  Pixela.upsert(username: username, token: token, graph_id: 'external', date: date, quantity: count)
end
