const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

levelNames = ['Basketball', "Wall", "The Stack"]
levelFileNames = ["basketball.js", "wall.js", "theStack.js"]
level = urlParams.get('level')
document.getElementById("title").innerHTML = levelNames[level - 1]

document.getElementById("title").style.color = randomColors[Math.floor(Math.random()*randomColors.length)]
if (level == undefined) {
    location.href = `?level=1`
}

var lvlScript = document.createElement('script');
lvlScript.setAttribute('src','levelScripts/'+levelFileNames[level-1]);
document.body.appendChild(lvlScript);

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