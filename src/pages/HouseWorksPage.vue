<template>
  <q-page class="flex justify-center">
    <!-- 显示今天的家务任务 -->
    <div class="column items-center q-pa-md">
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6">今天的家务任务</div>
        </q-card-section>

        <q-card-section v-if="todayTask">
          <div class="text-subtitle2">任务于: {{ todayTask.date }} !</div>
          <div class="text-h5 text-center">{{ todayTask.task }}</div>

        </q-card-section>

        <q-card-section v-else>
          <div class="text-center text-grey">今天没有家务任务</div>
        </q-card-section>
      </q-card>

    <!-- 添加新家务任务 -->
    <q-card class="q-pa-md q-mt-md">
      <q-card-section>
        <div class="text-h6">添加新家务任务</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitTask">
          <q-input v-model="newTask" label="任务内容" filled class="q-mb-md" />
          <q-input v-model="selectedDate" label="选择日期" type="date" filled class="q-mb-md" />
          <q-btn type="submit" label="提交" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>
    <!-- 未完成任务列表 -->
    <q-card class="q-pa-md q-mt-md">
  <q-card-section>
    <div class="text-h6">未完成任务列表</div>
  </q-card-section>

  <q-card-section v-if="tasks.length > 0">
    <q-list bordered>
      <q-item v-for="(task, index) in tasks" :key="index">
        <q-item-section>
          <div class="text-subtitle1">{{ task.task }}</div>
          <div class="text-caption text-grey">日期: {{ task.date }}</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>

  <q-card-section v-else>
    <div class="text-center text-grey">没有未完成的任务</div>
  </q-card-section>
</q-card>
  </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from 'src/router/firebase.js';
import { collection, getDocs,getDoc, deleteDoc, doc,addDoc,setDoc, updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const newTask = ref("");
const selectedDate = ref("");
const todayTask = ref(null);
const tasks = ref([]);
// 获取今天的家务任务
const showDailyChore = async () => {
  try {
    const docRef = doc(db, "chores", "dailychore"); // ✅ 访问 `chores` 集合下的 `dailychore` 文档
    const docSnap = await getDoc(docRef); // ✅ 使用 `getDoc()` 获取文档数据

    if (docSnap.exists()) {
      todayTask.value = docSnap.data();
    } else {
      console.log("文档 dailychore 不存在！");
      todayTask.value = null;
    }
  } catch (error) {
    console.error("获取任务失败", error);
  }
};
// 页面加载时获取一个随机任务

onMounted(() => {
  getTasks();
  showDailyChore();
});


// 提交任务
const submitTask = async () => {
  if (!newTask.value || !selectedDate.value) {
    alert("请填写任务内容和日期");
    return;
  }

  try{
    const taskRef = doc(db, "chores", "unfinishedchores");
    // await setDoc(taskRef, { taskList: [] });
    await updateDoc(taskRef, {
      taskList: arrayUnion({
        task: newTask.value,
        date: selectedDate.value,
      }),
    });
    $q.notify({
      color: 'positive',
      position: 'top',
      message: newTask.value+'->  Added successfully!',
    });
    newTask.value = "";
    selectedDate.value = "";
  } catch (error) {
    console.error("Error adding document: ", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Error: ${error.message}`,
    });
  }
};

// 获取未完成任务列表
  const getTasks = async () => {
  try {
    const taskRef = doc(db, "chores", "unfinishedchores"); // ✅ 获取文档引用
    const docSnap = await getDoc(taskRef); // ✅ 获取文档数据

    if (docSnap.exists()) {

      tasks.value = docSnap.data().taskList || []; // ✅ 读取 `taskList`，如果为空，赋值为 `[]`
      console.log("tasks", tasks.value);
    } else {
      console.log("文档 unfinishedchores 不存在！");
      tasks.value = [];
    }
  } catch (error) {
    console.error("获取任务失败", error);
  }
};


  // 清空输入框
  newTask.vasue = "";
  selectedDate.value = "";




</script>
