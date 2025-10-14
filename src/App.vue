<template>
  <div class="chat-container">
    <div class="chat-window">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-message', msg.role]">
        <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}:</strong> {{ msg.content }}
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="chat-input">
      <input
        v-model="input"
        type="text"
        placeholder="Type your message..."
        autocomplete="off"
      />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      messages: [],
      loading: false,
    };
  },
  methods: {
    async sendMessage() {
      if (!this.input.trim() || this.loading) return;
      const userMsg = { role: "user", content: this.input };
      this.messages.push(userMsg);
      this.input = "";
      this.loading = true;

      // Call your backend API (adjust the endpoint as needed)
      try {
        const res = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: this.messages }),
        });
        const data = await res.json();
        this.messages.push({ role: "assistant", content: data.reply });
      } catch (e) {
        this.messages.push({ role: "assistant", content: "Error: Could not get response." });
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 700px;
  margin: 60px auto;
  border: 1.5px solid #eee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px #0002;
  display: flex;
  flex-direction: column;
  height: 800px;
  font-size: 1.25rem;
  color: #111;
}
.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
.chat-message {
  margin-bottom: 18px;
  padding: 14px 18px;
  border-radius: 8px;
  max-width: 85%;
  word-break: break-word;
  color: #111;
  font-size: 1.15em;
}
.chat-message.user {
  background: #e0e7ff;
  align-self: flex-end;
}
.chat-message.assistant {
  background: #f3f4f6;
  align-self: flex-start;
}
.chat-input {
  display: flex;
  border-top: 1.5px solid #eee;
  padding: 20px;
}
.chat-input input {
  flex: 1;
  padding: 14px;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  margin-right: 12px;
  font-size: 1.1em;
  color: #e6e0e0;
}
.chat-input button {
  padding: 14px 28px;
  border-radius: 6px;
  border: none;
  background: #646cff;
  color: #fff;
  cursor: pointer;
  font-size: 1.1em;
}
.chat-input button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>