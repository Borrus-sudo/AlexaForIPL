let lastWicketRecord = "";
let lastCommentaryRecord = [];
let lastBallRecorder = ""
const FOUR = "four";
const SIX = "six";
const matchBallRegExp = /(\d{1,2}\.\d{1})/g;
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
        const previousBall = commentary.match(matchBallRegExp)[1];
        const unpureBallCommentary = commentary.split(previousBall)[0].trim().toLowerCase();
        const latestBall = unpureBallCommentary.match(matchBallRegExp)[0];
        const latestBallCommentary = unpureBallCommentary.split(latestBall)[1].trim();
        if (lastBallRecorder != latestBall) {
            lastBallRecorder = latestBall;
            const bowler = latestBallCommentary.split("to")[0];
            const batsman = latestBallCommentary.split(',')[1];
            if (latestBall != '20.0') {
                console.log(latestBallCommentary);
                if (latestBallCommentary.includes(FOUR)) {
                    console.log("bloody four", {
                        batsman,
                        bowler
                    });
                } else if (latestBallCommentary.includes(SIX)) {
                    console.log("bloody six", {
                        batsman,
                        bowler
                    });
                }
                console.log("-".repeat(process.stdout.rows));
            } else {
                console.log("Last  Ball");
            }
        }
    }
}