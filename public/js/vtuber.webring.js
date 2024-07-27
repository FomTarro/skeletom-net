// onionring.js is made up of four files - onionring-widget.js (this one!), onionring-index.js, onionring-variables.js and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (Ã¨â€™Å“) house, last updated 2020-11-24

// === ONIONRING-WIDGET ===
// this file contains the code which builds the widget shown on each page in the ring. ctrl+f 'EDIT THIS' if you're looking to change the actual html of the widget

const tag = document.getElementById(ringID); // find the widget on the page
thisSite = window.location.href; // get the url of the site we're currently on
thisIndex = sites.findIndex(site => site.includes("skeletom.net") || thisSite.startsWith("http://localhost"))

function randomSite() {
  const R18_FILTER = [
    "https://xinjinmeng.neocities.org"
  ]
  otherSites = sites.slice();
  otherSites.splice(thisIndex, 1);
  otherSites = otherSites.filter(site => !R18_FILTER.includes(site));
  randomIndex = Math.floor(Math.random() * otherSites.length);
  location.href = otherSites[randomIndex];
}


// if we didn't find the site in the list, the widget displays a warning instead
if (thisIndex == null) {
  tag.insertAdjacentHTML('afterbegin', `
<table>
  <tr>
    <td>This site isn't part of the ${ringName} webring yet. You should talk to the manager to have your site added to the list!</td>
  </tr>
</table>
  `);
} else {
  // find the 'next' and 'previous' sites in the ring. this code looks complex
  // because it's using a shorthand version of an if-else statement to make sure
  // the first and last sites in the ring join together correctly
  previousIndex = (thisIndex - 1 < 0) ? sites.length - 1 : thisIndex - 1;
  nextIndex = (thisIndex + 1 >= sites.length) ? 0 : thisIndex + 1;

  indexText = ""
  // if you've chosen to include an index, this builds the link to that
  if (useIndex) {
    indexText = `<a href='${indexPage}'>index</a>`;
  }

  randomText = ""
  // if you've chosen to include a random button, this builds the link that does that
  if (useRandom) {
    randomText = `<a href='javascript:void(0)' onclick='randomSite()'>random</a>`;
  }

  // this is the code that displays the widget 
  // EDIT THIS if you want to change the structure
  tag.insertAdjacentHTML('afterbegin', `
  <table>
    <tr>
    <td class='webring-info' colspan=3>
      <div id='vtubers-on-neocities-title-wrapper'>
        <div id='vtubers-on-neocities-title-elem-1'>
        Vtubers
        </div>
        <div id='vtubers-on-neocities-title-elem-2'>
        o n
        </div>
        <div id='vtubers-on-neocities-title-elem-3' class='strikethrough'>
        n e o c i t i e s
        </div>
        <div id='vtubers-on-neocities-title-elem-5'>
        SELF-HOSTING
        </div>
        <div id='vtubers-on-neocities-title-elem-4'>
        !
        </div>
      </div>
      </center>
    </td>
    </tr>
    <tr>
      <td class='webring-prev'><a href='${sites[previousIndex]}'>← prev</a></td>
      <td class='webring-info'>
      <span class='webring-links' align="center">
        ${randomText} | ${indexText}<td class='webring-next'><a href='${sites[nextIndex]}'>next →</a></td>
    </tr>
  </table>
  `);
}
