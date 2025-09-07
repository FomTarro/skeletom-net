---
title: TourKOAL
date: 2023-11-23
updated: 2024-05-21
author: Skeletom
brief: A web-based plugin for OBS that facilitates displaying information such as team composition, individual Pokémon status, player standings, and more, all with only a few clicks!
thumb: /img/projects/tourkoal/logo.png
tags: pokemon,vgc,javascript,web,open source,obs,streaming,tool
release: https://www.skeletom.net/pkmn/tournament-overlay/
version: v1.3.2
platforms: Web
---

---

## Background

<span class="translucent">Please note that this tool is *not* officially endorsed or affiliated with the Play! Pokémon program in any way.<span>

Back at the start of the 2024 season, I helped run the stream for a local [Mid-Season Showdown](https://www.pokemon.com/us/play-pokemon/pokemon-events/pokemon-tournaments/midseason-showdown). The setup involved having a folder of Pokémon images, which were indexed by [National Dex number](https://www.serebii.net/pokemon/nationalpokedex.shtml). Then, each, round, as players sent out their Pokémon, we'd have to quickly figure out what its National Dex number was, find the corresponding image, and update an OBS source, all just-in-time. Finally, at the end of the match, we'd have to manually reset all 8 OBS sources and prepare to do it again. And items? Forget about it, there was just no time to do the same thing for those.

This process was both very labor-intensive and very error-prone. I figured it must be possible to engineer a better workflow. What if you could accomplish the same results as the above, plus much more, all with a single click? Could we build in guard rails to drastically reduce the odds of displaying the wrong information? Naturally. Thus, TourKOAL was born.

I decided that, like the great [Serebii.net](https://www.serebii.net/) before me, I would want to name this project after my favorite Pokémon. The acronym was retrofitted!

---

## Features

TourKOAL enables you to easily display:

- Battle Information
    - Player's Name
    - Player's Score
    - Which Pokémon they have revealed
        - The status of their Pokémon
        - The Tera Type of their Pokémon
        - The held items of their Pokémon
        - The status of their held items
- Tournament Metadata
    - Player Pairings (up to 32 tables)
    - Player Standings (up to top 32)

You can also check out the [complete, unabridged README here](https://github.com/FomTarro/pkmn-tournament-overlay-tool).

---

## Media

TourKOAL has been used in a variety of events, both large and small. Notably, it seems to be the overlay solution of choice for [Copag](https://copag.com.br/pokemon), the official production company of Regional Tournaments in the Latin American and South American regions!


![goiania](/img/projects/tourkoal/goiania_1.png)
<br>
<span class="font-tiny italic translucent caption">Screenshot from the [2024 Goiânia Regional broadcast](https://www.twitch.tv/collections/es2OOr81uxfCKA), which used TourKOAL in a limited capacity.</span>

![santiago](/img/projects/tourkoal/santiago_1.png)
<br>
<span class="font-tiny italic translucent caption">Screenshot from the [2024 Santiago Regional broadcast](https://victoryroadvgc.com/2024-santiago/), which used TourKOAL in a more advanced capacity!</span>
