<template>
  <q-page class="flex justify-center">
    <!-- 显示今天的家务任务 -->
    <div class="flex flex-center q-pa-md">
      <div class="row q-gutter-md">
        <q-card>
          <q-card-section>
            <div class="text-h6">今天的家务任务</div>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn color="primary" label="完成任务" @click="completeTask" />
          </q-card-actions>

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
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { ChoreService } from "src/utils/firebaseUtils";

const $q = useQuasar();
const choreService = new ChoreService();
const newTask = ref("");
const selectedDate = ref("");
const todayTask = ref(null);
const tasks = ref([]);

// 完成任务
const completeTask = async () => {
  try {
    await choreService.completeChore(todayTask.value);
    await choreService.setDailyChore(null);
    pickDailyChore();
    $q.notify({
      color: 'positive',
      position: 'top',
      message: todayTask.value.task + ' -> 已完成!',
    });
    todayTask.value = null;
    window.location.reload();
  } catch (error) {
    console.error("完成任务失败:", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: '没有任务喽 你要添加新的任务',
    });
  }
};

// 选取并存储今日任务
const pickDailyChore = async () => {
  try {
    const dailyChore = await choreService.getDailyChore();
    if (dailyChore) {
      todayTask.value = dailyChore;
      return;
    }

    const unfinishedChores = await choreService.getUnfinishedChores();
    if (unfinishedChores.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * unfinishedChores.length);
    const randomTask = unfinishedChores[randomIndex];
    await choreService.setDailyChore(randomTask);
    todayTask.value = randomTask;
  } catch (error) {
    console.error("获取或存储任务失败:", error);
  }
};

// 提交任务
const submitTask = async () => {
  if (!newTask.value || !selectedDate.value) {
    $q.notify({
      color: 'negative',
      message: "请填写任务内容和日期",
    });
    return;
  }

  try {
    await choreService.addChore(newTask.value, selectedDate.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: newTask.value + ' -> 添加成功!',
    });
    newTask.value = "";
    selectedDate.value = "";
    window.location.reload();
  } catch (error) {
    console.error("添加任务失败:", error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `添加失败: ${error.message}`,
    });
  }
};

// 获取未完成任务列表
const getFullTasks = async () => {
  try {
    tasks.value = await choreService.getUnfinishedChores();
  } catch (error) {
    console.error("获取任务失败", error);
  }
};

onMounted(() => {
  pickDailyChore();
  getFullTasks();
});
</script>
