const numberMap = {
    "0": '0️⃣',
    "1": '1️⃣',
    "2": '2️⃣',
    "3": '3️⃣',
    "4": '4️⃣',
    "5": '5️⃣',
    "6": '6️⃣',
    "7": '7️⃣',
    "8": '8️⃣',
    "9": '9️⃣'
}

function getHitCount(){
    const url = `/hits?page=${window.location.pathname}`;
    fetch(url).then(
        response => response.text()
    ).then(
        text => {
            const parsed = JSON.parse(text);
            const split = `${parsed.count}`.split('');
            let str = ''
            for(char of split){
                str += numberMap[char];
            }
            document.getElementById("hitcounter-value").innerHTML = str;
        }
    );
}

getHitCount();