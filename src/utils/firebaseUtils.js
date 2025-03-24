import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../router/firebase'
import { getCurrentDate, getCurrentTime } from "./dateUtils";

// 通用的 Firebase 操作类
export class FirebaseService {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  // 获取文档
  async getDocument(docId) {
    try {
      const docRef = doc(db, this.collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error(`获取文档失败 (${this.collectionName}/${docId}):`, error);
      throw error;
    }
  }

  // 设置文档
  async setDocument(docId, data) {
    try {
      const docRef = doc(db, this.collectionName, docId);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`设置文档失败 (${this.collectionName}/${docId}):`, error);
      throw error;
    }
  }

  // 更新文档
  async updateDocument(docId, data) {
    try {
      const docRef = doc(db, this.collectionName, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`更新文档失败 (${this.collectionName}/${docId}):`, error);
      throw error;
    }
  }

  // 添加数组元素
  async addToArray(docId, field, element) {
    try {
      const docRef = doc(db, this.collectionName, docId);
      await updateDoc(docRef, {
        [field]: arrayUnion(element)
      });
    } catch (error) {
      console.error(`添加数组元素失败 (${this.collectionName}/${docId}):`, error);
      throw error;
    }
  }

  // 从数组中移除元素
  async removeFromArray(docId, field, element) {
    try {
      const docRef = doc(db, this.collectionName, docId);
      await updateDoc(docRef, {
        [field]: arrayRemove(element)
      });
    } catch (error) {
      console.error(`移除数组元素失败 (${this.collectionName}/${docId}):`, error);
      throw error;
    }
  }
}

// 菜单服务
export class MenuService extends FirebaseService {
  constructor() {
    super('menus');
  }

  // 保存菜单
  async saveMenu(type, menu) {
    const date = getCurrentDate();
    const time = getCurrentTime();
    const menuData = {
      menu,
      timestamp: time
    };

    await this.setDocument(date, {
      [type]: menuData
    });

    return menuData;
  }

  // 获取今日菜单
  async getTodayMenus() {
    const date = getCurrentDate();
    const data = await this.getDocument(date);
    return {
      lunch: data?.lunch || null,
      dinner: data?.dinner || null
    };
  }
}

// 家务服务
export class ChoreService extends FirebaseService {
  constructor() {
    super('chores');
  }

  // 添加家务任务
  async addChore(task, date) {
    const choreData = {
      task,
      date
    };
    await this.addToArray('unfinishedchores', 'taskList', choreData);
    return choreData;
  }

  // 完成任务
  async completeChore(task) {
    await this.removeFromArray('unfinishedchores', 'taskList', task);
  }

  // 设置每日任务
  async setDailyChore(task) {
    await this.setDocument('dailychore', task);
  }

  // 获取每日任务
  async getDailyChore() {
    return await this.getDocument('dailychore');
  }

  // 获取未完成任务列表
  async getUnfinishedChores() {
    const data = await this.getDocument('unfinishedchores');
    return data?.taskList || [];
  }
}

// 目标服务
export class GoalService extends FirebaseService {
  constructor() {
    super('purposes');
  }

  // 添加目标
  async addGoal(category, goal) {
    await this.addToArray('goals', category, goal);
  }

  // 更新目标
  async updateGoal(category, oldGoal, newGoal) {
    await this.removeFromArray('goals', category, oldGoal);
    await this.addToArray('goals', category, newGoal);
  }

  // 删除目标
  async deleteGoal(category, goal) {
    await this.removeFromArray('goals', category, goal);
  }

  // 获取所有目标
  async getAllGoals() {
    const data = await this.getDocument('goals');
    return data || {};
  }
}
