---
title: Sonic Symposium 2026
date: 2026-11-13
author: Skeletom
brief: Get ready to Live & Learn! Pre-eminent scholars of Sonic The Hedgehog give way-past-cool lectures on Twitch!
thumb: /img/blogs/sonic-symposium-2026/symposium_logo.png
tags: stream, event, collab, sonic, hedgehog, bodega, amiya, ray, educational
---

---

Did you know that one of my favorite franchises, Sonic the Hedgehog, turned 35 this year?

To celebrate, I called in some of my best friends: [Ray the Vampire](https://www.twitch.tv/rayrabenstein), [Bodega the Rat](https://www.twitch.tv/bodegarrat), and [Amiya the Spider](https://www.youtube.com/@AmiyaAranha), for a real meeting of the minds! 
We’re calling it the Sonic Symposium, and you’re invited!

Each one of us is going to present a different way-past-cool topic about the series, drawing on our collective knowledge of the games, comics, music, and more!

Swing by [my Twitch](https://www.skeletom.net/stream) this Friday, November 13th at 3 PM ET to sit in on the lectures!


<iframe class="yt-embed" src="https://www.youtube.com/embed/bkrqhljubxs?si=-eMF1oOpEUlyOdzY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Media

You can catch the VOD on my Twitch channel! The timestamps are as follows:

- <a onclick=jumpToTimestamp(0,18,30)>00:18:30</a> *"Intro to Echidna Civilization"* presented by Tom
- <a onclick=jumpToTimestamp(1,19,00)>01:19:00</a> *"Infinite the Jackal and Why I Love Him"* presented by Ray
- <a onclick=jumpToTimestamp(2,19,00)>02:19:00</a> *"Sounds like Sonic!"* presented by Amiya
- <a onclick=jumpToTimestamp(3,20,00)>03:20:00</a> *"Why does Shadow Love Latinas?"* presented by Bo

<div id="twitch-embed" class='twitch-embed'></div>

<!-- Load the Twitch embed script -->
<script src="https://player.twitch.tv/js/embed/v1.js"></script>

<!-- Create a Twitch.Player object. This will render within the placeholder div -->
<script type="text/javascript">
    const player = new Twitch.Player("twitch-embed", {
        video: "2930078085"
    });

    function jumpToTimestamp(hour,min,sec) {
        if (player) {
            player.seek(60*60*hour + 60*min + sec);
            player.play();
        }
    }
</script>

