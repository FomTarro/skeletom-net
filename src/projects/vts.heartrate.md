---
title: VTS-Heartrate
date: 2022-01-03
updated: 2024-04-27
author: Skeletom
brief: A VTube Studio plugin that allows for connectivity between heart rate monitors (HRM) and VTube Studio! Control your avatar with your real pulse!
thumb: /img/projects/vts-heartrate/logo.png
tags: vtubers,c#,unity,plugin,vtube studio,heartrate,heartbeat,tool
release: https://skeletom-ch.itch.io/vts-heartrate
version: v1.3.1
platforms: Windows
---

---

## Background

Originally designed simply as a way for me to test if my open-source library, [VTS-Sharp](/projects/vts-sharp) was indeed developer-friendly, the scope of this plugin quickly expanded to accommodate for a wide variety of use-cases. If you're interested, you can even watch the entire development cycle [in one handy playlist](https://www.youtube.com/playlist?list=PLspwi8mJZ27_6P2n30lj97e3z4Zd_QUaU).

---

## Features

The plugin has several highly-configurable features, such as:

* Support for many heart rate monitors with [pulsoid.net](https://www.pulsoid.net/), [hyperate.io](https://www.hyperate.io), [ANT+](https://www.thisisant.com) and even Fitbit!
* Configurable model tinting that scales with pulse!
* Automatic expression and hotkey triggering at desired heartrate thresholds!
* Custom tracking parameters for pulse, breath and Live2D items!
* Plugin API so that you can build your own apps that consume or write heartrate data! (Yes, you can make plugins for the plugin!)

![Akari demonstrating some of the features of vts-heartrate](/img/projects/vts-heartrate/akari_gif_features.gif)
<br>
<span class="font-tiny translucent italic caption">VTube Studio's mascot, Akari, demonstrating some of the features of vts-heartrate.</span>

You can also check out the [complete, unabridged README here](https://github.com/FomTarro/vts-heartrate).

---

## Media

Below you'll find a brief video tutorial showcasing some of the plugin's features, as well as demonstrating how to set them up.

<iframe class="yt-embed" src="https://www.youtube.com/embed/tV1kK0uSjFE?si=P7vPTyk-nrHxRZ8s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

In addition, as mentioned above, I typically stream all of the work I do on this plugin. Those streams get archived [in a playlist on my YouTube channel](https://www.youtube.com/playlist?list=PLspwi8mJZ27_6P2n30lj97e3z4Zd_QUaU) for easy reference later.

---

## FAQ

**Q: "What devices are supported?"**

**A: This plugin supports any device that is supported by:**

* [Pulsoid (compatibility list)](https://www.blog.pulsoid.net/monitors?from=faq)
* [HypeRate (compatibility list)](https://www.hyperate.io/supported-devices)
* [ANT+ with a USB Receiver](https://www.thisisant.com/directory/)
* The following Fitbit devices:
    * Versa 3
    * Sense
    * Ionic
    * Versa 2
    * Versa Lite
    * Versa

Unfortunately, Fitbit has not provided a way to develop or install third-party apps on their latest models (Versa 4 and later), so the latest devices cannot be supported at this time.

