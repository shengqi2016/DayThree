<template>
  <q-page class="q-pa-md">
    <!-- Push Workouts Table -->

      <q-separator />
      <q-card-section>
        <q-table
          title="Push"
          :rows="pushRows"
          :columns="pushColumns"
          row-key="id"
        />
      </q-card-section>


    <!-- Pull Workouts Table -->
      <q-separator />
      <q-card-section>
        <q-table
          title="Pull"
          :rows="pullRows"
          :columns="pullColumns"
          row-key="id"
        />
      </q-card-section>


    <!-- Squat Workouts Table -->
      <q-separator />
      <q-card-section>
        <q-table
          title="Squat"
          :rows="squatRows"
          :columns="squatColumns"
          row-key="id"
        />
      </q-card-section>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from 'src/router/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

// Pull Workouts
const pullRows = ref([]);
const pullColumns = [
  { name: 'date', required: true, label: 'Date', align: 'left', field: 'date', sortable: true },
  { name: 'seatedRowsTimes', align: 'center', label: 'Seated Rows Times', field: 'seatedRowsTimes', sortable: true },
  { name: 'seatedRowsWeight', align: 'center', label: 'Seated Rows Weight', field: 'seatedRowsWeight', sortable: true },
  { name: 'highPullDownTimes', align: 'center', label: 'High Pull Down Times', field: 'highPullDownTimes', sortable: true },
  { name: 'highPullDownWeight', align: 'center', label: 'High Pull Down Weight', field: 'highPullDownWeight', sortable: true },
  { name: 'vBarPullDownTimes', align: 'center', label: 'V Bar Pull Down Times', field: 'vBarPullDownTimes', sortable: true },
  { name: 'vBarPullDownWeight', align: 'center', label: 'V Bar Pull Down Weight', field: 'vBarPullDownWeight', sortable: true },
  { name: 'romanianDeadliftTimes', align: 'center', label: 'Romanian Deadlift Times', field: 'romanianDeadliftTimes', sortable: true },
  { name: 'romanianDeadliftWeight', align: 'center', label: 'Romanian Deadlift Weight', field: 'romanianDeadliftWeight', sortable: true },
  { name: 'backExtensionsTimes', align: 'center', label: 'Back Extensions Times', field: 'backExtensionsTimes', sortable: true }
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
    console.error("Error getting pull workouts: ", error);
  }
};

// Push Workouts
const pushRows = ref([]);
const pushColumns = [
  { name: 'date', required: true, label: 'Date', align: 'left', field: 'date', sortable: true },
  { name: 'benchPressTimes', align: 'center', label: 'Bench Press Times', field: 'benchPressTimes', sortable: true },
  { name: 'benchPressWeight', align: 'center', label: 'Bench Press Weight', field: 'benchPressWeight', sortable: true },
  { name: 'seatedPressTimes', align: 'center', label: 'Seated Press Times', field: 'seatedPressTimes', sortable: true },
  { name: 'seatedPressWeight', align: 'center', label: 'Seated Press Weight', field: 'seatedPressWeight', sortable: true },
  { name: 'frontRaiseTimes', align: 'center', label: 'Front Raise Times', field: 'frontRaiseTimes', sortable: true },
  { name: 'frontRaiseWeight', align: 'center', label: 'Front Raise Weight', field: 'frontRaiseWeight', sortable: true },
  { name: 'chestFlyTimes', align: 'center', label: 'Chest Fly Times', field: 'chestFlyTimes', sortable: true },
  { name: 'chestFlyWeight', align: 'center', label: 'Chest Fly Weight', field: 'chestFlyWeight', sortable: true },
  { name: 'straightArmPulldownTimes', align: 'center', label: 'Straight Arm Pulldown Times', field: 'straightArmPulldownTimes', sortable: true },
  { name: 'straightArmPulldownWeight', align: 'center', label: 'Straight Arm Pulldown Weight', field: 'straightArmPulldownWeight', sortable: true },
  { name: 'alternatingShoulderTapTimes', align: 'center', label: 'Alternating Shoulder Tap Times', field: 'alternatingShoulderTapTimes', sortable: true }
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
    console.error("Error getting push workouts: ", error);
  }
};

// Squat Workouts
const squatRows = ref([]);
const squatColumns = [
  { name: 'date', required: true, label: 'Date', align: 'left', field: 'date', sortable: true },
  { name: 'singleLegDeadliftTimes', align: 'center', label: 'Single Leg Deadlift Times', field: 'singleLegDeadliftTimes', sortable: true },
  { name: 'barbellSquatTimes', align: 'center', label: 'Barbell Squat Times', field: 'barbellSquatTimes', sortable: true },
  { name: 'barbellSquatWeight', align: 'center', label: 'Barbell Squat Weight', field: 'barbellSquatWeight', sortable: true },
  { name: 'lungeTimes', align: 'center', label: 'Lunge Times', field: 'lungeTimes', sortable: true },
  { name: 'gobletSquatTimes', align: 'center', label: 'Goblet Squat Times', field: 'gobletSquatTimes', sortable: true },
  { name: 'gobletSquatWeight', align: 'center', label: 'Goblet Squat Weight', field: 'gobletSquatWeight', sortable: true },
  { name: 'wallSitTime', align: 'center', label: 'Wall Sit Time', field: 'wallSitTime', sortable: true },
  { name: 'wallSitTimes', align: 'center', label: 'Wall Sit Times', field: 'wallSitTimes', sortable: true }
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
    console.error("Error getting squat workouts: ", error);
  }
};

onMounted(() => {
  fetchPullData();
  fetchPushData();
  fetchSquatData();
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
