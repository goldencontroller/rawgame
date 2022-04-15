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

prompt.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        term.innerText += this.innerText;
        writeMSG("input got");
        this.innerText = "";
    }
});