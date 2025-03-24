<template>
  <q-page class="flex justify-center">
    <div class="flex flex-center q-pa-md">
      <div class="row q-gutter-md">
        <!-- 午餐记录 -->
        <q-card>
          <q-card-section>
            <div class="text-h6">今日午餐</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="lunchMenu"
              label="午餐菜单"
              filled
              type="textarea"
              class="q-mb-md"
            />
            <q-btn
              color="primary"
              label="保存午餐"
              @click="saveLunch"
            />
          </q-card-section>
          <q-card-section v-if="todayLunch">
            <div class="text-subtitle2">已记录的午餐：</div>
            <div class="text-body1">{{ todayLunch.menu }}</div>
            <div class="text-caption text-grey">记录时间：{{ todayLunch.timestamp }}</div>
          </q-card-section>
        </q-card>

        <!-- 晚餐记录 -->
        <q-card>
          <q-card-section>
            <div class="text-h6">今日晚餐</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="dinnerMenu"
              label="晚餐菜单"
              filled
              type="textarea"
              class="q-mb-md"
            />
            <q-btn
              color="primary"
              label="保存晚餐"
              @click="saveDinner"
            />
          </q-card-section>
          <q-card-section v-if="todayDinner">
            <div class="text-subtitle2">已记录的晚餐：</div>
            <div class="text-body1">{{ todayDinner.menu }}</div>
            <div class="text-caption text-grey">记录时间：{{ todayDinner.timestamp }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { MenuService } from "src/utils/firebaseUtils";

const $q = useQuasar();
const menuService = new MenuService();
const lunchMenu = ref("");
const dinnerMenu = ref("");
const todayLunch = ref(null);
const todayDinner = ref(null);

// 保存午餐
const saveLunch = async () => {
  if (!lunchMenu.value.trim()) {
    $q.notify({
      color: "negative",
      message: "请输入午餐菜单",
    });
    return;
  }

  try {
    todayLunch.value = await menuService.saveMenu('lunch', lunchMenu.value);
    lunchMenu.value = "";
    $q.notify({
      color: "positive",
      message: "午餐菜单保存成功！",
    });
  } catch (error) {
    console.error("保存午餐菜单失败:", error);
    $q.notify({
      color: "negative",
      message: "保存失败，请重试",
    });
  }
};

// 保存晚餐
const saveDinner = async () => {
  if (!dinnerMenu.value.trim()) {
    $q.notify({
      color: "negative",
      message: "请输入晚餐菜单",
    });
    return;
  }

  try {
    todayDinner.value = await menuService.saveMenu('dinner', dinnerMenu.value);
    dinnerMenu.value = "";
    $q.notify({
      color: "positive",
      message: "晚餐菜单保存成功！",
    });
  } catch (error) {
    console.error("保存晚餐菜单失败:", error);
    $q.notify({
      color: "negative",
      message: "保存失败，请重试",
    });
  }
};

// 加载今日菜单
const loadTodayMenus = async () => {
  try {
    const menus = await menuService.getTodayMenus();
    todayLunch.value = menus.lunch;
    todayDinner.value = menus.dinner;
  } catch (error) {
    console.error("加载菜单失败:", error);
  }
};

onMounted(() => {
  loadTodayMenus();
});
</script>

<style>
.q-card {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
</style>
