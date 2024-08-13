<template>
  <q-page class="q-pa-md">
    <!-- Push Workouts Table -->
    <q-separator />
    <q-card-section>
      <q-table
        title="推"
        :rows="pushRows"
        :columns="pushColumns"
        row-key="id"
      >
        <!-- 插槽名称与列的 `field` 保持一致 -->
        <template v-slot:body-cell-pushActions="props">
          <q-td :props="props">
            <q-btn
              color="red"
              icon="delete"
              flat
              @click="deleteRecord('pushWorkouts', props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Pull Workouts Table -->
    <q-separator />
    <q-card-section>
      <q-table
        title="拉"
        :rows="pullRows"
        :columns="pullColumns"
        row-key="id"
      >
        <template v-slot:body-cell-pullActions="props">
          <q-td :props="props">
            <q-btn
              color="red"
              icon="delete"
              flat
              @click="deleteRecord('pullWorkouts', props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Squat Workouts Table -->
    <q-separator />
    <q-card-section>
      <q-table
        title="蹲"
        :rows="squatRows"
        :columns="squatColumns"
        row-key="id"
      >
        <template v-slot:body-cell-squatActions="props">
          <q-td :props="props">
            <q-btn
              color="red"
              icon="delete"
              flat
              @click="deleteRecord('squatWorkouts', props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-separator />
    <q-card-section class="q-pa-md flex flex-center">
      <q-btn color="amber" label="添加新记录" @click="addnewrecord" />
    </q-card-section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from 'src/router/firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
// 通用的删除记录函数
const deleteRecord = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log('记录删除成功');
    fetchAllData(); // 删除后刷新数据
  } catch (error) {
    console.error(`删除记录时出错: ${error.message}`);
  }
};

// 拉训练数据

const pullRows = ref([]);
const pullColumns = [
  { name: 'date', required: true, label: '日期', align: 'left', field: 'date', sortable: true },
  { name: 'seatedRowsTimes', align: 'center', label: '坐姿划船次数', field: 'seatedRowsTimes', sortable: true },
  { name: 'seatedRowsWeight', align: 'center', label: '坐姿划船重量', field: 'seatedRowsWeight', sortable: true },
  { name: 'highPullDownTimes', align: 'center', label: '高位下拉次数', field: 'highPullDownTimes', sortable: true },
  { name: 'highPullDownWeight', align: 'center', label: '高位下拉重量', field: 'highPullDownWeight', sortable: true },
  { name: 'vBarPullDownTimes', align: 'center', label: 'V杆下拉次数', field: 'vBarPullDownTimes', sortable: true },
  { name: 'vBarPullDownWeight', align: 'center', label: 'V杆下拉重量', field: 'vBarPullDownWeight', sortable: true },
  { name: 'romanianDeadliftTimes', align: 'center', label: '罗马尼亚硬拉次数', field: 'romanianDeadliftTimes', sortable: true },
  { name: 'romanianDeadliftWeight', align: 'center', label: '罗马尼亚硬拉重量', field: 'romanianDeadliftWeight', sortable: true },
  { name: 'backExtensionsTimes', align: 'center', label: '背部伸展次数', field: 'backExtensionsTimes', sortable: true },
  { name: 'pullActions', label: '操作', align: 'center', field: 'pullActions', sortable: false }
];

const fetchPullData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pullWorkouts'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    pullRows.value = data;
  } catch (error) {
    console.error("获取拉训练数据时出错: ", error);
  }
};

// 推训练数据
const pushRows = ref([]);
const pushColumns = [
  { name: 'date', required: true, label: '日期', align: 'left', field: 'date', sortable: true },
  { name: 'benchPressTimes', align: 'center', label: '卧推次数', field: 'benchPressTimes', sortable: true },
  { name: 'benchPressWeight', align: 'center', label: '卧推重量', field: 'benchPressWeight', sortable: true },
  { name: 'seatedPressTimes', align: 'center', label: '坐姿推举次数', field: 'seatedPressTimes', sortable: true },
  { name: 'seatedPressWeight', align: 'center', label: '坐姿推举重量', field: 'seatedPressWeight', sortable: true },
  { name: 'frontRaiseTimes', align: 'center', label: '前平举次数', field: 'frontRaiseTimes', sortable: true },
  { name: 'frontRaiseWeight', align: 'center', label: '前平举重量', field: 'frontRaiseWeight', sortable: true },
  { name: 'chestFlyTimes', align: 'center', label: '飞鸟次数', field: 'chestFlyTimes', sortable: true },
  { name: 'chestFlyWeight', align: 'center', label: '飞鸟重量', field: 'chestFlyWeight', sortable: true },
  { name: 'straightArmPulldownTimes', align: 'center', label: '直臂下压次数', field: 'straightArmPulldownTimes', sortable: true },
  { name: 'straightArmPulldownWeight', align: 'center', label: '直臂下压重量', field: 'straightArmPulldownWeight', sortable: true },
  { name: 'alternatingShoulderTapTimes', align: 'center', label: '交替肩触次数', field: 'alternatingShoulderTapTimes', sortable: true },
  { name: 'pushActions', label: '操作', align: 'center', field: 'pushActions', sortable: false }
];

const fetchPushData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pushWorkouts'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    pushRows.value = data;
  } catch (error) {
    console.error("获取推训练数据时出错: ", error);
  }
};

// 蹲训练数据
const squatRows = ref([]);
const squatColumns = [
  { name: 'date', required: true, label: '日期', align: 'left', field: 'date', sortable: true },
  { name: 'singleLegDeadliftTimes', align: 'center', label: '单腿硬拉次数', field: 'singleLegDeadliftTimes', sortable: true },
  { name: 'barbellSquatTimes', align: 'center', label: '杠铃深蹲次数', field: 'barbellSquatTimes', sortable: true },
  { name: 'barbellSquatWeight', align: 'center', label: '杠铃深蹲重量', field: 'barbellSquatWeight', sortable: true },
  { name: 'lungeTimes', align: 'center', label: '弓步次数', field: 'lungeTimes', sortable: true },
  { name: 'gobletSquatTimes', align: 'center', label: '高脚杯深蹲次数', field: 'gobletSquatTimes', sortable: true },
  { name: 'gobletSquatWeight', align: 'center', label: '高脚杯深蹲重量', field: 'gobletSquatWeight', sortable: true },
  { name: 'wallSitTime', align: 'center', label: '靠墙静蹲时间', field: 'wallSitTime', sortable: true },
  { name: 'wallSitTimes', align: 'center', label: '靠墙静蹲次数', field: 'wallSitTimes', sortable: true },
  { name: 'squatActions', label: '操作', align: 'center', field: 'squatActions', sortable: false }
];

const fetchSquatData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'squatWorkouts'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    squatRows.value = data;
  } catch (error) {
    console.error("获取蹲训练数据时出错: ", error);
  }
};

// 新增记录的路由跳转
function addnewrecord() {
  router.push({ path: '/nrp' });
}

// 页面挂载时获取数据
const fetchAllData = () => {
  fetchPullData();
  fetchPushData();
  fetchSquatData();
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.q-page {
  max-width: 800px;
  margin: auto;
}
.q-card {
  margin-bottom: 20px;
}
</style>
