<template>
  <div>
    <div class="card flex justify-center">
      <ColorPicker v-model="color" name="color" />
      <Button @click="updateColors('aura')">aura</Button>

      
      <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />
      <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit"
        class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <InputOtp name="passcode" />
          <Message v-if="$form.passcode?.invalid" size="small" variant="simple">{{
            $form.passcode.error?.message }}</Message>
        </div>
        <Button type="submit" label="Submit" />
      </Form>
    </div>
  </div>
</template>

<script setup lang='ts' name='primevue'>
// @routeMeta { "requiresAuth": true, "role": "admin",name: "primevue" }
import { palette , updatePreset } from '@primeuix/themes';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const color = ref('')
const initialValues = ref({
  passcode: ''
});
const resolver = ref(zodResolver(
  z.object({
    passcode: z.string().min(1, { message: 'Passcode is required.' })
  })
));


const onFormSubmit = ({ valid }: { valid: boolean }) => {
  if (valid) {
    toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
  }
};

const updateColors = () => {
  const values1 = palette(color.value);

  updatePreset({
    semantic: {
      primary: values1
    }
  });
};

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<style lang='scss' scoped></style>