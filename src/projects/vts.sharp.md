---
title: VTS-Sharp
date: 2021-09-14
updated: 2024-08-04
author: Skeletom
brief: A C# client interface for creating VTube Studio Plugins with the official VTube Studio API, for use in Unity and other C# runtime environments!
thumb: /img/projects/vts-sharp/logo_banner.png
tags: vtubers,c#,unity,plugin,vtube studio,library,open source
release: https://github.com/FomTarro/VTS-Sharp
version: v2.3.0
---

---

## Background

On [September 19th, 2021](https://twitter.com/VTubeStudio/status/1439719246842540039), industry-leading VTubing application [VTube Studio](https://denchisoft.com/) released [plugin support via an API](https://github.com/DenchiSoft/VTubeStudio). Several weeks prior, I had been tipped off by [the developer](https://twitter.com/DenchiSoft) that such an advancement was on its way. 

After wracking my mind for something fun to build that would showcase the power of the API and utterly failing to come up with anything flashy, I resolved to leave the imagination to [the more creative folks](https://github.com/FomTarro/VTS-Sharp?tab=readme-ov-file#made-with-vts-sharp), and instead built a library to enable [other people](https://remasuri3.itch.io/tits) make [the cool stuff](https://store.steampowered.com/app/1898830/VBridger/) with minimal friction. Thus, VTS-Sharp was born.

---

## Features

VTS-Sharp is a C#-language wrapper for the VTube Studio API. As such, it can let you do anything that the VTube Studio API can, from the C# environment of your choice. Some features include:

- Support for Unity3D engine, XNA, .NET forms, and more!
- Synchronous and Asynchronous implementations of all function calls!
    - Full support for both [Plugin API](https://github.com/DenchiSoft/VTubeStudio) and [Event API](https://github.com/DenchiSoft/VTubeStudio/blob/master/Events/README.md) functions!
- Interface-based design allowing you to write your own implementations (if you want!)
- Ease of availability on [GitHub](https://github.com/FomTarro/VTS-Sharp/releases), [NuGet](https://www.nuget.org/packages/VTS-Sharp) or the [Unity Asset Store](https://assetstore.unity.com/packages/tools/integration/vts-sharp-203218).
- Plenty of working examples out-of-the-box.


You can check out the [complete, unabridged README here](https://github.com/FomTarro/VTS-Sharp).

---

## Media

Below is a clip demonstrating how to make an incredibly simple plugin (one that turns your model red with a button click) in just 90 seconds using VTS-Sharp. 

We can see that all the heavy lifting has been abstracted away by the library, letting developers get right to the fun parts.

<iframe class="yt-embed" src="https://www.youtube.com/embed/lUGeMEVzjAU?si=cP4CN8vmHHFrS73y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Made With VTS-Sharp

There have been [a lot of plugins](https://github.com/FomTarro/VTS-Sharp?tab=readme-ov-file#made-with-vts-sharp) made with VTS-Sharp! Some of the most commercially successful ones are:

### VBridger

![vbridger](/img/projects/vts-sharp/vbridger.png)
<br>
<span class="font-tiny translucent caption"> By PiPuProductions | <span class="fa fa-brands fa-steam"></span> [Available on Steam](https://store.steampowered.com/app/1898830/VBridger/)</span>

A plugin that allows for folks with high-end iPhones to get the most out of their cameras, creating a wealth of new tracking parameters in VTube Studio that these fancy phones are able to capture! People who do high-end model rigging swear by this one!

<br>

### Twitch Integrated Throwing System

![twitchthrow](/img/projects/vts-sharp/twitch_integrated.png)
<br>
<span class="font-tiny translucent caption">By Remasuri3 | <span class="fa fa-brands fa-itch-io"></span> [Available on itch.io](https://remasuri3.itch.io/tits)</span>

A plugin that allows stream viewers to throw miscellaneous objects at their beloved streamers in exchange for Channel Points or Superchats. This one is nearly-ubiquitous in the VTubing space. I find the acronym a bit unseemly, but am deeply grateful that the plugin exists!

<br>

### VTS-Heartrate
![vtsheartrate](/img/projects/vts-heartrate/logo_small.png)
<br>
<span class="font-tiny translucent caption">By Skeletom | <span class="fa fa-brands fa-itch-io"></span> [Available on itch.io](https://skeletom-ch.itch.io/vts-heartrate)</span>

A plugin that allows for connectivity between heart rate monitors (HRM) and VTube Studio, so that streamers can control their models with their real pulse. This one is by me! It was originally built just as a way to test this library end-to-end, but the idea seemed pretty good so I kept working on it! You can [read more about it](/projects/vts-heartrate) on this very website.