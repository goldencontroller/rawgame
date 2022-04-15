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

var playerData = {
    roomAt: "House",
    inventory: [],
    xp: 0
}
function tick(input) {
    var ctrlhelp = "Now, you can:\n> go [north, south, east, west]\n> get [item]\n> use [item in inventory]";
    return `\nYour inventory: [${playerData.inventory.join(", ")}] \n${ctrlhelp}\n`;
}

prompt.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        term.innerText += this.innerText;
        writeMSG(tick(this.innerText));
        this.innerText = "";
    }
});