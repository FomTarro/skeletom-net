---
title: TourKOAL Roadmap - 2025 Competitive Season
date: 2024-07-18
author: Skeletom
brief: Some new features planned to be added to TourKOAL in the upcoming season to bring it to even closer parity with Regional productions.
thumb: /img/projects/tourkoal/santiago_1.png
tags: tourkoal, pokemon, webdev
---

<div class="font-tiny translucent italic caption">Screenshot from the 2024 Santiago Regional broadcast, which used TourKOAL!</div>

Some new features planned to be added to TourKOAL in the upcoming season to bring it to even closer parity with Regional productions.

<!--more-->

Also, this post serves the secondary purpose of being a demonstration of the handy "Related Projects" tab on this page, which offers you direct access to [learn more about TourKOAL](/projects/tourkoal) with just one click. Magical.

---

## Usage Statistic Graphics

The first major feature that I'm aiming to add is a set of Usage Statistic Graphics. These will be charts that display the percentage of teams that the top however-man Pokemon appear on. They will come in two flavors: "Restricted", indicating which legendaries are most popular, and "Non-Restricted", for everyone else.

![Example Non-RestrictedUsage Graphic from the 2024 Indianapolis Regional broadcast](/img/projects/tourkoal/usage_graphic_indy.png)
<br>
<span class="font-tiny translucent italic caption">Example "Non-Restricted" Usage Graphic from the 2024 Indianapolis Regional broadcast. I did not make this graphic!</span>

Well, calling them "graphics" may be slightly misleading; like the existing Pokemon Icons, these would be [OBS Browser Sources](https://obsproject.com/kb/browser-source), constructed entirely out of HTML, rather than a static image.

However, unlike the existing Pokemon Icon elements, these would not be quite so presentable out-of-the-box. While Pokemon Icons look fine with a transparent background and no additional styling, a Usage Graphic would require a fair bit of work from the end-user in the form of custom CSS before it looks presentable and matches the look and feel of their overlay.

I've hesitated with adding an element this complex to TourKOAL until now, because I am assuming that needing to write custom CSS would prove to be a significant barrier for your average Tournament Organizer. But, with almost all of the smaller features that folks have asked for having now been completed, I think it's time to tackle some of the larger ones. And this is, of course, at the top of the list.

I am taking my time to ensure that the structure of the HTML is easy to understand, and that I am giving each element in the HTML an intuitive and well-documented set of [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) to work with for styling.

This information will all be included in the full [TourKOAL README](https://github.com/FomTarro/pkmn-tournament-overlay-tool?tab=readme-ov-file#customization), alongside the existing information for styling Pokemon Icons.

---

## Teamsheet Scanning

Of course, a functional Usage Graphic also requires that all team data be collected upfront, which takes us to the second, much more ambitious feature I want to try: Teamsheet Scanning.

In a recent update, I added support for data entry by means of by pasting an appropriately-named ["PokePaste"](https://pokepast.es/) text blob into the tool. However, in a majority of events, Tournament Organizers will not be so lucky as to have all of their players send them a PokePaste before the event, and will simply be given a stack of (often handwritten) paper teamsheets to manually enter into the tool.

![Example of a cell on a handwritten teamsheet for my Little Cup team.](/img/projects/tourkoal/handwritten_teamsheet.png)<br><span class="font-tiny translucent italic caption">Example of a cell on a handwritten teamsheet for my Little Cup team.</span>

This is still a fairly quick process; it's what I do at all of my events. The [Player Roster table](https://www.skeletom.net/pkmn/tournament-overlay/#players) in the tool is properly tab-indexed and features reasonably good auto-complete for each field, but it's still manual, and for events with a LOT of players, it's somewhat infeasible to do that. Instead, what if you could simply scan the paper teamsheet with your webcam (or upload a photo) and have it be parsed? Wouldn't that be cool?

To that end, I want to try and see if computer vision, by way of something like [tesseract.js](https://github.com/naptha/tesseract.js) would be able to parse a handwritten teamsheet with decent enough accuracy that a secondary algorithm would be able to clean it up.

I'm cautiously optimistic about this possibility; we're lucky in that we know the complete set of all words to ever expect on a teamsheet (Pokemon names, Tera types, item names), and that Teamsheets are essentially just black text on a white page, but I have my doubts that computer vision will be performant or accurate enough when dealing with handwriting to actually be useful in a majority of situations.


Still, something fun to try. Experimenting with building the feature would probably make for some good [stream content](/stream), too.


---


## Closing Remarks
As always, thank you for your continued interest in the tool! I am continually delighted to see new events of all sizes finding value in my work.
