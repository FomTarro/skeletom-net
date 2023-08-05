/**
 * Captures a complete snapsjhot of the calculator state
 * @returns 
 */
function generateVerboseState(){
	var p1info = $("#p1");
	var p2info = $("#p2");
	var p1 = createPokemon(p1info);
	var p2 = createPokemon(p2info);
	var p1field = createField();
	var p2field = p1field.clone().swap();
    const state = {
        gen: p1.gen,
		p1,
		p2,
		p1field,
		p2field
    };
	return state;
}

function generateMinifiedState(){
    const state = generateVerboseState();
    function generateMinifiedMon(mon){
        return {
            species: mon.name,
            lvl: mon.level,
            ability: mon.ability,
            tera: mon.teraType,
            evs: mon.evs,
            ivs: mon.ivs,
            nature: mon.nature,
            item: mon.item,
            boosts: mon.boosts,
            status: mon.status,
            moves: mon.moves.map((m) => { return m.originalName; })
        }
    }
    function generateField(field){
        // console.log("Field")
        // console.log(field)
        return {
            gravity: field.isGravity,
            magicRoom: field.isMagicRoom,
            wonderRoom: field.isWonderRoom,
            auraBreak: field.isAuraBreak,
            fairyAura: field.isFairyAura,
            darkAura: field.isDarkAura,
            sword: field.isSwordOfRuin,
            beads: field.isBeadsOfRuin,
            vessel: field.isVesselOfRuin,
            tablets: field.isTabletsOfRuin,
            terrain: field.terrain,
            weather: field.weather,
            left: generateFieldSide(field.attackerSide),
            right: generateFieldSide(field.defenderSide)
        }
    }

    function generateFieldSide(fieldSide){
        return {
            // cannonande: fieldSide.cannonade,
            auroraVeil: fieldSide.isAuroraVeil,
            battery: fieldSide.isBattery,
            flowerGift: fieldSide.isFlowerGift,
            friendGuard: fieldSide.isFriendGuard,
            helpingHand: fieldSide.isHelpingHand,
            lightScreen: fieldSide.isLightScreen,
            reflect: fieldSide.isReflect,
            sr: fieldSide.isSR,
            spikes: fieldSide.spikes,
            seeded: fieldSide.isSeeded,
        }
    }

    const minified = {
        gen: state.gen.num,
        format: state.p1field.gameType,
        p1: generateMinifiedMon(state.p1),
        p2: generateMinifiedMon(state.p2),
        field: generateField(state.p1field)
        // p3: generateMinifiedMon(state.p1),
        // p4: generateMinifiedMon(state.p2),
    }
    // const str = btoa(JSON.stringify(minified))
    // console.log(str);
    return minified;
}

/**
 * Applies the settings from a minifed state object to the calculator.
 * @param {*} state 
 */
function fromMinifiedState(state){
    console.log("Loading settings from State object...");
    console.log(state);
    for (const property in state){
        if(property === 'domain'){
            DOMAIN = state[property];
        }
        if(property === "format"){
            const element = $(`#${state[property].toLowerCase()}-format`);
            element.prop("checked", true);
            element.change();
        }
        else if(property === "field"){
            const info = $(`.field-info`);
            if(info){
                const field = state[property];
                for (const fieldProperty in field){
                    // terrain and weather selector elements are named after the value, 
                    // all others are named after the property with the value being a boolean
                    if(fieldProperty === "terrain" || fieldProperty === "weather"){
                        info.find(`#${stringToElementSelector(field[fieldProperty])}`).prop("checked", true);
                    }else if(fieldProperty === "left" || fieldProperty === "right"){
                        const side = field[fieldProperty];
                        for (const sideProperty in side){
                            const elementName = `#${stringToElementSelector(sideProperty, true)}${fieldProperty === "left" ? "L" : "R"}`;
                            if(sideProperty.includes('spikes')){
                                // TODO: don't check for spikes, check if the value is a number
                                console.log(`${elementName}${side[sideProperty]}`);
                                info.find(`${elementName}${side[sideProperty]}`).prop("checked", true);
                            }else{
                                info.find(elementName).prop("checked", true);
                            }
                        }
                    }else {
                        info.find(`#${stringToElementSelector(fieldProperty)}`).prop("checked", true);
                    }
                }
            }
        }
        else if(property !== "gen"){
            const info = $(`#${property}`);
            if(info){
                const mon = state[property];
                if(mon.species){
                    const set = `${mon.species} (Blank Set)`;
                    info.find(".set-selector").val(set);
                    // info.find(".select2-chosen").first().text(set);
                    info.find(".set-selector").change();
                    info.find(".level").val(mon.lvl || 100);
                    info.find(".ability").val(mon.ability);
                    info.find(".nature").val(mon.nature);
                    info.find(".item").val(mon.item);
                    if(mon.evs){
                        info.find(".hp .evs").val(mon.evs.hp  || 0);
                        info.find(".at .evs").val(mon.evs.atk || 0);
                        info.find(".df .evs").val(mon.evs.def || 0);
                        info.find(".sa .evs").val(mon.evs.spa || 0);
                        info.find(".sd .evs").val(mon.evs.spd || 0);
                        info.find(".sp .evs").val(mon.evs.spe || 0);
                    };
                    if(mon.ivs){
                        info.find(".hp .ivs").val(mon.ivs.hp  || 31);
                        info.find(".at .ivs").val(mon.ivs.atk || 31);
                        info.find(".df .ivs").val(mon.ivs.def || 31);
                        info.find(".sa .ivs").val(mon.ivs.spa || 31);
                        info.find(".sd .ivs").val(mon.ivs.spd || 31);
                        info.find(".sp .ivs").val(mon.ivs.spe || 31);
                    }
                    if(mon.boosts){
                        info.find(".at .boost").val(mon.boosts.atk || 0);
                        info.find(".df .boost").val(mon.boosts.def || 0);
                        info.find(".sa .boost").val(mon.boosts.spa || 0);
                        info.find(".sd .boost").val(mon.boosts.spd || 0);
                        info.find(".sp .boost").val(mon.boosts.spe || 0);
                    }
                    for(var i = 0; i < 4; i++){
                        if(mon.moves && mon.moves[i]){
                            info.find(`.move${i+1} .move-selector`).val(mon.moves[i]);
                            info.find(`.move${i+1} .move-selector`).change();
                        }
                    }
                }
            }
        }
    }
    console.log("State loaded.");
}

/**
 * Captures the current minified state and generates a Share URL including all relevant settings as query parameters
 * @returns 
 */
function toShareURL(){
    const url = DOMAIN ? new URL(DOMAIN) 
    : new URL(location.protocol + '//' + location.host + location.pathname);
    const flattenedState = flatten(generateMinifiedState());
    for (const property in flattenedState){
        // No need to add default-value EVs or boosts to the query (but 0 IVs are still noteworthy) 
        if(flattenedState[property] !== undefined 
        && (!(property.includes(".ivs") && flattenedState[property] === 31))
        && (!((property.includes(".evs") || property.includes(".boosts")) && flattenedState[property] === 0))
        && (!(property.includes("field.") && (flattenedState[property] === false || flattenedState[property] === 0)))
        && flattenedState[property] !== ""){
            url.searchParams.append(property, flattenedState[property]);
        }
    }
    return url.toString();
}


var DOMAIN;
/**
 * Unflattens the query parameters into a minified state object.
 * @returns 
 */
function fromShareURL(){
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const minifiedState = unflatten(params);
    return minifiedState;
}


function unflatten(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
};
 
function flatten(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

function stringToElementSelector(str, preserveCase){
    if(typeof str === "string"){
        if(preserveCase){
            return str.replaceAll(' ', '-');
        }else{
            return str.replaceAll(' ', '-').toLowerCase();
        }
    }
    return str;
}

$(document).ready(function () {
    if(parent){
        document.getElementById('header').remove();
    }
});