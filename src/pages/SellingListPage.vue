<template>
  <q-page class="flex justify-center">
    <div class="flex flex-center q-pa-md">
      <div class="row q-gutter-md">

        <!-- 添加商品表单 -->
        <q-card>
          <q-card-section>
            <div class="text-h6">添加二手商品</div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="newItem.name" label="商品名称" filled class="q-mb-md" />
            <q-input v-model="newItem.price" label="价格" filled type="number" class="q-mb-md" />
            <q-input v-model="newItem.description" label="描述" filled type="textarea" class="q-mb-md" />
            <q-btn color="primary" label="添加商品" @click="addItem" />
          </q-card-section>
        </q-card>

        <!-- 商品列表 -->
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">我的二手商品列表</div>
          </q-card-section>
          <q-card-section v-if="items.length > 0">
            <q-list bordered>
              <q-item v-for="(item, index) in items" :key="index">
                <q-item-section>
                  <div class="text-subtitle1">{{ item.name }}</div>
                  <div class="text-caption text-grey">价格: ¥{{ item.price }}</div>
                  <div class="text-caption text-grey">描述: {{ item.description }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="negative" label="删除" @click="deleteItem(index)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section v-else>
            <div class="text-center text-grey">还没有添加任何商品</div>
          </q-card-section>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { db } from '../router/firebase'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const $q = useQuasar();
const newItem = ref({ name: "", price: "", description: "" }); // 新商品表单数据
const items = ref([]); // 商品列表

// 组件挂载时加载商品列表
onMounted(() => {
  loadItems();
});

// 添加商品
const addItem = async () => {
  if (!newItem.value.name || !newItem.value.price) {
    $q.notify({ color: "negative", message: "请填写商品名称和价格" });
    return;
  }

  const item = {
    name: newItem.value.name,
    price: parseFloat(newItem.value.price).toFixed(2), // 格式化价格为两位小数
    description: newItem.value.description || "暂无描述",
  };

  try {
    const listRef = doc(db, "secondhand", "items");
    await updateDoc(listRef, {
      items: arrayUnion(item),
    });

    // 更新本地列表
    items.value.push(item);
    newItem.value = { name: "", price: "", description: "" }; // 清空表单
    $q.notify({ color: "positive", message: "商品添加成功!" });
  } catch (error) {
    console.error("添加商品失败:", error);
    $q.notify({ color: "negative", message: "添加商品失败" });
  }
};

// 删除商品
const deleteItem = async (index) => {
  const itemToDelete = items.value[index];
  try {
    const listRef = doc(db, "secondhand", "items");
    await updateDoc(listRef, {
      items: arrayRemove(itemToDelete),
    });

    // 更新本地列表
    items.value.splice(index, 1);
    $q.notify({ color: "positive", message: "商品删除成功!" });
  } catch (error) {
    console.error("删除商品失败:", error);
    $q.notify({ color: "negative", message: "删除商品失败" });
  }
};

// 加载商品列表
const loadItems = async () => {
  try {
    const listRef = doc(db, "secondhand", "items");
    const listSnap = await getDoc(listRef);
    if (listSnap.exists()) {
      items.value = listSnap.data().items || [];
    } else {
      items.value = [];
    }
  } catch (error) {
    console.error("加载商品列表失败", error);
  }
};
</script>

<style>
/* 样式保持不变 */
.q-card {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
}

.q-mt-md {
  margin-top: 16px;
}

.q-pa-md {
  padding: 16px;
}

.q-mb-md {
  margin-bottom: 16px;
}
</style>
