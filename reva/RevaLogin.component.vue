<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col self-center">
    <div class="mb-4">
      <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
        Username
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" v-model="user" id="username" type="text" placeholder="Username">
    </div>
    <div class="mb-6">
      <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" v-model="password" id="password" type="password" placeholder="******************">
    </div>
    <div class="flex items-end justify-end">
      <button class="bg-blue-500 hover:bg-blue-dark text-white  py-2 px-4 font-bold  rounded" type="button" v-on:click="login">
        Sign In
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: undefined,
      password: undefined
    }
  },
  methods: {
    login: function () {
      fetch("/api/authentication/reva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: this.user,
          password: this.password
        })
      }).then(async (response) => {
        let jsonResponse = await response.json();
        window.sessionStorage.setItem('revaSID', jsonResponse.token);
        this.$router.push({path: '/', query: {}});
      }).catch((error) => console.log(error));
    }
  }
}
</script>

<style scoped>

</style>
