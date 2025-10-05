---
title: Tactical Desktop Action 1.1.0 Release
date: 2025-10-01
author: Skeletom
brief: Mint Fantôme infiltrates your desktop for a second mission, bringing you push notifications for her YouTube streams as well as for your calendar events in the "ALERT" Update!
thumb: /img/projects/mint-birthday-2024/alert_update_banner.png
tags: vtubers,c#,unity,fan game,mint,desktop toy,mgs,metal gear,toy,fantome,calendar,ics,notifications,youtube
release: https://skeletom-ch.itch.io/tactical-desktop-action/devlog/1062975/update-v110-the-alert-update
version: v1.1.0
---

---

Happy birthday, Mint! This was a fun one to put together, with some features that I feel deliver real value.

### Additions:

- <span class="highlight">YouTube Go-Live Alerts</span>! Mint will CALL you on the Codec when she goes live. Never miss a stream again! There’s no excuse.
- <span class="highlight">Calendar</span> and <span class="highlight">Event Alerts</span>! Manage your calendar and get a CALL from Mint to remind you of your tasks for the day. You can even import and export <span class="highlight">.ICS files</span>, offering full compatibility with most major calendar apps, such as Google Calendar!


### Updates:

- The <span class="highlight">Clock</span> can now select <span class="highlight">any time zone</span> in the world. Yes, you can finally find out what time it is in the Fox Archipelago.
- The <span class="highlight">Music Player</span> now supports lossless <span class="highlight">.FLAC files</span>. Go wild, audio freaks.


### Quality-of-(After)Life Fixes and Improvements:

- You can now opt to <span class="highlight">skip the intro/exit cutscenes</span> on subsequent launches from the Settings menu.
- You can opt in and out of the YouTube and Calendar Alerts from the Settings menu as well.
- The application <span class="highlight">no longer suppresses OS notifications</span> as though it were a normal full-screen window.
- The application now <span class="highlight">properly handles launching on secondary monitors</span> (previously failed to calculate window borders).


If you find any other bugs or have any feature requests, please let me know!The best way to reach me is via <a href="mailto:tom@skeletom.net?subject=Tactical Desktop Action Bug Report">Email</a> <span class="highlight fa fa-sm fa-envelope"></span>, but my DMs are open on most platforms, too!

---

## Behind The Scenes

Now for the part of the blog post where I go in to excruciating detail about the work behind getting this update out the door. The new features might look rather mundane, but there was a lot of learning involved.

## YouTube Alerts
### A Brief Summary of Network Protocols
In the world of networked systems, there are two major protocols for communication: [HTTP](https://en.wikipedia.org/wiki/HTTP) and [WebSocket](https://en.wikipedia.org/wiki/WebSocket). You are undoubtedly already familiar with the first, even if you have no engineering background! 

With <span class="highlight">HTTP</span>, the client makes a <span class="highlight">single request</span> to an address, and then waits to receive a <span class="highlight">single response</span> from the server. Great for transactional behavior, like asking for a web page!

Meanwhile, with <span class="highlight">WebSockets</span>, the client makes a <span class="highlight">single request</span> to an address, and then maintains a <span class="highlight">persistent connection</span> to the server. This, in turn, <span class="highlight">allows the server to push information back to the client whenever</span>, without needing to be asked for it first. 

So, if you wanted to get notified every time a specific channel on the mega-giant streaming platform YouTube went live, which protocol do you think you'd want to use? WebSocket, right? Connect to the YouTube API server, provide it with a little information about what you're looking for, and then every time your channel went live, the server could proactively push a message to your client. Seems efficient and straighforward!

Wrong! <span class="highlight">YouTube doesn't have a WebSocket API</span>. That would be too easy, too logical. Twitch does (called "[EventSub](https://dev.twitch.tv/docs/eventsub/)"). But YouTube does not.

Okay, so if we can't get the server to reach out to us every time it has new information to share, and if we want up-to-the-second status updates, then we have to do <span class="highlight">HTTP Polling</span>, which refers to the technique of <span class="highlight">making an HTTP request repeatedly at a high frequency</span>, continually checking to <span class="highlight">see if the response has changed</span>. This results in a lot of network traffic, most of which is effectively garbage. For example, if you polled an HTTP address every second of the day, that would be 86,400 requests, of which only one is likely to yield a response that you care about (the response which changed from "not live" to "live").

But, whatever, fine. We don't have a choice. If YouTube won't give us a WebSocket to connect to, surely they understand that this is the only alternative, and are therefore okay with us hitting their HTTP API with such volume.

### Working Within Arbitrary Constraints
Wrong again! The YouTube API (and all Google APIs) have famously stingy [quotas](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits). By default, <span class="highlight">applications are allotted 10,000 Quota Units per day</span>. The `videos/list` request, which, as the name suggests, can give us back status information about a list of videos, costs 1 Quota Unit. As established earlier, <span class="highlight">one request per second would come out to 86,400 requests per day</span>, way above our quota. We can scale it back to one request per 10 seconds, bringing the total back down to 8,640 requests per day, and back below the quota. 

Great! Now, what do we need to provide the `videos/list` request to get the information we need from it? Well, that would be a list of Video IDs. Not Channel IDs. Video IDs. So, how do we get a list of every Video ID that a channel has scheduled? Why, use the `channels/list` request, which also has a cost of 1 Quota Unit. And to be sure we pick up new Video IDs as soon as they're scheduled (for, say, guerrilla/unplanned streams), we would need to poll that address. Another 8,640 Quota Units spent, and suddenly we're back above our daily quota. Uh oh!

A natural solution here would just be to further decrease the frequency of the polling mechanisms. Fortunately, there is another, less-documented way. Turns out, YouTube channels all have [RSS Feeds](https://en.wikipedia.org/wiki/RSS) (as does [this very website!](../rss-feed-now-available)). Accessing this RSS feed does not go through the API, and therefore does not consume Quota Units. 

For example, we can hit up [`https://www.youtube.com/feeds/videos.xml?channel_id=UCr5N4CrcoegFpm7fR5a_ORg`](https://www.youtube.com/feeds/videos.xml?channel_id=UCr5N4CrcoegFpm7fR5a_ORg) to get a list of my most recent dozen-or-so videos. If I were streaming on YouTube, this list would also include upcoming scheduled streams. So, from this document, we can pluck out the most recent Video IDs for a channel for free, and then poll the `videos/list` request at our desired frequency as originally planned. Now, what do we do with this information?

### Righting the Wrongs
We make our OWN WebSocket! With blackjack!

## Calendars
### .ics: 1998 Sends Its Regards
It's not XML, it's not JSON, it's some third thing!
Oh, just split the file on newlines. Allow me to introduce "folding".

### The Loathsome RRULE
Intuitive to read for a human, profoundly complex for a machine.

### Why Didn't You Just Use ical.NET?
Listen.