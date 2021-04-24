let lastWicketRecord = "";
let lastCommentaryRecord = [];
let lastBallRecorder = ""
const FOUR = "four";
const SIX = "six";
module.exports = {
    extractWicket(data) {
        const latestWicket = data.slice(data.indexOf("Last Wkt"), data.indexOf("ov.") + 2).trim();
        if (lastWicketRecord != latestWicket) {
            lastWicketRecord = latestWicket;
            console.log(latestWicket);
        }
    },
    extractBoundaries(commentary) {
        commentary = commentary.split("Toss")[1] || commentary;
        const matchBallRegExp = /(\d{1,2}\.\d{1})/g;
        const previousBall = commentary.match(matchBallRegExp)[1];
        const unpureBallCommentary = commentary.split(previousBall)[0].trim().toLowerCase();
        const latestBall = unpureBallCommentary.match(matchBallRegExp)[0];
        const latestBallCommentary = unpureBallCommentary.split(latestBall)[1].trim();
        if (lastBallRecorder != latestBall) {
            lastBallRecorder = latestBall;
            if (latestBall != '20.0') {
                console.log(latestBallCommentary);
                if (latestBallCommentary.includes(FOUR)) {
                    console.log("bloody four");
                } else if (latestBallCommentary.includes(SIX)) {
                    console.log("bloody six");
                }
            }
        }
    }
}