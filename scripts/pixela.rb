# frozen_string_literal: true
require "net/http"
require "uri"
require "json"

module Pixela
  BASE = "https://pixe.la/v1/users"

  class << self
    def upsert(username:, token:, graph_id:, date:, quantity:)
      date_str = date.delete("-")
      graph_url = "#{BASE}/#{username}/graphs/#{graph_id}"

      # Pixela has no upsert endpoint, so update first and fall back to create.
      result = request_json(Net::HTTP::Put, token, "#{graph_url}/#{date_str}", {quantity: quantity.to_s})
      return if result["isSuccess"]

      result = request_json(Net::HTTP::Post, token, graph_url, {date: date_str, quantity: quantity.to_s})
      raise "Pixela POST failed: #{result["message"]}" unless result["isSuccess"]
    end

    private

    def request_json(method_class, token, url, payload)
      headers = {"X-USER-TOKEN" => token, "Content-Type" => "application/json"}
      res = http_request(method_class, URI(url), headers, JSON.generate(payload))
      JSON.parse(res.body)
    rescue JSON::ParserError => e
      raise "Pixela API returned non-JSON response: #{e.message}"
    end

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
