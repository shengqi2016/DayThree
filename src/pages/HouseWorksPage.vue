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
const showDailyChore = async () => {
  try {
    const docRef = doc(db, "chores", "dailychore"); // ✅ 访问 `chores` 集合下的 `dailychore` 文档
    const docSnap = await getDoc(docRef); // ✅ 使用 `getDoc()` 获取文档数据

    if (docSnap.exists()) {
      console.log("文档 dailychore 存在！");
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
showDailyChore();
const submitTask = async () => {
  if (!newTask.value || !selectedDate.value) {
    alert("请填写任务内容和日期");
    return;
  }

  try{
    const taskRef = doc(db, "chores", "Unfinishedchroes");
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
  } catch (error) {
    console.error("Error adding document: ", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Error: ${error.message}`,
    });
  }


};
  // 清空输入框
  newTask.vasue = "";
  selectedDate.value = "";



// onMounted(() => {
//   showDailyChore();
// });
</script>
