const axios = require('axios');
const cheerio = require('cheerio');
const io = require('socket.io')();
let baseURL = `https://www.cricbuzz.com/`;
let prev = "";
let timer = 50;
let anchorTag = 'https://www.cricbuzz.com';
let lastWicketRecord = "";
let lastCommentaryRecord = [];
let lastBallRecorder = ""
const FOUR = "four";
const SIX = "six";

//Socket.io initialization
io.on("connection", socket => {
    console.log(socket);
});
io.listen(3000);

function extractWicket(data) {
    const latestWicket = data.slice(data.indexOf("Last Wkt"), data.indexOf("Last 5")).trim();
    if (lastWicketRecord != latestWicket) {
        lastWicketRecord = latestWicket;
        console.log(latestWicket);
    }
}

function extractBoundaries(commentary) {
    commentary = commentary.split("Last 5 overs")[1];
    const latestBall = commentary.match(/(\d{1,2}\.\d{1})/g)[0];
    if (lastBallRecorder != latestBall) {
        lastBallRecorder = latestBall;
        if (latestBall != '20.0') {
            const latestBallCommentary = commentary.split(latestBall)[0].trim().toLowerCase();
            if (latestBallCommentary.includes(FOUR)) {
                console.log("bloody four");

            } else if (latestBallCommentary.includes(SIX)) {
                console.log("bloody six");
            }
        }
    }
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
    const keyStatsHTML = $('div.cb-key-lst-wrp.cb-font-12.cb-text-gray');
    const commentaryHTML = $('div.cb-col-67.cb-col');
    const keyStats = keyStatsHTML.text().trim();
    const commentary = commentaryHTML.text();
    extractWicket(keyStats);
    extractBoundaries(commentary);
    setTimeout(refresher, timer);
}