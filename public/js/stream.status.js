let embed = undefined;
const streamStatusSocket = new WebSocket(`${window.location.host.includes('localhost') ? 'ws' : 'wss'}://${window.location.host}/stream/status`);
// Listen for messages
streamStatusSocket.addEventListener("message", (event) => {
    const parsed = JSON.parse(event.data);
    const isOnline = parsed.details && parsed.details.length > 0 && parsed.details[0].isLive;
    const details = parsed.details[0];
    for(const marquee of document.querySelectorAll('.stream-status-marquee')){
        if(isOnline){
            marquee.classList.remove("translucent");
        }else{
            marquee.classList.add("translucent");
        }
    }
    // Status icons
    for(const status of document.querySelectorAll('.stream-status')){
        if(isOnline){
            status.classList.add("online");
            status.classList.remove("offline");
        }else{
            status.classList.add("offline");
            status.classList.remove("online");
        }
    }
    for(const address of document.querySelectorAll('.stream-address')){
        address.innerHTML = details.url;
    }
    // Player Embed
    if(isOnline){
        if(details.platform === "Twitch"){
            if(!embed){
                // docs: https://dev.twitch.tv/docs/embed/video-and-clips/#interactive-frames-for-live-streams-and-vods
                // TODO: maybe just replace this with a normal iframe?
                embed = new Twitch.Embed("stream-embed", {
                    channel: details.channel,
                    autoplay: false,
                    parent: ["localhost", "skeletom.net", "tomfarro.com", "skeletom.pizza"]
                }); 
            }
            if(embed.getPlayer().getChannel() !== details.channel){
                embed.getPlayer().setChannel(details.channel);
            }
            for(const title of document.querySelectorAll('.stream-title')){
                title.innerHTML = details.title;
            }
            for(const game of document.querySelectorAll('.stream-game')){
                game.innerHTML = details.category;
            }
        }else if(details.platform === "YouTube"){
            // TODO
        }
    }
    for(const panel of document.querySelectorAll('.stream-info')){
        if(isOnline){
            panel.classList.remove("hidden");
        }else{
            panel.classList.add("hidden");
        }
    }
});