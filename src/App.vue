<script setup></script>

<template>
  <main>
    <!-- <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/bookings">Bookings</router-link>
      <router-link to="/students">Students</router-link>
    </nav> -->
    <div>
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped>
div{
  /* padding: 20px; */
  max-height: 100dvh;
  overflow: hidden;
}
main {
  display: grid;
  /* grid-template-columns: 300px 1fr; */
  /* gap: 20px; */
  width: 100%;
}
nav {
  display: flex;
  /* justify-content: space-between; */
  min-height: 100dvh;
  flex-direction: column;
  /* gap: 20px; */
  background: rgba(65, 3, 65, 0.133);
}

a {
  padding: 10px 20px;
  /* background: #f4f4f4; */
  margin-bottom: 10px;
}

a.router-link-active {
  color: red;
}
</style>
