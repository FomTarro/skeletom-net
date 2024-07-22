function reqListener() {
    console.log("Checking stream status...");
    if(this.responseText){
        const parsed = JSON.parse(this.responseText);
        for(const address of document.querySelectorAll('.stream-address')){
            address.innerHTML = parsed.address;
        }
        for(const status of document.querySelectorAll('.stream-status')){
            if(parsed.status === "ONLINE"){
                status.classList.add("online");
                status.classList.remove("offline");
                status.innerHTML = "ONLINE";
                for(const link of document.querySelectorAll('.stream-link')){
                    link.classList.remove("translucent")
                }
            }else{
                status.classList.add("offline");
                status.classList.remove("online");
                status.innerHTML = "OFFLINE";
                for(const link of document.querySelectorAll('.stream-link')){
                    link.classList.add("translucent")
                }
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