# frozen_string_literal: true
class RodaApp < Roda
  plugin :bridgetown_server

  route(&:bridgetown)
end
