let embed = undefined;

function getStreamStatus(){
    const url = `/stream/status`
    fetch(url).then(
        response => response.text()
    ).then(
        text => {
            const parsed = JSON.parse(text);
            const isOnline = (parsed.status === "ONLINE")
            // The whole marquee
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
            // Stream Address written text
            for(const address of document.querySelectorAll('.stream-address')){
                address.innerHTML = parsed.address;
            }
            if(isOnline){
                if(!embed){
                    // docs: https://dev.twitch.tv/docs/embed/video-and-clips/#interactive-frames-for-live-streams-and-vods
                    // TODO: maybe just replace this with a normal iframe?
                    embed = new Twitch.Embed("stream-embed", {
                        channel: parsed.channel,
                        autoplay: false,
                        parent: ["localhost", "skeletom.net", "tomfarro.com", "skeletom.pizza"]
                    }); 
                }
                if(embed.getPlayer().getChannel() !== parsed.channel){
                    embed.getPlayer().setChannel(parsed.channel);
                }
                for(const title of document.querySelectorAll('.stream-title')){
                    title.innerHTML = parsed.title;
                }
                for(const game of document.querySelectorAll('.stream-game')){
                    game.innerHTML = parsed.game;
                }
            }
            for(const panel of document.querySelectorAll('.stream-info')){
                if(isOnline){
                    panel.classList.remove("hidden");
                }else{
                    panel.classList.add("hidden");
                }
            }
        }
    );
}

const poller = setInterval(getStreamStatus, 5000);
getStreamStatus();