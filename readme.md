# skeletom.net
Homepage of everyone's favorite cartoon in a cartoon graveyard.

Whole thing is made from scratch by yours truly, utilizing good old HTML5 and server-side rendering. You'll find no lofty frameworks here!

## APIs

### `ws://skeletom.net/stream/status`

Returns an object describing the current status and location of Skeletom's stream. Will push details immediately upon connection and then again once the stream goes live. Typically an array of a single detail object.

```
{
    details: [
        id: 'abc-def-ghi-123-456',
        channel: 'skeletom_ch',
        type: 'Stream',
        platform: 'Twitch',
        title: 'Pocket Monster Action!',
        category: 'Pokemon Battle Trozei',
        url: 'https://www.twitch.tv/skeletom_ch',
        isLive: true
    ]
}
```