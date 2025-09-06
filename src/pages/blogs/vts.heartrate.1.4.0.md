---
title: VTS-Heartrate 1.4.0 Release
date: 2024-10-10
author: Skeletom
brief: Just in time for Halloween, vts-heartrate updates to version 1.4.0 with some delightful new features, well-suited for scary games.
thumb: /img/projects/vts-heartrate/vtsh_update_thumb_v140.png
tags: vtubers,c#,unity,plugin,vtube studio,heartrate,heartbeat,tool,widget,vts-heartrate
release: https://skeletom-ch.itch.io/vts-heartrate/devlog/813407/update-v140
version: v1.4.0
---

---

### Additions:

- <span class='highlight'>VFX Support!</span> Dynamically control any of the fabulous [VTube Studio post-processing VFX](https://github.com/DenchiSoft/VTubeStudio/wiki/Visual-Effects) with your heart rate! Experience distortion that pulses in time with your heart, or become increasingly desaturated and unstable as your heart rate climbs! The possibilities are endless.
- <span class='highlight'>Built-in Stream Widget!</span> Usable as a [Browser Source in OBS](https://obsproject.com/kb/browser-source), or as a [Web Item in VTube Studio](https://github.com/DenchiSoft/VTubeStudio/wiki/Web-Items). It prints your heartrate in real time, and the backing image does a pulsing animation at the corresponding speed. Can be customized with Custom CSS in either case!
- <span class='highlight'>Heartrate Offsets!</span> Apply a flat +/- value to add or subtract from your real heartrate; perfect for folks who may feel sheepish about their naturally high or low BPM. 
    - <span class="translucent italic font-tiny">(NOTE: this feature was added at the behest of [Henemimi](https://www.henemimi.tv) who told me to say "*can you put me in the patch note and say this is for henemimi who said her heart rate is cringe*")</span>

### Updates:

- As of October 2023, [Pulsoid](https://blog.pulsoid.net/post/pulsoid-x-fitbit) and [HypeRate](https://www.hyperate.io/stories/how-to-stream-your-heart-rate-from-fitbit-to-twitch) now natively support Fitbit devices through their app! As such, it is *highly recommended* to use one of these input methods for this plugin, and connect your Fitbit device through that instead.

---

### Tips and Tricks

The <span class="highlight">VFX</span> feature lends itself to a lot of customizability. Maybe too much! It can be pretty overwhelming to look at, but the basic gist is that you can use <span class="highlight">Custom Tracking Parameters</span> to control effects. You can then apply an additional multipler to these values to increase or decrease the overall intensity of the effect.

Broadly speaking, I think setting the `strength` component of your desired effect to be driven by the `vts_heartrate_linear` Custom Tracking Parameter is a good starting point. You can then control the other components of the effect with `vts_heartrate_pulse` to create a visual reminsicent of being at "critical HP" in a video game. Finally, we can apply some dampening modifiers with the sliders to keep the effect relatively subtle.

Here's an effect I set up for myself and the configuration I used to achieve it.

<img src=/img/projects/vts-heartrate/vfx.gif>
<br>
<span class="font-tiny translucent italic caption">Note how the effects strobe with my pulse, but also rise in intensity with my overall heartrate.</span>

<div class="row" style="flex-wrap: wrap; column-gap: 0.5em; row-gap: 1em">
<img src=/img/projects/vts-heartrate/vfx_config_1.png>
<img src=/img/projects/vts-heartrate/vfx_config_2.png>
</div>


I hope this example helps! As always, if you have an idea for a feature, find a bug, or figure out a better way to convey this complicated information to the end-user, please feel free to reach out to me on any platform! My inbox is always open!
