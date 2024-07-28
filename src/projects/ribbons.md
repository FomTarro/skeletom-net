---
title: Ribbon Master Tracker
date: 2023-07-23
updated: 2024-01-15
author: Skeletom
brief: A configurable web-based HTML widget used for tracking ribbon collection progress in the Pokémon video games. Perfect for use as an OBS Browser Source!
thumb: /img/projects/ribbons/ribbon_stream_thumb.png
caption: An example of the widget being used as part of my OBS Overlay in my <a href=https://www.youtube.com/watch?v=FstgY3qsPV0>Ribbon Master Quest</a>.
tags: pokemon,javascript,web,open source,obs,streaming
release: https://www.skeletom.net/pkmn/ribbon-tracker/
version: v1.1.0
platforms: Web
---

--- 

## Background

Back in 2023, Nintendo announced that they'd be [shutting down all 3DS Online capabilities](https://en-americas-support.nintendo.com/app/answers/detail/a_id/63227/~/announcement-of-discontinuation-of-online-services-for-nintendo-3ds-and-wii-u). Well, all of them [except for Pokémon Bank](https://en-americas-support.nintendo.com/app/answers/detail/a_id/63227/~/announcement-of-discontinuation-of-online-services-for-nintendo-3ds-and-wii-u#s1q2), the app that lets you transfer Pokémon from the 3DS to the Switch. 

Reading the writing on the wall and knowing that Bank was living on borrowed time, I set out to [collect as many ribbons as possible](https://www.youtube.com/playlist?list=PLspwi8mJZ27_sVLlxuWNwB7wNRbsrG2Zg) from the 3DS-era and beyond on my favorite Pokémon, Torkoal.

---

## Features

The tracker displays a list of all ribbons available in the selected games, as defined in the URL. You can click on the ribbons on the list to pull up information about them, such as what games they're in, and [what title they confer](https://bulbapedia.bulbagarden.net/wiki/Title). You can toggle a checkbox to denote if you've collected the ribbon yet, and a progress bar will automatically fill up. The tracker will remember your progress between loads, as well.

When used as a [Browser Source in OBS](https://obsproject.com/kb/browser-source), you can right-click on the source and select "Interact" from the menu in order to, well, interact with it as you would in a normal browser.  

Below is an embedded version of the tracker, along with a URL that you can copy into OBS as a Browser Source. You can also resize this embedded version with the little handle in the bottom-right corner of the frame, to see how it adapts to different resolutions.

<div class="resize-both drop-shadow" style="height: 500px; margin-bottom: 1em;">
    <iframe class="fill" src="https://www.skeletom.net/pkmn/ribbon-tracker/?games=[or,x,sun,sw,scarlet]"></iframe>
</div>

<div class="flex" style="width: 100%; gap: 1em;">
    <input id="widget-url" type="text" style="flex: 1;" readonly value="https://www.skeletom.net/pkmn/ribbon-tracker/?games=[or,x,sun,sw,scarlet]"></input>
    <button onclick=copyURL()>
        Copy URL to Clipboard
    </button>
</div>
<script>
    function copyURL(){
        const copyZone = document.querySelector('#widget-url');
        copyZone.focus();
        copyZone.select();
        try {
            const successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying was ' + msg);
        } catch (err) {
            console.log('Unable to copy');
        }
    }
    function setDimensions(){
        // Do nothing
    }
</script>

In order to configure the tracker for just the games that you have access to, edit the list contained between the brackets in the URL! Abbreviations <span class="font-tiny translucent italic">("sw", "or", "um"...)</span> and full titles <span class="font-tiny translucent italic">("sword", "omega ruby", "ultra moon"...)</span> work just fine!

---

## Media

Below is one of the many, many episodes of ribbon hunting that I streamed! The [whole process](https://www.youtube.com/playlist?list=PLspwi8mJZ27_sVLlxuWNwB7wNRbsrG2Zg) took me over 6 months, because I only streamed for about 2 hours, once a week. But we get there in the end! 

<iframe width="560" height="315" src="https://www.youtube.com/embed/EVVRxHBh9YM?si=72hhN8kyOPQL-gkG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I also streamed the process of imagining and building the tracker itself! You can watch that in [this handly playlist](https://www.youtube.com/playlist?list=PLspwi8mJZ27__j3ICkMHVI4agTKPMOAhy).

<iframe width="560" height="315" src="https://www.youtube.com/embed/VZ-veX-6jbg?si=Ao8__F1BKUHKCS8e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
