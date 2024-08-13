<template>
  <q-page-container>
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="Pull" label="拉" />
        <q-tab name="Push" label="推" />
        <q-tab name="Squat" label="蹲" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Pull">
          <br />
          <div class="text-h6">拉训练</div>
          <q-form @submit.prevent="submitPullForm" @reset="resetPullForm" class="q-gutter-md">
            <q-input v-model="pullForm.date" label="日期" type="date" filled required />
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.seatedRowsTimes" label="坐姿划船次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.seatedRowsWeight" label="坐姿划船重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.highPullDownTimes" label="高位下拉次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.highPullDownWeight" label="高位下拉重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.vBarPullDownTimes" label="V型杆下拉次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.vBarPullDownWeight" label="V型杆下拉重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.romanianDeadliftTimes" label="罗马尼亚硬拉次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.romanianDeadliftWeight" label="罗马尼亚硬拉重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.backExtensionsTimes" label="背部伸展次数" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-btn push color="primary" label="提交" type="submit" />
              </div>
              <div class="col-6">
                <q-btn push color="primary" label="重置" type="reset" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="Push">
          <br />
          <div class="text-h6">推训练</div>
          <q-form @submit.prevent="submitPushForm" @reset="resetPushForm" class="q-gutter-md">
            <q-input v-model="pushForm.date" label="日期" type="date" filled required />
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.benchPressTimes" label="卧推次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.benchPressWeight" label="卧推重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.seatedPressTimes" label="坐姿推举次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.seatedPressWeight" label="坐姿推举重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.frontRaiseTimes" label="前平举次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.frontRaiseWeight" label="前平举重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.chestFlyTimes" label="飞鸟次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.chestFlyWeight" label="飞鸟重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.straightArmPulldownTimes" label="直臂下拉次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.straightArmPulldownWeight" label="直臂下拉重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.alternatingShoulderTapTimes" label="交替肩触次数" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-btn push color="primary" label="提交" type="submit" />
              </div>
              <div class="col-6">
                <q-btn push color="primary" label="重置" type="reset" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="Squat">
          <br />
          <div class="text-h6">蹲训练</div>
          <q-form @submit.prevent="submitSquatForm" @reset="resetSquatForm" class="q-gutter-md">
            <q-input v-model="squatForm.date" label="日期" type="date" filled required />
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.singleLegDeadliftTimes" label="单腿硬拉次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.barbellSquatTimes" label="杠铃深蹲次数" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.barbellSquatWeight" label="杠铃深蹲重量" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.lungeTimes" label="弓步蹲次数" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.gobletSquatTimes" label="高脚杯深蹲次数" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.gobletSquatWeight" label="高脚杯深蹲重量" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.wallSitTime" label="靠墙静蹲时间" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.wallSitTimes" label="靠墙静蹲次数" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-btn push color="primary" label="提交" type="submit" />
              </div>
              <div class="col-6">
                <q-btn push color="primary" label="重置" type="reset" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>

      <q-separator />
      <br />
    </q-card>
  </q-page-container>
</template>


<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { db } from 'src/router/firebase.js';
import { addDoc,setDoc,doc,collection, getDoc } from 'firebase/firestore';
const router = useRouter();
const $q = useQuasar();

const tab = ref('Pull');

const pullForm = ref({
  action:'pull',
  date: '',
  seatedRowsTimes: '',
  seatedRowsWeight: '',
  highPullDownTimes: '',
  highPullDownWeight: '',
  vBarPullDownTimes: '',
  vBarPullDownWeight: '',
  romanianDeadliftTimes: '',
  romanianDeadliftWeight: '',
  backExtensionsTimes: '',
});

const pushForm = ref({
  action:'push',
  date: '',
  benchPressTimes: '',
  benchPressWeight: '',
  seatedPressTimes: '',
  seatedPressWeight: '',
  frontRaiseTimes: '',
  frontRaiseWeight: '',
  chestFlyTimes: '',
  chestFlyWeight: '',
  straightArmPulldownTimes: '',
  straightArmPulldownWeight: '',
  alternatingShoulderTapTimes: '',
});

const squatForm = ref({
  action:'squat',
  date: '',
  singleLegDeadliftTimes: '',
  barbellSquatTimes: '',
  barbellSquatWeight: '',
  lungeTimes: '',
  gobletSquatTimes: '',
  gobletSquatWeight: '',
  wallSitTime: '',
  wallSitTimes: '',
});

const submitPullForm =async () => {
  try {
    // 生成特定的文档 ID，比如可以用日期作为 ID
    const docId = pullForm.value.date;
    await setDoc(doc(db, 'pullWorkouts', docId), pullForm.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Pull form submitted successfully!',
    });
    resetPullForm();
    router.push({ path: "Infp" });
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Error: ${error.message}`,
    });
  }
};

const resetPullForm = () => {
  pullForm.value = {
    date: '',
    seatedRowsTimes: '',
    seatedRowsWeight: '',
    highPullDownTimes: '',
    highPullDownWeight: '',
    vBarPullDownTimes: '',
    vBarPullDownWeight: '',
    romanianDeadliftTimes: '',
    romanianDeadliftWeight: '',
    backExtensionsTimes: '',
  };
};

const submitPushForm =async () => {
  try {
    // 生成特定的文档 ID，比如可以用日期作为 ID
    const docId = pushForm.value.date;
    await setDoc(doc(db, 'pushWorkouts', docId), pushForm.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Push form submitted successfully!',
    });
    resetPushForm();
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Error: ${error.message}`,
    });
  }
};

const resetPushForm = () => {
  pushForm.value = {
    date: '',
    benchPressTimes: '',
    benchPressWeight: '',
    seatedPressTimes: '',
    seatedPressWeight: '',
    frontRaiseTimes: '',
    frontRaiseWeight: '',
    chestFlyTimes: '',
    chestFlyWeight: '',
    straightArmPulldownTimes: '',
    straightArmPulldownWeight: '',
    alternatingShoulderTapTimes: '',
  };
};

const submitSquatForm = async() => {
  try {
    // 生成特定的文档 ID，比如可以用日期作为 ID
    const docId = squatForm.value.date;
    await setDoc(doc(db, 'squatWorkouts', docId), squatForm.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Squat form submitted successfully!',
    });
    resetSquatForm();
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Error: ${error.message}`,
    });
  }
};

const resetSquatForm = () => {
  squatForm.value = {
    date: '',
    singleLegDeadliftTimes: '',
    barbellSquatTimes: '',
    barbellSquatWeight: '',
    lungeTimes: '',
    gobletSquatTimes: '',
    gobletSquatWeight: '',
    wallSitTime: '',
    wallSitTimes: '',
  };
};
</script>

<style scoped>
.q-page-container {
  max-width: 600px;
  margin: auto;
}
</style>
