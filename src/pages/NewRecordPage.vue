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
        <q-tab name="Pull" label="Pull" />
        <q-tab name="Push" label="Push" />
        <q-tab name="Squat" label="Squat" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Pull">
          <br />
          <div class="text-h6">Pull Workout</div>
          <q-form @submit.prevent="submitPullForm" @reset="resetPullForm" class="q-gutter-md">
            <q-input v-model="pullForm.date" label="Date" type="date" filled required />
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.seatedRowsTimes" label="Seated Rows Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.seatedRowsWeight" label="Seated Rows Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.highPullDownTimes" label="High Pull Down Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.highPullDownWeight" label="High Pull Down Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.vBarPullDownTimes" label="V Bar Pull Down Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.vBarPullDownWeight" label="V Bar Pull Down Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.romanianDeadliftTimes" label="Romanian Deadlift Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pullForm.romanianDeadliftWeight" label="Romanian Deadlift Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pullForm.backExtensionsTimes" label="Back Extensions Times" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-btn push color="primary" label="Submit" type="submit" />
              </div>
              <div class="col-6">
                <q-btn push color="primary" label="Reset" type="reset" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="Push">
          <br />
          <div class="text-h6">Push Workout</div>
          <q-form @submit.prevent="submitPushForm" @reset="resetPushForm" class="q-gutter-md">
            <q-input v-model="pushForm.date" label="Date" type="date" filled required />
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.benchPressTimes" label="Bench Press Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.benchPressWeight" label="Bench Press Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.seatedPressTimes" label="Seated Press Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.seatedPressWeight" label="Seated Press Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.frontRaiseTimes" label="Front Raise Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.frontRaiseWeight" label="Front Raise Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.chestFlyTimes" label="Chest Fly Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.chestFlyWeight" label="Chest Fly Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.straightArmPulldownTimes" label="Straight Arm Pulldown Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="pushForm.straightArmPulldownWeight" label="Straight Arm Pulldown Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="pushForm.alternatingShoulderTapTimes" label="Alternating Shoulder Tap Times" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-btn push color="primary" label="Submit" type="submit" />
              </div>
              <div class="col-6">
                <q-btn push color="primary" label="Reset" type="reset" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="Squat">
          <br />
          <div class="text-h6">Squat Workout</div>
          <q-form @submit.prevent="submitSquatForm" @reset="resetSquatForm" class="q-gutter-md">
            <q-input v-model="squatForm.date" label="Date" type="date" filled required />
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.singleLegDeadliftTimes" label="Single Leg Deadlift Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.barbellSquatTimes" label="Barbell Squat Times" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.barbellSquatWeight" label="Barbell Squat Weight" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.lungeTimes" label="Lunge Times" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.gobletSquatTimes" label="Goblet Squat Times" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.gobletSquatWeight" label="Goblet Squat Weight" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-input v-model="squatForm.wallSitTime" label="Wall Sit Time" type="number" filled required />
              </div>
              <div class="col-6">
                <q-input v-model="squatForm.wallSitTimes" label="Wall Sit Times" type="number" filled required />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-btn push color="primary" label="Submit" type="submit" />
              </div>
              <div class="col-6">
                <q-btn push color="primary" label="Reset" type="reset" />
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
import { db } from 'src/router/firebase.js';
import { addDoc,setDoc,doc,collection, getDoc } from 'firebase/firestore';

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
