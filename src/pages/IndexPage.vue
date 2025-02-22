<template>
  <q-page class="flex justify-center">
    <div class="column items-center q-pa-md">
      <!-- 任务展示区 -->
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
    </div>
  </q-page>
</template>

<script setup>

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { getDocs, getDoc, deleteDoc, doc, addDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection } from "firebase/firestore";
import { db } from 'src/router/firebase.js';
const router = useRouter();
const $q = useQuasar();
const password = ref("");
const email = ref("");
const todayTask = ref(null);
const showDailyChore = async () => {
  try {
    const docRef = doc(db, "chores", "dailychore"); // ✅ 确保 `doc()` 正确导入
    const docSnap = await getDoc(docRef); // ✅ 正确获取文档数据

    if (docSnap.exists()) {
      console.log("文档 dailychore 存在！");
      todayTask.value = docSnap.data(); // ✅ 直接存入 `todayTask`
    } else {
      console.log("文档 dailychore 不存在！");
      todayTask.value = null;
    }
  } catch (error) {
    console.error("获取任务失败", error);
  }
};
// 页面加载时获取一个随机任务
showDailyChore();
// 任务列表（示例数据）
const tasks = ref([
  { name: "扫地", date: "2025-02-21" },
  { name: "洗衣服", date: "2025-02-22" },
  { name: "买菜ssssssssssss", date: "2025-02-23" }
]);
</script>
