---
layout: default
title: home
permalink: /
---

<p>abnoumaru's website.</p>

<h2>最近の更新</h2>
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
