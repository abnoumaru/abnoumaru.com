---
layout: default
title: blog
permalink: /blog/
---

<h2>ブログ</h2>
<ul class="simple-post-list">
<% collections.posts.resources.sort_by { |p| p.data.date }.reverse.each do |post| %>
  <li>
    <span class="post-date">
      <%= render "format_date", date: post.data.date %>
    </span>
    <a href="<%= post.relative_url %>"><%= post.data.title %></a>
  </li>
<% end %>
</ul>
