---
layout: default
title: home
permalink: /
---

<ul class="recent-posts">
<% collections.posts.resources.sort_by { |p| p.data.date }.reverse.first(5).each do |post| %>
  <li>
    <span class="post-date">
      <%= render "format_date", date: post.data.date %>
    </span>
    <a href="<%= post.relative_url %>"><%= post.data.title %></a>
  </li>
<% end %>
</ul>

<p><a href="/blog/">すべての記事を見る →</a></p>
