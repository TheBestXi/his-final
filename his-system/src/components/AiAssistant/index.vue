<template>
  <div class="ai-assistant">
    <!-- Floating Button -->
    <div class="floating-btn" @click="toggleChat" :class="{ 'is-active': visible }">
      <el-icon :size="24"><ChatDotRound /></el-icon>
    </div>

    <!-- Chat Window -->
    <transition name="slide-fade">
      <div v-show="visible" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-left">
            <el-icon><Service /></el-icon>
            <span>智能助手</span>
          </div>
          <div class="header-right">
            <el-tooltip content="设置" placement="top">
              <el-icon class="action-icon" @click="showSettings = !showSettings"><Setting /></el-icon>
            </el-tooltip>
            <el-tooltip content="清空对话" placement="top">
              <el-icon class="action-icon" @click="clearMessages"><Delete /></el-icon>
            </el-tooltip>
            <el-icon class="action-icon" @click="visible = false"><Close /></el-icon>
          </div>
        </div>

        <!-- Settings Panel -->
        <div v-if="showSettings" class="settings-panel">
          <h3>配置</h3>
          <el-form label-position="top" size="small">
            <el-form-item label="API Key">
              <el-input v-model="settings.apiKey" type="password" placeholder="请输入 API Key" show-password />
            </el-form-item>
            <el-form-item label="Base URL">
              <el-input v-model="settings.baseUrl" placeholder="https://api.deepseek.com" />
            </el-form-item>
            <el-form-item label="Model">
              <el-input v-model="settings.model" placeholder="deepseek-chat" />
            </el-form-item>
            <el-button type="primary" @click="saveSettings" style="width: 100%">保存</el-button>
          </el-form>
        </div>

        <!-- Messages Area -->
        <div v-else class="chat-content" ref="messagesRef">
          <div v-if="messages.length === 0" class="empty-state">
            <el-icon :size="48" color="#dcdfe6"><ChatLineRound /></el-icon>
            <p>你好！我是您的智能助手，有什么可以帮您？</p>
          </div>
          
          <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="msg.role">
            <div class="avatar">
              <el-icon v-if="msg.role === 'assistant'"><Service /></el-icon>
              <el-icon v-else><User /></el-icon>
            </div>
            <div class="bubble">
              <div v-if="msg.content" class="message-text">{{ msg.content }}</div>
              <div v-else class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input">
          <el-input
            v-model="input"
            type="textarea"
            :rows="2"
            placeholder="请输入问题..."
            resize="none"
            @keydown.enter.prevent="sendMessage"
          />
          <el-button type="primary" size="small" :loading="loading" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue';
import { ChatDotRound, Close, Service, User, Setting, Delete, ChatLineRound } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
// Simple markdown parser or just use pre-wrap for now. For better experience we might want markdown-it later.
// keeping it simple for now.

const visible = ref(false);
const showSettings = ref(false);
const input = ref('');
const loading = ref(false);
const messagesRef = ref<HTMLElement | null>(null);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const messages = ref<Message[]>([]);

const settings = reactive({
  apiKey: '',
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat'
});

// Load settings from localStorage
onMounted(() => {
  const savedSettings = localStorage.getItem('ai-assistant-settings');
  if (savedSettings) {
    Object.assign(settings, JSON.parse(savedSettings));
  }
});

const saveSettings = () => {
  localStorage.setItem('ai-assistant-settings', JSON.stringify(settings));
  showSettings.value = false;
  ElMessage.success('配置已保存');
};

const toggleChat = () => {
  visible.value = !visible.value;
  if (visible.value) {
    scrollToBottom();
  }
};

const clearMessages = () => {
  messages.value = [];
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return;

  if (!settings.apiKey) {
    ElMessage.warning('请先在设置中配置 API Key');
    showSettings.value = true;
    return;
  }

  const userMsg = input.value.trim();
  messages.value.push({ role: 'user', content: userMsg });
  input.value = '';
  loading.value = true;
  scrollToBottom();

  // Add a placeholder for assistant response
  messages.value.push({ role: 'assistant', content: '' });
  const currentMsgIndex = messages.value.length - 1;

  try {
    const response = await fetch(`${settings.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: messages.value.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        stream: false 
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || '抱歉，我没有理解您的意思。';
    if (messages.value[currentMsgIndex]) {
      messages.value[currentMsgIndex].content = reply;
    }
  } catch (error: any) {
    console.error('AI Request Error:', error);
    if (messages.value[currentMsgIndex]) {
      messages.value[currentMsgIndex].content = `请求失败: ${error.message}`;
    }
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};
</script>

<style lang="scss" scoped>
.ai-assistant {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 2100;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.floating-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #409EFF;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.5);
  }

  &.is-active {
    transform: rotate(90deg) scale(0);
    opacity: 0;
  }
}

.chat-window {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 380px;
  height: 600px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #EBEEF5;
  transform-origin: bottom right;
}

.chat-header {
  height: 56px;
  padding: 0 20px;
  background: linear-gradient(135deg, #409EFF, #79bbff);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 16px;
  }

  .header-right {
    display: flex;
    gap: 12px;
    
    .action-icon {
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 1;
      }
    }
  }
}

.chat-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f7fa;

  .empty-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #909399;
    text-align: center;
    gap: 16px;
    
    p {
      margin: 0;
      font-size: 14px;
    }
  }

  .message-item {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e6e8eb;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      color: #909399;
    }

    .bubble {
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      max-width: 80%;
      word-break: break-word;
    }

    .message-text {
      white-space: pre-wrap;
    }

    &.assistant {
      .avatar {
        background: #ecf5ff;
        color: #409EFF;
      }
      .bubble {
        background: #fff;
        color: #303133;
        border-top-left-radius: 2px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
    }

    &.user {
      flex-direction: row-reverse;
      
      .avatar {
        background: #f0f2f5;
        color: #606266;
      }
      .bubble {
        background: #409EFF;
        color: white;
        border-top-right-radius: 2px;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      }
    }
  }
}

.settings-panel {
  flex: 1;
  padding: 24px;
  background: #fff;
  
  h3 {
    margin: 0 0 20px;
    color: #303133;
  }
}

.chat-input {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #EBEEF5;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
  
  span {
    width: 6px;
    height: 6px;
    background: #909399;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>
