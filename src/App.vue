<template>
  <div class="flex flex-col h-screen bg-gray-100 font-gilroy md:flex-row">
    <!-- Sidebar / Topbar -->
    <aside class="w-full bg-gray-900 text-white flex items-center justify-between px-4 py-3 md:w-64 md:flex-col md:items-start md:justify-start md:p-6">
      <h2 class="text-lg font-bold md:mb-6 md:text-2xl">AI Chatbot</h2>
      <div class="opacity-50 md:flex-1 md:flex md:items-center md:justify-center">Sidebar</div>
    </aside>
    <!-- Chat Section -->
    <div class="flex-1 flex flex-col relative bg-white">
      <div class="flex-1 overflow-y-auto px-2 py-4 pb-28 md:px-6 md:py-8 md:pb-32">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="[
            'mb-3 p-3 rounded-lg max-w-[90%] break-words text-sm',
            msg.role === 'user'
              ? 'bg-blue-100 self-end ml-auto'
              : 'bg-gray-100 self-start mr-auto',
            'md:mb-4 md:p-4 md:text-base md:max-w-[70%]'
          ]"
        >
          <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}:</strong> {{ msg.content }}
        </div>
      </div>
      <form
        @submit.prevent="sendMessage"
        class="fixed left-0 right-0 bottom-0 bg-gray-100 px-2 py-3 flex gap-2 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] z-10 md:left-64 md:px-6 md:py-4 md:gap-3"
      >
        <input
          v-model="input"
          type="text"
          placeholder="Type your message..."
          autocomplete="off"
          :disabled="loading"
          class="flex-1 p-2 rounded-md border border-gray-300 text-sm outline-none disabled:bg-gray-200 md:p-3 md:text-base"
        />
        <button
          type="submit"
          :disabled="loading || !input.trim()"
          class="px-4 rounded-md border-none bg-emerald-600 text-white font-semibold text-sm transition-colors duration-200 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed md:px-6 md:text-base"
        >
          Send
        </button>
      </form>
    </div>
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