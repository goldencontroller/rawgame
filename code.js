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
    xp: 0,
    alive: true,
}
function tick(input) {
    if (!playerData.alive) location.reload();
    var specmsg = "";
    var cmd = {
        name: input.split(" ")[0],
        param: input.split(" ")[1]
    };
    if (cmd.name == "go") {
        var currRoom = playerData.roomAt;
        var direction = cmd.param;
        if (rooms[currRoom][direction]) {
            if (rooms[currRoom].enemies.length > 0) {
                playerData.alive = false;
                return "As you were trying to flee, you were killed by the " + rooms[currRoom].enemies[0] + ". \n\nGAME OVER\n\nPress Enter to reset";

            }
            playerData.roomAt = rooms[playerData.roomAt][cmd.param];
        }
        else {
            specmsg = "You can't go that way!\n";
        }
    }
    if (cmd.name == "get") {
        var itemToGrab = cmd.param;
        var currRoom = playerData.roomAt;
        if (rooms[currRoom].items.includes(itemToGrab)) {
            playerData.inventory.push(itemToGrab);
            var index = rooms[currRoom].items.indexOf(itemToGrab);
            rooms[currRoom].items.splice(index, 1);
        }
        else {
            specmsg = "You can't get that!\n";
        }
    }
    if (cmd.name == "use") {
        if (playerData.inventory.includes(cmd.param)) {
            var currRoom = playerData.roomAt;
            switch (cmd.param) {
                case "book":
                    specmsg = `The book says:
THERE IS A GOLDEN APPLE IN
THE VOLCANO, IKEN.  ONLY A
TRUE WIZARD CAN BE ABLE TO
OBTAIN IT.  IT IS DEFENDED
BY A FURIOUS DRAGON!!!!!!!
`;
                    break;
                case "rock":
                    if (rooms[currRoom].enemies.length) {
                        if (rooms[currRoom].enemies[0] == "giant") {
                            specmsg = "You killed the " + rooms[currRoom].enemies[0] + "!\n";
                            rooms[currRoom].enemies.pop();
                        }
                        else {
                            specmsg = "It has no effect!\n";
                        }
                    }
                    else {
                        specmsg = "It has no effect!\n";
                    }
                    break;
                case "wand":
                    if (rooms[currRoom].enemies.length) {
                        if (rooms[currRoom].enemies[0] == "Hydra") {
                            specmsg = "You killed the " + rooms[currRoom].enemies[0] + "!\n";
                            rooms[currRoom].enemies.pop();
                        }
                        else {
                            specmsg = "It has no effect!\n";
                        }
                    }
                    else {
                        specmsg = "It has no effect!\n";
                    }
                    break;
                case "torch":
                    if (rooms[currRoom].enemies.length) {
                        if (rooms[currRoom].enemies[0] == "Dragon") {
                            specmsg = "You killed the " + rooms[currRoom].enemies[0] + "!\n";
                            specmsg += "\nYou grab the golden apple from under the dragon's corpse. Use it to win!\n";
                            playerData.inventory.push("apple");
                            rooms[currRoom].enemies.pop();
                        }
                        else {
                            specmsg = "It has no effect!\n";
                        }
                    }
                    else {
                        specmsg = "It has no effect!\n";
                    }
                    break;
                case "apple":
                    playerData.alive = false;
                    return "You got food poisoning and died.\n\nGAME OVER\n\nPress Enter to reset";
                    break;
                default:
                    specmsg = "It's no use!\n";
                    break;
            }
        }
        else {
            specmsg = "You don't have that!\n";
        }
    }
    var roomData = rooms[playerData.roomAt];
    var sights = `You see items: [${roomData.items.join(", ")}]`;
    if (roomData.enemies.length) {
        sights += "\nYou see a " + roomData.enemies[0];
    }
    var availDirs = [];
    for (var dir of ["north", "south", "east", "west"]) {
        if (roomData[dir]) {
            availDirs.push(dir);
        }
    }
    var ctrlhelp = "Now, you can:\n> go [" + availDirs.join(", ") + "]\n> get [item]\n> use [item in backpack]";
    return `${specmsg}\nYou are in the ${playerData.roomAt}\n${sights}\n\nYour backpack: [${playerData.inventory.join(", ")}] \n${ctrlhelp}\n`;
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

writeMSG(`
Golden Controller presents

 - RICHARD THE WIZARD -

Press Enter to begin quest!
`);