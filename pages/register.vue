<template>
  <div class="flex bg-black h-screen">
    <!-- sidebar -->
    <div class="bg-zinc-900 w-[516px] p-8 flex flex-col justify-center px-12">
      <Logo />
      <h1 class="text-white font-bold text-lg mt-8">
        Sign up for a free account
      </h1>
      <p class="text-zinc-300 text-sm">
        Already registered?
        <NuxtLink to="/login" class="font-bold text-[#FFAC00] underline"
          >Log in</NuxtLink
        >
        to your account
      </p>
      <form @submit.prevent="submit">
        <div class="mt-8">
          <label for="email" class="text-zinc-300 text-sm mb-0.5"
            >Email Address</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full bg-[#27272A] border border-[#3F3F46] rounded-md px-4 py-2 placeholder:text-zinc-500 text-sm"
            placeholder="your@example.com"
          />
        </div>
        <div class="mt-6">
          <label for="password" class="text-zinc-300 text-sm mb-0.5"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full bg-[#27272A] border border-[#3F3F46] rounded-md px-4 py-2 placeholder:text-zinc-500 text-sm"
            placeholder="************"
          />
        </div>
        <!-- sign up button -->
        <div class="mt-6">
          <button
            class="flex items-center justify-center space-x-2 w-full bg-[#FFAC00] text-black font-bold text-sm rounded-full px-4 py-2"
          >
            <span>Sign up</span>
            <ArrowRight />
          </button>
        </div>
        <!-- /sign up button -->
      </form>
    </div>
    <!-- /sidebar -->
    <!-- note introduction -->
    <div class="bg-zinc-900"></div>
    <!-- /note introduction -->
  </div>
</template>
<script setup>
import Swal from "sweetalert2";

const email = ref("");
const password = ref("");

async function submit() {
  try {
    const response = await $fetch("/api/user", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    console.log(response);
    const { isConfirmed } = await Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data,
    });
    if (isConfirmed) {
      navigateTo("/");
    }
  } catch (error) {
    console.log(error.response?._data?.message);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.response?._data?.message,
    });
  }
}
</script>
