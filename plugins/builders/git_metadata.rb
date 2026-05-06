# frozen_string_literal: true
module Builders
  class GitMetadata < SiteBuilder
    def build
      hook(:site, :pre_render) do |site|
        commit_hash = `git rev-parse --short HEAD 2>/dev/null`.strip
        commit_hash = "unknown" if commit_hash.empty?
        site.config[:git_commit_hash] = commit_hash
      end
    end
  end
end
