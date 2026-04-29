---
layout: default
title: links
permalink: /links/
---

<h2>リンク</h2>

<div class="social-links">
<% site.data.links.each do |link| %>
  <a href="<%= link.url %>" target="_blank" rel="noopener noreferrer"><%= link.label %></a>
<% end %>
</div>
