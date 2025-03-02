<template>
    <div class="container">
      <div class="typing-container">
        <span v-for="(letter, index) in displayedText1" :key="index" class="letter">
          {{ letter }}
        </span>
        <span class="underline" v-if="isUnderlined1">_</span>
      </div>
      <div class="typing-container" v-if="isSecondLineVisible">
        <span v-for="(letter, index) in displayedText2" :key="index" class="letter">
          {{ letter }}
        </span>
        <span class="underline" v-if="isUnderlined2">_</span>
      </div>
      <n-button-group>
      <n-button v-if="showButton" type="primary" size="large" @click="enter" round>Enter</n-button>
      <n-button v-if="showButton" type="info" size="large" @click="login" round>Admin</n-button>
      </n-button-group>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  
  const fullText1 = 'Hello World';
  const fullText2 = 'Welcome To My Blog';
  const showButton = ref(false); // 初始时按钮不显示
  
  // 控制文字的显示
  const displayedText1 = ref('');
  const displayedText2 = ref('');
  const isUnderlined1 = ref(true);
  const isUnderlined2 = ref(true);
  const isSecondLineVisible = ref(false);
  
  // 转换文本中的空格为特殊字符（&nbsp;）
  const formatText = (text) => {
    return text.split('').map(char => (char === ' ' ? '\u00A0' : char)); 
  };
  
  onMounted(() => {
    let index1 = 0;
    const interval1 = setInterval(() => {
      displayedText1.value += formatText(fullText1)[index1];
      index1++;
      if (index1 === fullText1.length) {
        clearInterval(interval1);
        isUnderlined1.value = false;
        setTimeout(() => {
          isSecondLineVisible.value = true; 
          typeSecondLine(); 
        }, 500);
      }
    }, 50);
  
    const typeSecondLine = () => {
      let index2 = 0;
      const interval2 = setInterval(() => {
        displayedText2.value += formatText(fullText2)[index2];
        index2++;
        if (index2 === fullText2.length) {
          clearInterval(interval2);
          isUnderlined2.value = false;
          showButton.value = true; // 在第二行文字显示完成后显示按钮
        }
      }, 50);
    };
  });
  
  const login = () => {
    router.push("/login");
  };

  const enter = ()=>{
    router.push("/homepage");
  }
  </script>
  
  <style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(45deg, #ff7e5f, #feb47b, #8a2be2, #00bfff);
    background-size: 400% 400%;
    animation: gradient-animation 15s ease infinite;
    overflow: hidden;
  }
  
  .typing-container {
    font-size: 48px;
    font-family: 'Courier New', Courier, monospace;
    color: transparent;
    background-image: linear-gradient(to right, #ff7e5f, #feb47b);
    -webkit-background-clip: text;
    background-clip: text;
    position: relative;
    display: inline-flex;
    margin: 10px 0;
  }
  
  .letter {
    display: inline-block;
  }
  
  .underline {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 3px;
    background-color: white;
    animation: blink 0.7s infinite step-start;
  }
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  
  @keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  </style>
  