<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-center">🎯 目标管理</div>
      </q-card-section>

      <q-separator />

      <!-- 目标列表 -->
      <q-card-section>
        <q-list bordered separator>
          <!-- 半年目标 -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">📆 半年目标</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="(goal, index) in halfYearGoals" :key="'half-' + index">
            <q-item-section>
              <q-item-label>{{ goal.title }}</q-item-label>
              <q-linear-progress :value="goal.progress / 100" color="primary" />
              <q-item-label caption>{{ goal.progress }}% 已完成</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                color="blue"
                icon="edit"
                @click="editGoal('半年目标', index, goal.progress)"
              />
              <q-btn
                flat
                color="negative"
                icon="delete"
                @click="deleteGoal('半年目标', index)"
              />
            </q-item-section>
          </q-item>

          <!-- 年末目标 -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">🎯 年末目标</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="(goal, index) in endYearGoals" :key="'end-' + index">
            <q-item-section>
              <q-item-label>{{ goal.title }}</q-item-label>
              <q-linear-progress :value="goal.progress / 100" color="green" />
              <q-item-label caption>{{ goal.progress }}% 已完成</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                color="blue"
                icon="edit"
                @click="editGoal('年末目标', index, goal.progress)"
              />
              <q-btn
                flat
                color="negative"
                icon="delete"
                @click="deleteGoal('年末目标', index)"
              />
            </q-item-section>
          </q-item>

          <!-- 每月目标 -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">📅 每月目标</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="(goal, index) in monthlyGoals" :key="'month-' + index">
            <q-item-section>
              <q-item-label>{{ goal.title }}</q-item-label>
              <q-linear-progress :value="goal.progress / 100" color="orange" />
              <q-item-label caption>{{ goal.progress }}% 已完成</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                color="blue"
                icon="edit"
                @click="editGoal('每月目标', index, goal.progress)"
              />
              <q-btn
                flat
                color="negative"
                icon="delete"
                @click="deleteGoal('每月目标', index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- 添加目标 -->
      <q-separator />
      <q-card-section>
        <q-input v-model="newGoal" label="输入新目标" filled />
        <q-select
          v-model="goalCategory"
          :options="goalCategories"
          label="选择目标类别"
          filled
          class="q-mt-md"
        />
        <q-btn
          color="primary"
          class="q-mt-md"
          label="添加目标"
          @click="addGoal"
        />
      </q-card-section>
    </q-card>

    <!-- 目标更新对话框 -->
    <q-dialog v-model="updateDialog">
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">更新目标进度</div>
        </q-card-section>
        <q-card-section>
          <q-slider v-model="updatedProgress" :min="0" :max="100" label />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="取消" color="negative" v-close-popup />
          <q-btn label="更新" color="primary" @click="updateGoal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { GoalService } from "src/utils/firebaseUtils";

const $q = useQuasar();
const goalService = new GoalService();

// 目标数据
const halfYearGoals = ref([]);
const endYearGoals = ref([]);
const monthlyGoals = ref([]);

const goalMap = {
  半年目标: halfYearGoals,
  年末目标: endYearGoals,
  每月目标: monthlyGoals,
};

const newGoal = ref("");
const goalCategory = ref(null);
const goalCategories = ["半年目标", "年末目标", "每月目标"];
const updateDialog = ref(false);
const updatedProgress = ref(0);
const goalToUpdate = ref({ category: "", index: null });

// 读取目标数据
const fetchGoals = async () => {
  try {
    const data = await goalService.getAllGoals();
    halfYearGoals.value = data["半年目标"] || [];
    endYearGoals.value = data["年末目标"] || [];
    monthlyGoals.value = data["每月目标"] || [];
  } catch (error) {
    console.error("获取数据失败：", error);
  }
};

// 添加目标
const addGoal = async () => {
  if (!newGoal.value || !goalCategory.value) return;
  const goalObject = { title: newGoal.value, progress: 0 };

  try {
    await goalService.addGoal(goalCategory.value, goalObject);
    await fetchGoals(); // 重新获取数据
    newGoal.value = "";
    goalCategory.value = null;
    $q.notify({
      color: "positive",
      message: "目标添加成功！",
    });
  } catch (error) {
    console.error("添加目标失败：", error);
    $q.notify({
      color: "negative",
      message: "添加目标失败，请重试",
    });
  }
};

// 删除目标
const deleteGoal = async (category, index) => {
  try {
    if (!goalMap[category]) {
      console.error("删除目标失败：无效的目标类别");
      return;
    }

    const goalList = goalMap[category];
    const goalToRemove = goalList.value[index];

    await goalService.deleteGoal(category, goalToRemove);
    goalList.value.splice(index, 1);
    $q.notify({
      color: "positive",
      message: "目标删除成功！",
    });
  } catch (error) {
    console.error("删除目标失败：", error);
    $q.notify({
      color: "negative",
      message: "删除目标失败，请重试",
    });
  }
};

// 编辑目标
const editGoal = (category, index, progress) => {
  if (!goalMap[category]) {
    console.error("更新目标失败：无效的目标类别");
    return;
  }

  goalToUpdate.value = { category, index };
  updatedProgress.value = progress;
  updateDialog.value = true;
};

// 更新目标
const updateGoal = async () => {
  try {
    const { category, index } = goalToUpdate.value;
    const goalList = goalMap[category];
    const oldGoal = goalList.value[index];
    const updatedGoal = { ...oldGoal, progress: updatedProgress.value };

    await goalService.updateGoal(category, oldGoal, updatedGoal);
    goalList.value[index] = updatedGoal;
    updateDialog.value = false;
    $q.notify({
      color: "positive",
      message: "目标更新成功！",
    });
  } catch (error) {
    console.error("更新目标失败：", error);
    $q.notify({
      color: "negative",
      message: "更新目标失败，请重试",
    });
  }
};

onMounted(fetchGoals);
</script>
