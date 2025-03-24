<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 左侧：图片上传和OCR结果 -->
      <div class="col-12 col-md-6">
        <q-card class="expense-card">
          <q-card-section>
            <div class="text-h6">上传小票</div>
            <div class="q-mt-md">
              <q-file
                v-model="imageFile"
                label="选择图片"
                filled
                bottom-slots
                counter
                accept="image/*"
                @update:model-value="handleImageUpload"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template v-slot:append>
                  <q-icon name="camera_alt" class="cursor-pointer" @click="openCamera" />
                </template>
              </q-file>
            </div>

            <!-- 图片预览 -->
            <div v-if="imagePreview" class="q-mt-md">
              <q-img
                :src="imagePreview"
                style="max-height: 300px"
                fit="contain"
              />
            </div>

            <!-- OCR结果 -->
            <div v-if="ocrResults.length > 0" class="q-mt-md">
              <div class="text-subtitle1">识别结果：</div>
              <div class="row q-col-gutter-sm">
                <div v-for="(item, index) in ocrResults" :key="index" class="col-12">
                  <q-chip
                    draggable
                    @dragstart="startDrag($event, item)"
                    :color="getChipColor(item.type)"
                    text-color="white"
                  >
                    {{ item.text }}
                  </q-chip>
                </div>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="isProcessing" class="q-mt-md">
              <q-linear-progress indeterminate />
              <div class="text-caption q-mt-sm">正在处理图片...</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 右侧：拖拽区域和表单 -->
      <div class="col-12 col-md-6">
        <q-card class="expense-card">
          <q-card-section>
            <div class="text-h6">记账表单</div>
            <div class="q-mt-md">
              <!-- 商家名称 -->
              <q-input
                v-model="expenseForm.merchant"
                label="商家名称"
                filled
                :rules="[val => !!val || '请输入商家名称']"
                @drop="handleDrop($event, 'merchant')"
                @dragover.prevent
              >
                <template v-slot:append>
                  <q-icon name="drag_indicator" />
                </template>
              </q-input>

              <!-- 金额 -->
              <q-input
                v-model="expenseForm.amount"
                label="金额"
                filled
                type="number"
                :rules="[val => !!val || '请输入金额']"
                @drop="handleDrop($event, 'amount')"
                @dragover.prevent
              >
                <template v-slot:append>
                  <q-icon name="drag_indicator" />
                </template>
              </q-input>

              <!-- 日期 -->
              <q-input
                v-model="expenseForm.date"
                label="日期"
                filled
                :rules="[val => !!val || '请选择日期']"
                @drop="handleDrop($event, 'date')"
                @dragover.prevent
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="expenseForm.date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="关闭" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                  <q-icon name="drag_indicator" />
                </template>
              </q-input>

              <!-- 分类 -->
              <q-select
                v-model="expenseForm.category"
                :options="categories"
                label="分类"
                filled
                :rules="[val => !!val || '请选择分类']"
                @drop="handleDrop($event, 'category')"
                @dragover.prevent
              >
                <template v-slot:append>
                  <q-icon name="drag_indicator" />
                </template>
              </q-select>

              <!-- 备注 -->
              <q-input
                v-model="expenseForm.note"
                label="备注"
                filled
                type="textarea"
                @drop="handleDrop($event, 'note')"
                @dragover.prevent
              >
                <template v-slot:append>
                  <q-icon name="drag_indicator" />
                </template>
              </q-input>

              <!-- 提交按钮 -->
              <div class="q-mt-md">
                <q-btn
                  color="primary"
                  label="保存"
                  :loading="isSaving"
                  @click="saveExpense"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { storage, db } from '../router/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar()
const imageFile = ref(null)
const imagePreview = ref(null)
const ocrResults = ref([])
const isProcessing = ref(false)
const isSaving = ref(false)

// 支出分类选项
const categories = [
  '餐饮',
  '交通',
  '购物',
  '娱乐',
  '居住',
  '医疗',
  '教育',
  '其他'
]

const expenseForm = reactive({
  merchant: '',
  amount: '',
  date: '',
  category: '',
  note: '',
  imageUrl: ''
})

// 处理图片上传
const handleImageUpload = async (file) => {
  if (!file) return

  isProcessing.value = true
  try {
    // 创建预览URL
    imagePreview.value = URL.createObjectURL(file)

    // 上传图片到 Firebase Storage
    const uid = localStorage.getItem('UID')
    const timestamp = new Date().getTime()
    const imageRef = storageRef(storage, `receipts/${uid}/${timestamp}_${file.name}`)
    await uploadBytes(imageRef, file)
    const imageUrl = await getDownloadURL(imageRef)
    expenseForm.imageUrl = imageUrl

    // 调用 OCR API 进行文字识别
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: await fileToBase64(file)
          },
          features: [{
            type: 'TEXT_DETECTION'
          }]
        }]
      })
    })

    const data = await response.json()
    const text = data.responses[0].textAnnotations[0].description

    // 分析文本，提取信息
    const results = analyzeText(text)
    ocrResults.value = results
  } catch (error) {
    console.error('Error processing image:', error)
    $q.notify({
      message: '处理图片时出错',
      color: 'negative'
    })
  } finally {
    isProcessing.value = false
  }
}

// 将文件转换为 Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]
      resolve(base64String)
    }
    reader.onerror = error => reject(error)
  })
}

// 分析文本，提取信息
const analyzeText = (text) => {
  const results = []

  // 提取商家名称（通常是第一行）
  const lines = text.split('\n')
  if (lines.length > 0) {
    results.push({
      text: lines[0].trim(),
      type: 'merchant'
    })
  }

  // 提取金额（查找包含数字的行）
  const amountRegex = /¥?\s*(\d+\.?\d*)/
  const amountMatch = text.match(amountRegex)
  if (amountMatch) {
    results.push({
      text: amountMatch[1],
      type: 'amount'
    })
  }

  // 提取日期（查找日期格式）
  const dateRegex = /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/
  const dateMatch = text.match(dateRegex)
  if (dateMatch) {
    results.push({
      text: dateMatch[1],
      type: 'date'
    })
  }

  return results
}

// 获取芯片颜色
const getChipColor = (type) => {
  switch (type) {
    case 'merchant': return 'primary'
    case 'amount': return 'positive'
    case 'date': return 'info'
    default: return 'secondary'
  }
}

// 打开相机
const openCamera = () => {
  // 使用 Web API 打开相机
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      // TODO: 实现相机预览和拍照功能
      $q.notify({
        message: '相机功能开发中...',
        color: 'info'
      })
    })
    .catch(error => {
      console.error('Error accessing camera:', error)
      $q.notify({
        message: '无法访问相机',
        color: 'negative'
      })
    })
}

// 开始拖拽
const startDrag = (event, item) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(item))
}

// 处理拖放
const handleDrop = (event, field) => {
  event.preventDefault()
  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  if (data.type === field) {
    expenseForm[field] = data.text
  }
}

// 保存支出记录
const saveExpense = async () => {
  if (!expenseForm.merchant || !expenseForm.amount || !expenseForm.date) {
    $q.notify({
      message: '请填写必要信息',
      color: 'warning'
    })
    return
  }

  isSaving.value = true
  try {
    const uid = localStorage.getItem('UID')
    const expenseData = {
      ...expenseForm,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await addDoc(collection(db, 'expenses'), expenseData)

    $q.notify({
      message: '保存成功！',
      color: 'positive'
    })

    // 重置表单
    Object.keys(expenseForm).forEach(key => {
      expenseForm[key] = ''
    })
    imageFile.value = null
    imagePreview.value = null
    ocrResults.value = []
  } catch (error) {
    console.error('Error saving expense:', error)
    $q.notify({
      message: '保存失败',
      color: 'negative'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.expense-card {
  height: 100%;
}
</style>
