<template>
  <q-page class="flex justify-center">
    <div class="column items-center q-pa-md">
      <!-- 当前日期 -->
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6 text-center">
            📅 今天是：{{ currentDate }}
          </div>
        </q-card-section>
      </q-card>

      <!-- 任务展示区 -->
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6">今天的家务任务</div>
        </q-card-section>

        <q-card-section v-if="todayTask">
          <div class="text-subtitle2">任务日期: {{ todayTask.date }}</div>
          <div class="text-h5 text-center">{{ todayTask.task }}</div>
        </q-card-section>

        <q-card-section v-else>
          <div class="text-center text-grey">今天没有家务任务</div>
        </q-card-section>
      </q-card>

      <!-- 重新选取任务按钮 -->
      <q-btn class="q-mt-md" color="primary" label="重新选择任务" @click="pickDailyChore" />
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "src/router/firebase.js";

const todayTask = ref(null);
const currentDate = ref(""); // 存储当前日期

// 获取当前日期（格式 YYYY-MM-DD）
const updateCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 补零
  const day = String(now.getDate()).padStart(2, "0"); // 补零
  currentDate.value = `${year}-${month}-${day}`;
};
// 选取并存储今日任务
const pickDailyChore = async () => {
  try {
    // 1️⃣ 先检查 `dailychore` 文档是否已有任务
    const dailyChoreRef = doc(db, "chores", "dailychore");
    const dailyChoreSnap = await getDoc(dailyChoreRef);

    if (dailyChoreSnap.exists()) {
      todayTask.value = dailyChoreSnap.data(); // 直接使用已有任务
      console.log("今日任务已存在:", todayTask.value);
      return;
    }

    // 2️⃣ 获取 `unfinishedchores` 文档
    const taskRef = doc(db, "chores", "unfinishedchores");
    const docSnap = await getDoc(taskRef);

    if (!docSnap.exists()) {
      console.warn("未找到 `unfinishedchores` 文档");
      return;
    }

    // 3️⃣ 读取任务列表
    const data = docSnap.data();
    console.log("Firestore 数据:", data);

    // 确保 `taskList` 是数组
    const tasks = Array.isArray(data.taskList) ? data.taskList : [];

    if (tasks.length === 0) {
      console.warn("任务列表为空，无法选择任务");
      return;
    }

    // 4️⃣ 生成随机任务
    const randomIndex = Math.floor(Math.random() * tasks.length);
    const randomTask = tasks[randomIndex];

    console.log("随机任务:", randomTask);

    // 5️⃣ 存入 `dailychore` 文档（覆盖现有数据）
    await setDoc(dailyChoreRef, randomTask);

    // 6️⃣ 更新前端数据
    todayTask.value = randomTask;

    console.log("随机任务已存入 `dailychore` 文档");
  } catch (error) {
    console.error("获取或存储任务失败:", error);
  }
};

// 页面加载时获取任务
onMounted(() => {
  updateCurrentDate(); // 更新当前日期
  pickDailyChore(); // 获取任务
});

</script>
