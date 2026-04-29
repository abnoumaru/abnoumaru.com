---
layout: default
title: about
permalink: /about/
---

<h2>自己紹介</h2>

<h3>id</h3>
<p>abnoumaru(あぶのうまる)</p>

<h3>アイコン</h3>
<div class="icon-gallery">
  <img src="/icon/abnoumaru.jpg" alt="仕事などでも使えるアイコン、SHIROBAKOのアリアが歯磨きしているシーンを意識した絵" />
  <img src="/icon/abnoumaru-public.jpg" alt="これはかなりプライベートなアカウントだよを伝えたいときのアイコン" />
  <img src="/icon/abnoumaru-photo-of-the-author.webp" alt="2025年11月にキャッチボールをしてる著者" />
  <img src="/icon/abnoumaru-omoide.webp" alt="前々職の旅行で行った好きな写真" />
</div>

<h3>経歴</h3>
<% site.data.career.each do |career| %>
  <div class="career-block">
    <div class="company-header">
      <a href="<%= career.url %>" target="_blank" rel="noopener noreferrer"><%= career.company %></a>
    </div>
    <div class="positions">
      <% career.positions.each do |pos| %>
        <div class="position-item">
          <div class="position-header">
            <span class="position-period"><%= pos.start_date %> - <%= pos.end_date || "現在" %></span>
            <span class="position-team"><%= pos.team %></span>
          </div>
          <div class="position-details">
            <% pos.titles.each do |title| %>
              <div class="detail-row"><%= title %></div>
            <% end %>
          </div>
        </div>
      <% end %>
    </div>
  </div>
<% end %>

<h3>連絡先</h3>
<div class="contacts">
  <p><span>Discord:</span> <span>abnoumaru</span></p>
  <p><span>Email:</span> <span>me [at] abnoumaru [dot] com</span></p>
</div>
