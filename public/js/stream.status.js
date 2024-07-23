let embed = undefined;
function reqListener() {
    console.log("Checking stream status...");
    if(this.responseText){
        const parsed = JSON.parse(this.responseText);
        const isOnline = (parsed.status === "ONLINE")
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
            address.innerHTML = parsed.address;
        }
        for(const link of document.querySelectorAll('.stream-link')){
            if(isOnline){
                link.classList.remove("translucent");
            }else{
                link.classList.add("translucent");
            }
        }
        for(const title of document.querySelectorAll('.stream-title')){
            if(isOnline){
                title.innerHTML = parsed.title;
            }
        }
        for(const game of document.querySelectorAll('.stream-game')){
            if(isOnline){
                game.innerHTML = parsed.game;
            }
        }
        if(isOnline){
            if(!embed){
                embed = new Twitch.Embed("stream-embed", {
                    channel: parsed.channel,
                    autoplay: false,
                    parent: ["localhost", "skeletom.net", "tomfarro.com", "skeletom.pizza"]
                }); 
            }
            if(embed.getPlayer().getChannel !== parsed.channel){
                embed.getPlayer().setChannel(parsed.channel);
            }
            for(const game of document.querySelectorAll('.stream-info')){
                game.classList.remove("hidden");
            }
        }else{
            for(const game of document.querySelectorAll('.stream-info')){
                game.classList.add("hidden");
            }
        }
    }
}

function getStreamStatus(){
    const req = new XMLHttpRequest();
    req.addEventListener("load", reqListener);
    req.open("GET", "/stream/status");
    req.send();
}

const poller = setInterval(getStreamStatus, 5000);
getStreamStatus();