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
import { reactive, ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { addMovie, updateMovie, type Movie } from '../api/movieApi';

const props = defineProps<{
  movie?: Movie;
}>();

const emit = defineEmits(['close', 'success']);

const isEdit = computed(() => !!props.movie?.id);

const movieForm = reactive<Movie>({
  id: undefined,
  movie_name: '',
  release_time: '',
  total_boxoffice: 0,
  price: 0,
  avg_show: 0,
  genre: '',
  rating: 0,
  country: '',
  duration: 0,
  box_level: '中',
  description: ''
});

const releaseTimeValue = ref<Dayjs | null>(null);

const resetForm = () => {
  movieForm.id = undefined;
  movieForm.movie_name = '';
  movieForm.release_time = '';
  movieForm.total_boxoffice = 0;
  movieForm.price = 0;
  movieForm.avg_show = 0;
  movieForm.genre = '';
  movieForm.rating = 0;
  movieForm.country = '';
  movieForm.duration = 0;
  movieForm.box_level = '中';
  movieForm.description = '';
  releaseTimeValue.value = null;
};

watch(() => props.movie, (newMovie) => {
  if (newMovie) {
    Object.assign(movieForm, newMovie);
    if (newMovie.release_time) {
      releaseTimeValue.value = dayjs(newMovie.release_time);
    }
  } else {
    resetForm();
  }
}, { immediate: true });

const handleSubmit = async () => {
  if (!movieForm.movie_name) {
    message.error('请输入电影名称');
    return;
  }

  if (!releaseTimeValue.value) {
    message.error('请选择上映时间');
    return;
  }

  movieForm.release_time = releaseTimeValue.value.format('YYYY-MM-DD');

  try {
    if (isEdit.value) {
      await updateMovie(movieForm);
      message.success('修改成功');
    } else {
      await addMovie(movieForm);
      message.success('添加成功');
      resetForm();
    }
    emit('success');
    emit('close');
  } catch (error) {
    message.error(isEdit.value ? '修改失败' : '添加失败');
  }
};
</script>

<style scoped>
.movie-form {
  width: 100%;
}
</style>