<template>
  <div class="home">
    <SvgIcon name="svg-github" />
    <Button  severity="success" :label="$t('message.hello')"/>
    <el-button type="primary" size="default" >{{ $t('message.hello') }}</el-button>
    

    <div class="card flex justify-center">
      <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
              <InputOtp name="passcode" />
              <Message v-if="$form.passcode?.invalid" severity="error" size="small" variant="simple">{{ $form.passcode.error?.message }}</Message>
          </div>
          <Button type="submit" severity="secondary" label="Submit" />
      </Form>
  </div>
  </div>
</template>


<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const initialValues = ref({
  passcode: ''
});
const resolver = ref(zodResolver(
  z.object({
      passcode: z.string().min(1, { message: 'Passcode is required.' })
  })
));

const onFormSubmit = ({ valid }) => {
  console.log(`output->valid`,valid)
  if (valid) {
      toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
  }
};
</script>

<style lang="scss" scoped>
.home{
  height: 100%;
}
</style>