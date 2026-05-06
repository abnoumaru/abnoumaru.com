# frozen_string_literal: true
module Builders
  class GitMetadata < SiteBuilder
    def build
      hook(:site, :pre_render) do |site|
        hash = `git rev-parse --short HEAD 2>/dev/null`.strip
        hash = "unknown" if hash.empty?
        site.config[:git_commit_hash] = hash
      end
    end
  end
end
