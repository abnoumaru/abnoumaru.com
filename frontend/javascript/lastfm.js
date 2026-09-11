const el = document.getElementById("lastfm-recent-track");

if (el) {
  fetch("/api/lastfm/recent")
    .then((res) => res.json())
    .then((track) => {
      if (!track) return;

      el.querySelector(".lastfm-recent-track__label").textContent = track.nowPlaying
        ? "Now playing"
        : "♫";

      const link = el.querySelector(".lastfm-recent-track__link");
      link.href = track.url;
      link.textContent = `${track.artist} - ${track.track}`;

      el.hidden = false;
    })
    .catch(() => {}); // 表示できなくても致命的ではないので握りつぶす
}
