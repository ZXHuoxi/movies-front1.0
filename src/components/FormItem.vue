<template>
  <a-form-item 
    :label="label"
    :required="required"
    :validate-status="error ? 'error' : (success ? 'success' : '')" 
    :help="error || success"
  >
    <slot></slot>
  </a-form-item>
</template>

<script setup lang="ts" name="FormItem">
defineProps({
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  success: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
});
</script>