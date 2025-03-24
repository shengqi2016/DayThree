<template>
  <q-page class="flex justify-center">
    <!-- <div class="text-center q-pt-lg q-pb-md">
      <div class="text-h3">我的健康管理</div>
    </div> -->
    <div class="flex flex-center q-pa-md">
      <div class="row q-gutter-xl">
        <q-card>
          <!-- TDEE 计算 -->
          <q-card-section v-if="tdeeHave">
            <q-card-section>
              <div class="text-h6">你的TDEE 是 {{ tdee }} cal</div>
            </q-card-section>
            <q-btn
              label="重置"
              color="primary"
              class="q-mt-md"
              @click="(tdeeHave = false), (tdee = 0)"
            />
          </q-card-section>

          <q-card-section v-else>
            <q-input
              v-model.number="weight"
              label="体重 (kg)"
              type="number"
              filled
            />
            <q-option-group
              v-model="gender"
              :options="[
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
              ]"
              color="primary"
              inline
              class="q-mb-md"
            />
            <q-input
              v-model.number="height"
              label="身高 (cm)"
              type="number"
              filled
              class="q-mt-md"
            />
            <q-input
              v-model.number="age"
              label="年龄"
              type="number"
              filled
              class="q-mt-md"
            />
            <q-select
              v-model="activityLevel"
              :options="activityOptions"
              label="活动水平"
              filled
              class="q-mt-md"
            />
            <q-btn
              label="计算 TDEE"
              color="primary"
              class="q-mt-md"
              @click="calculateTDEE"
            />
            <q-btn
              v-if="tdee"
              label="覆盖旧记录"
              color="primary"
              class="q-mt-md"
              @click="UpdateTdee(tdee, currentUser)"
            />

            <div v-if="tdee" class="q-mt-md">TDEE: {{ tdee }} kcal</div>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <div class="text-h6">记录卡路里</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="manualBarcode"
              label="手动输入条形码"
              filled
              class="q-mt-md"
            />
            <q-btn
              color="primary"
              label="查询"
              @click="getFoodInsfo(manualBarcode)"
              class="q-mt-md"
            />
            <!-- 拍照上传按钮 -->
            <q-btn
              color="secondary"
              label="拍照上传"
              @click="openFilePicker"
              class="q-mt-md"
            />
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleFileUpload"
            />
          </q-card-section>
        </q-card>

        <!-- 食品信息展示 -->
        <q-card v-if="foodInfo" class="q-mt-md">
          <q-card-section>
            <div class="text-h6">{{ foodInfo.name }}</div>
          </q-card-section>
          <q-card-section>
            <p><strong>卡路里:</strong> {{ foodInfo.calories }} kcal</p>
            <p><strong>数量:</strong> {{ foodInfo.size }}</p>
            <p><strong>蛋白质:</strong> {{ foodInfo.proteins }} g</p>
            <p><strong>碳水化合物:</strong> {{ foodInfo.carbs }} g</p>
            <p><strong>脂肪:</strong> {{ foodInfo.fats }} g</p>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn
              color="positive"
              label="记录卡路里"
              @click="recordCalories"
            />
          </q-card-actions>
        </q-card>

        <!-- 今日摄入记录 -->
        <q-card class="q-pa-md q-mt-md">
          <q-card-section>
            <div class="text-h6">今日摄入</div>
          </q-card-section>

          <q-card-section v-if="calorieLog.length > 0">
            <q-list bordered>
              <q-item v-for="(item, index) in calorieLog" :key="index">
                <q-item-section>
                  <div class="text-subtitle1">{{ item.name }}</div>
                  <div class="text-caption text-grey">
                    卡路里: {{ item.calories }} kcal
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section v-else>
            <div class="text-center text-grey">还没有记录任何食品</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import heic2any from "heic2any";
import { LocalStorage, useQuasar } from "quasar";
import { db } from '../router/firebase'
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
const gender = ref("male");
const weight = ref(null);
const height = ref(null);
const age = ref(null);
const activityLevel = ref("");
const tdee = ref(0);
const $q = useQuasar();
const tdeeHave = ref(null);
const manualBarcode = ref("");
const foodInfo = ref(null);
const currentUser = ref(localStorage.getItem("UID"));
const getCurrentUTCDate = () => {
  const date = new Date(); // 获取当前时间

  const year = date.getUTCFullYear(); // 获取 UTC 年份
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // 获取 UTC 月份
  const day = String(date.getUTCDate()).padStart(2, "0"); // 获取 UTC 日期

  // 返回格式化的日期字符串
  return `${year}-${month}-${day}`;
};
const activityOptions = [
  "久坐",
  "轻度活动",
  "中度活动",
  "重度活动",
  "非常重度活动",
];
const calorieLog = ref([]);
const fileInput = ref(null); // 文件输入框的引用
let codeReader = null; // ZXing 解码器实例

// 组件挂载时初始化
onMounted(() => {
  loadCalorieLog();
  getBasictdee();
});
// 打开文件选择器
const calculateTDEE = () => {
  if (!weight.value || !height.value || !age.value || !activityLevel.value) {
    $q.notify({ type: "negative", message: "请填写所有数据" });
    return;
  }

  const bmr =
    gender.value === "male"
      ? 10 * weight.value + 6.25 * height.value - 5 * age.value + 5
      : 10 * weight.value + 6.25 * height.value - 5 * age.value - 161;

  const activityMultipliers = {
    久坐: 1.2,
    轻度活动: 1.375,
    中度活动: 1.55,
    重度活动: 1.725,
    非常重度活动: 1.9,
  };

  tdee.value = Math.round(bmr * activityMultipliers[activityLevel.value]);
};

const openFilePicker = () => {
  fileInput.value.click(); // 触发文件选择
};

const getBasictdee = async () => {
  try {
    const docRef = doc(db, "caltracking", currentUser.value); // 获取文档引用
    const docSnap = await getDoc(docRef); // 获取文档快照
    if (!docSnap.exists()) {
      await setDoc(docRef, { dailytdee: [tdeeBasic] }); // 初始化文档
      console.log("文档不存在，已创建并初始化 dailytdee 字段。");
      tdeeHave.value = false;
    } else {
      const dailyTdee = docSnap.data().dailytdee[0].tdee || [];
      tdee.value = dailyTdee;
      tdeeHave.value = true;
    }
  } catch (error) {
    console.error("操作失败：", error);
  }
};

const UpdateTdee = async (tdee, currentUser) => {
  const date = getCurrentUTCDate(); // 获取当前日期
  if (!tdee) return; // 如果 tdee 为空，直接返回

  const tdeeBasic = { tdee: tdee, modified_date: date }; // 创建要添加的对象

  try {
    const docRef = doc(db, "caltracking", currentUser); // 获取文档引用
    const docSnap = await getDoc(docRef); // 获取文档快照

    // 如果文档不存在，创建文档并初始化 dailytdee 字段
    if (!docSnap.exists()) {
      await setDoc(docRef, { dailytdee: [tdeeBasic] }); // 初始化文档
      console.log("文档不存在，已创建并初始化 dailytdee 字段。");
    } else {
      // 清空数组
      await updateDoc(docRef, { dailytdee: [] }); // 清空数组
      console.log("dailytdee 已清空。");

      // 添加新的 tdeeBasic 到 dailytdee
      await updateDoc(docRef, { dailytdee: arrayUnion(tdeeBasic) });
      console.log("新的 tdeeBasic 已添加到 dailytdee。");
      window.location.reload();
    }
  } catch (error) {
    console.error("操作失败：", error);
  }
};

// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    let imageFile = file;

    // 如果是 HEIC 图片，转换为 JPEG
    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8, // 图片质量（0 到 1）
      });
      imageFile = new File([convertedBlob], "converted.jpg", {
        type: "image/jpeg",
      });
    }

    // 读取图片并解码
    const reader = new FileReader();
    reader.onload = (e) => {
      analyzeImage(e.target.result); // 分析图片中的条形码
    };
    reader.readAsDataURL(imageFile);
  } catch (error) {
    console.error("图片处理失败:", error);
    $q.notify({
      color: "negative",
      message: "图片处理失败，请上传清晰的图片",
      timeout: 3000,
    });
  }
};

// 获取食品信息
const getFoodInfo = async (barcode) => {
  if (!barcode) {
    alert("请输入或扫描条形码");
    return;
  }
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();
    if (data.status === 1) {
      foodInfo.value = {
        name: data.product.product_name || "未知食品",
        size: data.product.serving_size || "未知",
        calories: data.product.nutriments["energy-kcal"] || "未知",
        proteins: data.product.nutriments.proteins || "未知",
        carbs: data.product.nutriments.carbohydrates || "未知",
        fats: data.product.nutriments.fat || "未知",
      };
    } else {
      $q.notify({ color: "negative", position: "top", message: "食品未找到" });
    }
  } catch (error) {
    console.error("查询失败:", error);
    $q.notify({ color: "negative", position: "top", message: "查询失败" });
  }
};

// 记录卡路里
const recordCalories = async () => {
  if (!foodInfo.value) return;

  const newRecord = {
    name: foodInfo.value.name,
    calories: foodInfo.value.calories,
  };

  try {
    const logRef = doc(db, "calories", "today");
    await updateDoc(logRef, {
      log: arrayUnion(newRecord),
    });

    calorieLog.value.push(newRecord);
    $q.notify({ color: "positive", position: "top", message: "已记录卡路里!" });
  } catch (error) {
    console.error("记录失败:", error);
    $q.notify({ color: "negative", position: "top", message: "记录失败" });
  }
};

// 加载今日摄入记录
const loadCalorieLog = async () => {
  try {
    const logRef = doc(db, "calories", "today");
    const logSnap = await getDoc(logRef);
    if (logSnap.exists()) {
      calorieLog.value = logSnap.data().log || [];
    } else {
      calorieLog.value = [];
    }
  } catch (error) {
    console.error("获取摄入记录失败", error);
  }
};

// 组件卸载时清理资源
onUnmounted(() => {
  if (codeReader) {
    codeReader.reset(); // 停止摄像头扫描
  }
});
</script>
