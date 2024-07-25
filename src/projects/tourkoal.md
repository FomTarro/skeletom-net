---
title: TourKOAL
date: 2023-11-23
updated: 2024-05-21
author: Skeletom
brief: A web-based plugin for OBS that facilitates displaying information such as team composition, individual Pokemon status, player standings, and more, all with only a few clicks!
thumb: /img/projects/tourkoal/logo.png
tags: pokemon,vgc,javascript,web,open source,obs,streaming
release: https://www.skeletom.net/pkmn/tournament-overlay/
version: v1.3.2
platforms: Web
---

---

## The Why
Are you a Pokémon Professor? Have you organized a local tournament? Have you tried streaming those locals like they do for Regionals? It's not easy, right?

Back at the start of the 2024 season, I helped run the stream for a local Mid-Season Showdown. The setup involved having a folder of Pokémon images, which were indexed by national dex number. Then, each, round, as players sent out their Pokémon, we'd have to quickly figure out what its national dex number was, find the corresponding image, and update an OBS source, all just-in-time. Then, at the end of the match, we'd have to manually reset all 8 OBS sources and prepare to do it again. And items? Forget about it, there was just no time to do the same thing for those.

This process was both very labor-intensive and very error-prone. I figured it must be possible to engineer a better workflow. What if you could accomplish the same results as the above, plus much more, all with a single click? Could we build in guard rails to drastically reduce the odds of displaying the wrong information?

The answer, of course, was yes! Which brings us to this tool...

---

## The What
The goal of this tool is to easily compile player and team information such that it can be quickly displayed on the fly during tournament matches, helping you build a professional-quality overlay for your broadcast with as little manual work as possible.

No longer will you need to scramble through hundreds of image files by hand as players reveal which of their Pokémon they brought to the game, nor will you need to manually adjust OBS sources when items are consumed or Pokémon faint! You can even automatically track and update player pairings and standings to display on stream!

The tool runs entirely in the browser as well, making it very portable and easy to run on venue stream setups without needing to download or install any additional software. No player information is sent or stored on a remote server, or anything of the sort.

### With TourKOAL, You Can...
- Quickly and easily display battle information, such as:
    - Player's Name
    - Player's Score
- Which Pokémon they have revealed
    - The status of their Pokémon
    - The Tera Type of their Pokémon
    - The held items of their Pokémon
    - The status of their held items
- Display and automatically update tournament metadata, such as:
    - Player Pairings (up to 32 tables)
    - Player Standings (up to top 32)

