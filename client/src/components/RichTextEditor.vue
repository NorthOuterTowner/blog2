<template>
    <div>
        <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount,ref,shallowRef,onMounted, inject} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = {};
/**Picture Upload */
const server_url = inject("server_url");
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF={};
editorConfig.MENU_CONF['uploadImage'] = {
  base64LimitSize:10*1024,//10kb
  server: server_url+'/upload/rich_editor_upload',
}
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc:(src)=>{
    if(src.indexOf("http")!==0){
      return `${server_url}${src}`;
    }
    return src;
  }
}
const mode = ref("default");

const valueHtml = ref("");

const props = defineProps({
    modelValue:{
        type:String,
        default:"",
    }
})

const emit = defineEmits(["update:model-value"]);
let initFinishied = false;
onMounted(()=>{
  setTimeout(()=>{
    valueHtml.value = props.modelValue;
    initFinishied = true;
  },10);
})

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;

      editor.destroy();
    });

    // 编辑器回调函数
    const handleCreated = (editor) => {
      console.log('created', editor);
      editorRef.value = editor; // 记录 editor 实例，重要！
    };

    const handleChange = (editor)=>{
      if(initFinishied){
        emit("update:model-value",valueHtml.value);
      }
    }

</script>

<style lang="scss" scoped>

</style>