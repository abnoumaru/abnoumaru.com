# frozen_string_literal: true
# Site configuration. For reloadable site metadata like title, SEO description,
# and social media handles, see `src/_data/site_metadata.yml`.

Bridgetown.configure do |_config|
  url("https://abnoumaru.com")

  available_locales(%i[ja en])
  default_locale(:ja)
  lang("ja_JP")

  template_engine("erb")
  timezone("Asia/Tokyo")

  # Bridgetown plugins
  init(:"bridgetown-feed")
  init(:"bridgetown-sitemap")

  # Use /rss.xml path so existing subscribers from the Astro site keep working.
  feed do
    path("rss.xml")
  end
end
