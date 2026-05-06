# frozen_string_literal: true
# Reloadable site metadata（title, SEO description, SNS など）は `src/_data/site_metadata.yml` 側。

Bridgetown.configure do |_config|
  url("https://abnoumaru.com")

  available_locales(%i[ja en])
  default_locale(:ja)
  lang("ja_JP")

  template_engine("erb")
  timezone("Asia/Tokyo")

  init(:"bridgetown-feed")
  init(:"bridgetown-sitemap")

  # Astro サイト時代の購読者が引き続き使える URL を維持するために `/rss.xml` を指定。
  feed do
    path("rss.xml")
  end
end
