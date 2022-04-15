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
    var specmsg = "";
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
            }
        }
        else {
            specmsg = "You don't have that!\n";
        }
    }
    var roomData = rooms[playerData.roomAt];
    var sights = `You see items: [${roomData.items.join(", ")}]`;
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

Press enter to begin quest!
`);