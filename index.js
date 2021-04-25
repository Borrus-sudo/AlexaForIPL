const axios = require('axios');
const cheerio = require('cheerio');
const extract = require('./extracts');
let baseURL = `https://www.cricbuzz.com/`;
let prev = "";
let timer = 50;
let anchorTagURL = 'https://www.cricbuzz.com';
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
    if (checkIfIPLMatch(matchData[0])) {
        anchorTagURL += anchor.attr('href');
        refresher();
    }
})();
const refresher = async() => {
    {
        const {
            data
        } = await axios.get(baseURL);
        const $ = cheerio.load(data);
        const currentMatches = $('#hm-scag-mtch-blk');
        const matchData = currentMatches.text().split("   ").map(c => c.trim()).filter(line => line != "");
        if (prev != matchData[0])
            console.log(matchData[0]);
        prev = matchData[0];

    } {
        const {
            data,
        } = await axios.get(anchorTagURL);
        const $ = cheerio.load(data);
        const keyStatsHTML = $('div.cb-key-lst-wrp.cb-font-12.cb-text-gray');
        const commentaryHTML = $('div.cb-col-67.cb-col');
        const keyStats = keyStatsHTML.text().trim();
        const commentary = commentaryHTML.text();
        extract.extractWicket(keyStats);
        extract.extractBoundaries(commentary);
        setTimeout(refresher, timer);
    }
}