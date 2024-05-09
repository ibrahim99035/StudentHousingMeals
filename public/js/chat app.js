class App {
    static messages = [];
  
    static sendMessage() {
      let message = document.getElementById("newMessage").value;
      let from = document.getElementById("from").value;
      localStorage.setItem("from", from);
  
      App.messages.push(new Message(message, from));
      document.getElementById("newMessage").value = "";
  
      localStorage.setItem("messages", JSON.stringify(App.messages));
      App.refreshChat();
    }
  
    static refreshChat() {
      let div = document.getElementById("chat-content");
  
      for (
        let index = div.childNodes.length - 1;
        index < App.messages.length;
        index++
      ) {
        const element = App.messages[index];
        let msg = document.createElement("span");
  
        msg.id = "msg-" + index;
        msg.classList.add("msg");
        msg.innerHTML = "<div class='head'> " + element.from + " </div>";
        msg.innerHTML += "<p class='body'> " + element.message + " </p>";
        msg.innerHTML += "<div class='footer'> " + element.timeStr + " </div>";
        div.appendChild(msg);
      }
    }
  }
  
  class Message {
    constructor(msg, from) {
      this.message = msg;
      this.time = new Date(Date.now());
      this.timeStr = this.time.toLocaleTimeString();
      this.from = from;
    }
  }
  
  let activated = false;
  let emojiBtn = document.getElementById("emoji");
  
  let emojiList = [
    "👍",
    "👌",
    "👏",
    "🙏",
    "🆗",
    "🙂",
    "😀",
    "😃",
    "😉",
    "😊",
    "😋",
    "😌",
    "😏",
    "😐",
    "😑",
    "😒",
    "😓",
    "😂",
    "🤣",
    "😅",
    "😆",
    "😜",
    "😹",
    "🚶",
    "👫",
    "👬",
    "👭",
    "😙",
    "😘",
    "🏠",
    "👆",
    "🖕",
    "👋",
    "👎",
    "👈",
    "👉"
  ];
  emojiList.forEach(element => {
    let list = document.getElementById("emoji-list");
    let node = document.createElement("span");
    node.classList.add("emoji");
    node.textContent = element;
    node.onclick = ev => {
      document.getElementById("newMessage").value += node.textContent;
    };
    list.appendChild(node);
  });
  
  emojiBtn.onclick = function(evt) {
    activated = !activated;
  
    let list = document.getElementById("emoji-list");
    if (activated) {
      list.style.display = "flex";
    } else {
      list.style.display = "none";
    }
  };
  
  document.getElementById("from").value =
    localStorage.getItem("from") !== undefined
      ? localStorage.getItem("from")
      : "";
  App.messages =
    JSON.parse(localStorage.getItem("messages")) !== null
      ? JSON.parse(localStorage.getItem("messages"))
      : new Array();
  
  let div = document.getElementById("chat-content");
  for (let index = 0; index < App.messages.length; index++) {
    const element = App.messages[index];
    let msg = document.createElement("span");
  
    msg.id = "msg-" + index;
    msg.classList.add("msg");
    msg.innerHTML = "<div class='head'> " + element.from + " </div>";
    msg.innerHTML += "<p class='body'> " + element.message + " </p>";
    msg.innerHTML += "<div class='footer'> " + element.timeStr + " </div>";
    div.appendChild(msg);
  }