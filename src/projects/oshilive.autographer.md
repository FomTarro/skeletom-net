---
title: OshiLive Autographer
date: 2024-05-30
updated: 2024-11-01
author: Skeletom
brief: A browser-based drawing pad that allows call-in convention guests to sign real physical autographs for on-site attendees from across the world using a CNC machine!
thumb: /img/projects/oshilive/canvas.png
tags: vtubers,javascript,oshilive,hardware,convention,tool
version: v1.0.0
platforms: Web, Mobile
---

---

## Background

[OffKai Expo](https://www.offkaiexpo.com/) is a relatively new (at the time of this writing) convention focused on the budding (again, at the time of this writing) VTubing industry. It promises attendees the ability to connect with other fans, shop at an expansive artist alley, and most importantly, experience meet-and-greets with their favorite VTubers. 


Of course, VTubers are famously reclusive, almost by definition. Very few of them want to attend events in-person and break their guise of anonymity. [OshiLive](https://www.oshilive.com/) is a company that specializes in bringing VTubers to conventions as guests, using telepresence robots and other fun modern technologies, allowing them to "walk the floor" and conduct panels.


For OffKai 2024, OshiLive contacted me with an idea they had to take their offering to the next level: a way that these remote VTuber guests could provide real, personalized autographs to their fans on the spot.


Thus, with a deadline of just about 30 days from the date of request, I prototyped and delivered the OshiLive Autographer! 

---

## Features

The Autographer is a browser-based JavaScript canvas that transmits brush-strokes securely across network to a remote [CNC machine](https://en.wikipedia.org/wiki/Numerical_control) at the convention hall. 


During a meet-and-greet, the VTuber guest could use a pen tablet or their finger on mobile to draw an autograph, which would then get beamed across the world into the OshiLive CNC machine, which in turn was equipped with a pen. An OshiLive attendand would place the fan's item on the machine for signing, and the machine would proceed to repeat the brush strokes that it downloaded from the VTuber.


As such, the signatures this thing provided were truly unique every time, providing a signifigantly better experience for fans than the more widely-used approach of having stacks of pre-signed cards to hand out or sell!


---


## Media

Here's a video of the tool working. In practice, the drawing pad and the CNC machine were separated by hundreds, if not thousands of miles.

<video width="100%" height="auto" controls>
  <source src="/img/projects/oshilive/autographer.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>

The tool was able to produce signatures that look effectively hand-written, because they basically are! Here's an example.

![mono's autograph](/img/projects/oshilive/bep_autograph_mono.jpg)
<br>
<span class="font-tiny italic translucent caption">Example of an autograph dedicated to a viewer named "bep", from V4Mirai's own [Mono Monet](https://www.youtube.com/@MonoMonet).</span>
