const axios = require('axios');
const cheerio = require('cheerio');
let baseURL = `https://www.cricbuzz.com/`;
let prev = "";
let timer = 50;
let anchorTag = 'https://www.cricbuzz.com';
let lastWicketRecord = "";

function extractData(data) {
    const lastWicket = data.slice(data.indexOf("Last Wkt"), data.indexOf(data.match(/Last\s\d/)[0].trim()) + 1).trim();
    if (lastWicketRecord != lastWicket) {
        lastWicketRecord = lastWicket;
        //say wicket gone
    }
    // console.log(lastWicket);
}

(async() => {
    const checkIfIPLMatch = (data) => {
        const teams = ["CSK", "DC", "RCB", "MI", "SRH", "RR", "KKR", "PBKS"];
        let ans = false;
        teams.forEach((team) => {
            ans = data.includes(team) ? true : ans
        });
        return ans;
    }
    const {
        data
    } = await axios.get(baseURL);
    const $ = cheerio.load(data);
    const currentMatches = $('#hm-scag-mtch-blk');
    const matchData = currentMatches.text().split("   ").map(c => c.trim()).filter(line => line != "");
    const ul = $(currentMatches.children()[0]);
    const li = $(ul.children()[0]);
    const anchor = $(li.children()[0]);
    anchorTag += anchor.attr('href');
    if (checkIfIPLMatch(matchData[0]))
        refresher();
})();
const refresher = async() => {
    const {
        data
    } = await axios.get(baseURL);
    const $ = cheerio.load(data);
    const currentMatches = $('#hm-scag-mtch-blk');
    const matchData = currentMatches.text().split("   ").map(c => c.trim()).filter(line => line != "");
    if (prev != matchData[0])
        console.log(matchData[0]);
    prev = matchData[0];
    setTimeout(refresher2, timer);
}
const refresher2 = async() => {
    const {
        data,
    } = await axios.get(anchorTag);
    const $ = cheerio.load(data);
    // const keyStatsHTML = $('div.cb-key-lst-wrp.cb-font-12.cb-text-gray');
    const allCommentary = $('div.cb-col-67.cb-col');
    // const keyStats = keyStatsHTML.text().trim();
    // extractData(keyStats);
    console.log(scoreBoard.text());
    setTimeout(refresher, timer);
}