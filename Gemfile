source "https://rubygems.org"

git_source(:github) { "https://github.com/#{_1}.git" }
git_source(:codeberg) { "https://codeberg.org/#{_1}.git" }

gem "bridgetown", "~> 2.1.2"
gem "puma", "< 8"

# Bridgetown plugins
gem "bridgetown-feed", "~> 4.0"
gem "bridgetown-sitemap", "~> 3.0"

group :development do
  gem "erb_lint", require: false
  gem "rubocop", require: false
  gem "rubocop-rubyfmt", require: false
end
