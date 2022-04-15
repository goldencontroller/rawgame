var term = document.querySelector("#displayScreen");
var prompt = document.querySelector("#inputter");

function writeMSG(stuff) {
    term.innerText += "\n";
    term.innerText += stuff;
    term.innerText += "\n > ";
}

prompt.focus();
prompt.addEventListener("blur", function() {
    this.focus();
});

var request = new XMLHttpRequest();
request.open('GET', "roomsdata.json", false);
request.send();
var rooms = JSON.parse(request.responseText);

var playerData = {
    roomAt: "House",
    inventory: [],
    xp: 0
}
function tick(input) {
    var cmd = {
        name: input.split(" ")[0],
        param: input.split(" ")[1]
    };
    if (cmd.name == "go") {
        var currRoom = playerData.roomAt;
        var direction = cmd.param;
        if (rooms[currRoom][direction]) {
            playerData.roomAt = rooms[playerData.roomAt][cmd.param];
        }
    }
    var roomData = rooms[playerData.roomAt];
    var sights = "You see items: " + roomData.items.join(", ");
    var ctrlhelp = "Now, you can:\n> go [north, south, east, west]\n> get [item]\n> use [item in inventory]";
    return `\nYou are in the ${playerData.roomAt}\n${sights}\n\nYour inventory: [${playerData.inventory.join(", ")}] \n${ctrlhelp}\n`;
}

prompt.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        term.innerText += this.innerText;
        writeMSG(tick(this.innerText));
        this.innerText = "";
        window.scrollTo(0, document.body.scrollHeight);
    }
});