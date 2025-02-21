<template>
  <q-page class="q-pa-md">
    <!-- 显示今天的家务任务 -->
    <q-card class="q-pa-md" v-if="todayTask">
      <q-card-section>
        <div class="text-h6">今天的家务任务：</div>
        <div class="text-h5 q-mt-md">{{ todayTask.task }}</div>
        <div class="text-subtitle2">任务日期: {{ todayTask.date }}</div>
      </q-card-section>
    </q-card>

    <q-card v-else class="q-pa-md">
      <q-card-section>
        <div class="text-h6">今天没有家务任务！</div>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db, collection, addDoc, getDocs, query, where } from "firebase/firestore"; // 导入 Firebase 配置

const newTask = ref("");
const selectedDate = ref("");
const todayTask = ref(null);

const fetchRandomTask = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // 获取今天的日期
    const tasksCollection = collection(db, "chores");
    const q = query(tasksCollection, where("date", "==", today)); // 过滤出今天的任务
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (tasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * tasks.length);
      todayTask.value = tasks[randomIndex];
    }
  } catch (error) {
    console.error("获取任务失败", error);
  }
};

const submitTask = async () => {
  if (!newTask.value || !selectedDate.value) {
    alert("请填写任务内容和日期");
    return;
  }

  try {
    const tasksCollection = collection(db, "chores");
    await addDoc(tasksCollection, {
      task: newTask.value,
      date: selectedDate.value
    });

    newTask.value = "";
    selectedDate.value = "";
    fetchRandomTask(); // 重新加载今天的任务
    alert("任务已添加！");
  } catch (error) {
    console.error("添加任务失败", error);
  }
};

onMounted(() => {
  fetchRandomTask();
});
</script>
