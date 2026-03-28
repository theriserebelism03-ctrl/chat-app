// Connect to the server using Socket.IO
const socket = io("http://localhost:3001");

// Get DOM elements
const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");
const usernameSection = document.getElementById("usernameSection");
const chatSection = document.getElementById("chatSection");
const userInfo = document.getElementById("userInfo");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

// Store current user's username
let currentUsername = "";

// Function to add a message to the chat display
function addMessage(user, text, isOwnMessage = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isOwnMessage ? "message user-message" : "message other-message";
  const displayName = isOwnMessage ? "You" : user;
  messageDiv.innerHTML = `<strong>${displayName}:</strong> ${text}`;
  chatBox.appendChild(messageDiv);
  
  // Auto-scroll to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to join the chat
function joinChat() {
  const username = usernameInput.value.trim();
  
  if (username === "") {
    alert("Please enter a username!");
    return;
  }
  
  if (username.length < 2) {
    alert("Username must be at least 2 characters!");
    return;
  }
  
  currentUsername = username;
  
  // Hide username section, show chat section
  usernameSection.style.display = "none";
  chatSection.style.display = "flex";
  userInfo.textContent = `Logged in as: ${currentUsername}`;
  
  // Add system message
  addMessage("System", `${currentUsername} joined the chat!`, false);
  
  messageInput.focus();
}

// Function to send a message
function sendMessage() {
  const messageText = messageInput.value.trim();
  
  if (messageText === "") return;
  
  // Create message object
  const messageData = {
    user: currentUsername,
    text: messageText
  };
  
  // Emit the message to the server
  socket.emit("send_message", messageData);
  
  // Add the message to our chat display (as own message)
  addMessage(currentUsername, messageText, true);
  
  // Clear the input field
  messageInput.value = "";
  messageInput.focus();
}

// Join chat on button click
joinBtn.addEventListener("click", joinChat);

// Join chat on Enter key press in username field
usernameInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    joinChat();
  }
});

// Send message on button click
sendBtn.addEventListener("click", sendMessage);

// Send message on Enter key press in message field
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Listen for incoming messages from other users
socket.on("receive_message", (messageData) => {
  addMessage(messageData.user, messageData.text, false);
});

// Handle connection
socket.on("connect", () => {
  console.log("Connected to server");
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
  usernameSection.style.display = "flex";
  chatSection.style.display = "none";
  currentUsername = "";
  messageInput.value = "";
  usernameInput.value = "";
});
