---
layout: default
title: no-smoking
permalink: /no-smoking/
---

<h1>禁煙情報</h1>
<p>2023年2月13日から禁煙しています。</p>
<p class="days-count">
  禁煙期間: <strong id="no-smoking-days">計算中...</strong>
</p>

<script>
  (function () {
    const startDate = new Date(2023, 1, 13);
    const today = new Date();
    const openedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffMs = openedDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let diffYears = openedDate.getFullYear() - startDate.getFullYear();
    let diffMonths = openedDate.getMonth() - startDate.getMonth();
    let remainingDays = openedDate.getDate() - startDate.getDate();

    if (remainingDays < 0) {
      diffMonths -= 1;
      remainingDays += new Date(openedDate.getFullYear(), openedDate.getMonth(), 0).getDate();
    }
    if (diffMonths < 0) {
      diffYears -= 1;
      diffMonths += 12;
    }

    const target = document.getElementById("no-smoking-days");
    if (target) {
      target.textContent = `${diffDays}日 (${diffYears}年${diffMonths}ヶ月${remainingDays}日)`;
    }
  })();
</script>
