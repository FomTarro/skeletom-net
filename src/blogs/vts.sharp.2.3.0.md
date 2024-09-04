---
title: VTS-Sharp 2.3.0 Release
date: 2024-08-04
author: Skeletom
brief: Version 2.3.0 brings support for all kinds of wild rendering effects through the Post-Processing API!
thumb: /img/projects/vts-sharp/vts_sharp_2.3.0.png
tags: vtubers,c#,unity,plugin,vtube studio,library,open source,vts-sharp
release: https://github.com/FomTarro/VTS-Sharp/releases/tag/v2.3.0
version: v2.3.0
---

---

With VTube Studio's [update to version 1.28.15](https://store.steampowered.com/news/app/1325860/view/7631982274664823375?l=english), the previously beta-only [Post-Processing/VFX](https://github.com/DenchiSoft/VTubeStudio/wiki/Visual-Effects) API functions have now been rolled into the public build! That's exciting. It reminded me to finally merge my beta branch of VTS-Sharp into the main branch, which brings us to version 2.3.0!

### Additions:

- [`GetPostProcessingEffectStateList`](https://github.com/DenchiSoft/VTubeStudio?tab=readme-ov-file#get-list-of-post-processing-effects-and-state) method.
- [`SetPostProcessingEffectValues`](https://github.com/DenchiSoft/VTubeStudio?tab=readme-ov-file#set-post-processing-effects) method.
- [`SubscribeToPostProcessingEvent`](https://github.com/DenchiSoft/VTubeStudio/blob/master/Events/README.md#post-processing-event) method.


The above methods all have `async` variants, as well.

### Updates:

- Updated Hotkey definitions.
