<template>
   <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="date"
      flat
      bordered
    />
    <div class="q-pa-md q-gutter-sm" style="text-align: right;">
  <q-btn color="amber" label="Add New Record" @click="addnewrecord" />
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from 'src/router/firebase.js';
import { doc,collection, getDoc} from 'firebase/firestore';

const rows = ref([]);
const router = useRouter();
const columns = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: 'date',
    sortable: true
  },
  { name: 'action',align:'center', label:'Action',field:'action',sortable:true},
  { name: 'back_extension', align: 'center', label: 'Back Extension', field: 'Back Extension', sortable: true },
  { name: 'romanian_deadlift_weight', align: 'center', label: 'Romanian Deadlift Weight', field: 'Romanian Deadlift weight ', sortable: true },
  { name: 'seated_rows_times', align: 'center', label: 'Seated Rows Times', field: 'Seated Rows times', sortable: true },
  { name: 'warm_up', align: 'center', label: 'Warm-up', field: 'warm-up', sortable: true }
];

const fetchData = async () => {
  try {
    const docRef = doc(db, "Date", "2024-07-30");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      rows.value = [{ date: docSnap.id, ...data }];
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
};

onMounted(() => {
  fetchData();
});

function addnewrecord(){
  router.push({ path: '/nrp' });
}





</script>

