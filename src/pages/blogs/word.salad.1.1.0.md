---
title: Word Salad 1.1.0 Release
date: 2025-02-09
author: Skeletom
brief: After a very successful launch week, Word Salad recieves a small update with some much-needed features.
thumb: /img/projects/word-salad/banner.png
tags: electron,javascript,web,toy,tts,redeem,twitch,word salad
release: https://skeletom-ch.itch.io/word-salad/devlog/884361/update-v110
version: v1.1.0
---

---

### Additions:


- Added Support for processing <span class='highlight'>unknown words</span> by adding files named `_`, `_1`, `_2`, etc, to the sounds folder. If files with this name are not present, unknown words will simply be skipped.
- Implemented a <span class='highlight'>queue system</span> for Speak commands, which will be processed in order. This prevents redeems from speaking over each other. 
    - If you would like to disable this behavior, add `?queue=false` to the end of the Browser Source URL.
- Added <span class='highlight'>tooltip hovers</span> to the UI.