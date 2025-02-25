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
  const docRef = doc(db, "chores", "updateInformation");
  setDoc(docRef, { date: currentDate.value,isUpdated: false });
};

// 获取今天的家务任务
const showDailyChore = async () => {
  try {
    const docRef = doc(db, "chores", "dailychore");
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


// 页面加载时获取任务
onMounted(() => {
  updateCurrentDate(); // 更新当前日期
  showDailyChore(); // 获取今天的家务任务
});

</script>
