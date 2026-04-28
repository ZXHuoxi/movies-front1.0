<template>
  <div class="movie-form">
    <a-form @submit.prevent="handleSubmit" layout="vertical">
      <a-form-item label="电影名称" required>
        <a-input v-model:value="movieForm.movie_name" placeholder="请输入电影名称" />
      </a-form-item>

      <a-form-item label="上映时间" >
        <a-date-picker
          v-model:value="releaseTimeValue"
          style="width: 100%"
          placeholder="请选择上映时间"
          format="YYYY-MM-DD"
        />
      </a-form-item>

      <a-form-item label="总票房" >
        <a-input-number
          v-model:value="movieForm.total_boxoffice"
          style="width: 100%"
          placeholder="请输入总票房"
          :min="0"
        />
      </a-form-item>

      <a-form-item label="票价" >
        <a-input-number
          v-model:value="movieForm.price"
          style="width: 100%"
          placeholder="请输入票价"
          :min="0"
          :precision="2"
        />
      </a-form-item>

      <a-form-item label="平均场次" >
        <a-input-number
          v-model:value="movieForm.avg_show"
          style="width: 100%"
          placeholder="请输入平均场次"
          :min="0"
          :precision="2"
        />
      </a-form-item>

      <a-form-item label="类型" >
        <a-input v-model:value="movieForm.genre" placeholder="请输入电影类型" />
      </a-form-item>

      <a-form-item label="评分" >
        <a-input-number
          v-model:value="movieForm.rating"
          style="width: 100%"
          placeholder="请输入评分"
          :min="0"
          :max="10"
          :precision="1"
        />
      </a-form-item>

      <a-form-item label="国家" >
        <a-input v-model:value="movieForm.country" placeholder="请输入国家" />
      </a-form-item>

      <a-form-item label="时长(分钟)" >
        <a-input-number
          v-model:value="movieForm.duration"
          style="width: 100%"
          placeholder="请输入时长"
          :min="0"
        />
      </a-form-item>

      <a-form-item label="票房等级" >
        <a-select v-model:value="movieForm.box_level" placeholder="请选择票房等级">
          <a-select-option value="低">低</a-select-option>
          <a-select-option value="中">中</a-select-option>
          <a-select-option value="高">高</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="描述">
        <a-textarea
          v-model:value="movieForm.description"
          placeholder="请输入电影描述"
          :rows="4"
        />
      </a-form-item>

      <a-form-item>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <a-button size="default" style="width: 100px;" @click="emit('close')">取消</a-button>
          <a-button size="default" type="primary" style="width: 100px;" html-type="submit">
            {{ isEdit ? '保存' : '添加' }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts" name="MovieForm">
/**
 * 电影表单组件
 * 用于添加新电影或编辑现有电影信息
 * 支持两种模式：添加模式和编辑模式，根据props.movie是否存在判断
 */
import { reactive, ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { addMovie, updateMovie, type Movie } from '../api/movieApi';

/**
 * 组件属性
 */
const props = defineProps<{
  movie?: Movie; // 可选的电影数据，用于编辑模式
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  'close': []; // 关闭表单事件
  'success': []; // 提交成功事件
}>();

/**
 * 计算属性：判断当前是否为编辑模式
 * 如果props.movie存在且有id，则为编辑模式
 * 否则为添加模式
 */
const isEdit = computed(() => !!props.movie?.id);

/**
 * 电影表单数据
 * 包含电影的各种属性信息
 */
const movieForm = reactive<Movie>({
  id: undefined, // 电影ID
  movie_name: '', // 电影名称
  release_time: '', // 上映时间
  total_boxoffice: 0, // 总票房
  price: 0, // 票价
  avg_show: 0, // 平均场次
  genre: '', // 电影类型
  rating: 0, // 评分
  country: '', // 国家
  duration: 0, // 时长（分钟）
  box_level: '中', // 票房等级
  description: '' // 电影描述
});

/**
 * 上映时间选择器的值
 * 使用dayjs格式，与后端API交互时转换为字符串
 */
const releaseTimeValue = ref<Dayjs | null>(null);

/**
 * 重置表单数据
 * 1. 清空所有表单字段
 * 2. 重置为默认值
 * 3. 清空上映时间选择器
 */
const resetForm = () => {
  // Step 1: 重置电影ID为undefined
  movieForm.id = undefined;
  
  // Step 2: 重置电影名称为空
  movieForm.movie_name = '';
  
  // Step 3: 重置上映时间为空
  movieForm.release_time = '';
  
  // Step 4: 重置总票房为0
  movieForm.total_boxoffice = 0;
  
  // Step 5: 重置票价为0
  movieForm.price = 0;
  
  // Step 6: 重置平均场次为0
  movieForm.avg_show = 0;
  
  // Step 7: 重置电影类型为空
  movieForm.genre = '';
  
  // Step 8: 重置评分为0
  movieForm.rating = 0;
  
  // Step 9: 重置国家为空
  movieForm.country = '';
  
  // Step 10: 重置时长为0
  movieForm.duration = 0;
  
  // Step 11: 重置票房等级为"中"
  movieForm.box_level = '中';
  
  // Step 12: 重置描述为空
  movieForm.description = '';
  
  // Step 13: 清空上映时间选择器
  releaseTimeValue.value = null;
};

/**
 * 监听props.movie的变化
 * 当父组件传入movie数据时（编辑模式），填充表单数据
 * 当movie变为undefined时（添加模式），重置表单数据
 * 
 * @param newMovie 新的电影数据
 */
watch(() => props.movie, (newMovie) => {
  // Step 1: 检查是否有传入的电影数据
  if (newMovie) {
    // Step 2: 使用Object.assign填充表单数据
    // 这样可以批量更新movieForm的多个属性
    Object.assign(movieForm, newMovie);
    
    // Step 3: 如果有上映时间，转换为dayjs格式
    if (newMovie.release_time) {
      releaseTimeValue.value = dayjs(newMovie.release_time);
    }
  } else {
    // Step 4: 如果没有电影数据，重置表单
    resetForm();
  }
}, { immediate: true });

const handleSubmit = async () => {
  // Step 1: 验证电影名称
  // 电影名称为必填项，不能为空
  if (!movieForm.movie_name) {
    message.error('请输入电影名称');
    return;
  }

  // Step 2: 验证上映时间
  // 上映时间为必填项，必须选择
  if (!releaseTimeValue.value) {
    message.error('请选择上映时间');
    return;
  }

  // Step 3: 格式化上映时间
  // 将dayjs格式转换为"YYYY-MM-DD"字符串格式
  movieForm.release_time = releaseTimeValue.value.format('YYYY-MM-DD');

  try {
    // Step 4: 根据模式调用相应的API
    if (isEdit.value) {
      // Step 4a: 编辑模式，调用更新API
      await updateMovie(movieForm);
      message.success('修改成功');
    } else {
      // Step 4b: 添加模式，调用添加API
      await addMovie(movieForm);
      message.success('添加成功');
      
      // Step 4c: 添加成功后重置表单
      // 清空表单数据，方便下次添加
      resetForm();
    }
    
    // Step 5: 触发提交成功事件
    // 通知父组件数据已提交
    emit('success');
    
    // Step 6: 关闭表单
    emit('close');
  } catch (error) {
    // Step 7: 处理提交失败
    // 显示错误提示信息
    message.error(isEdit.value ? '修改失败' : '添加失败');
  }
};
</script>

<style scoped>
.movie-form {
  width: 100%;
}
</style>