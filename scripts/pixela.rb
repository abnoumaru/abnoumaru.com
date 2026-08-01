require 'net/http'
require 'uri'
require 'json'

module Pixela
  BASE = 'https://pixe.la/v1/users'

  class << self
    def upsert(username:, token:, graph_id:, date:, quantity:)
      date_str = date.delete('-')
      headers = { 'X-USER-TOKEN' => token, 'Content-Type' => 'application/json' }

      # Try PUT first (update existing pixel)
      put_uri = URI("#{BASE}/#{username}/graphs/#{graph_id}/#{date_str}")
      res = http_request(Net::HTTP::Put, put_uri, headers, JSON.generate({ quantity: quantity.to_s }))
      return if JSON.parse(res.body)['isSuccess']

      # Pixel not found — create with POST
      post_uri = URI("#{BASE}/#{username}/graphs/#{graph_id}")
      res = http_request(Net::HTTP::Post, post_uri, headers, JSON.generate({ date: date_str, quantity: quantity.to_s }))
      result = JSON.parse(res.body)
      raise "Pixela POST failed: #{result['message']}" unless result['isSuccess']
    end

    private

    def http_request(method_class, uri, headers, body)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      req = method_class.new(uri)
      headers.each { |k, v| req[k] = v }
      req.body = body
      http.request(req)
    end
  end
end
