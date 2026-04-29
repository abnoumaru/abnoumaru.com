module Builders
  class SvgIcon < SiteBuilder
    def build
      icons_dir = File.join(site.root_dir, "node_modules", "simple-icons", "icons")

      helper :svg_icon do |slug|
        path = File.join(icons_dir, "#{slug}.svg")
        File.read(path).html_safe
      end
    end
  end
end
