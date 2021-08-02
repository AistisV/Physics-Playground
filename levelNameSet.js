const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

levelNames = ['Basketball', "other"]
level = urlParams.get('level')
document.getElementById("title").innerHTML = levelNames[level - 1]

randomColors = ["#4284E4", "#986EE2", "#C96198", "#E5534B", "#CC6B2C", "#AE7C13", "#46954A"]

document.getElementById("title").style.color = randomColors[Math.floor(Math.random()*randomColors.length)]
if (level == undefined) {
    location.href = `?level=1`
}

function changeLvl(way) {
    if (way == "back") {
        if (level > 1) {
            location.href = `?level=${parseInt(level) - 1}`
        }
    } else if (way == "front") {
        if (level < levelNames.length) {
            location.href = `?level=${parseInt(level) + 1}`
        }
    }
}