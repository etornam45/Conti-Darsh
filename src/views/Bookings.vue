<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import TitleBar from "../components/TitleBar.vue";
import PocketBase from "pocketbase";

let pb = new PocketBase("http://127.0.0.1:8090");

let bookings = ref([]);

let searchedBookings = ref([]);

// let bookings = pb.collection('bookings').getFullList();
onMounted(async () => {
  await pb
    .collection("bookings")
    .getFullList({
      // filter: ''
      sort: "created",
      expand: "student,computer",
    })
    .then((result) => {
      bookings.value = result;
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  pb.collection("bookings").subscribe("*", function (e) {
    console.log(e.record);
  });
});

onUnmounted(async () => {
  pb.collection("bookings").unsubscribe("*");
});

const searchFromTable = (id) => {
  bookings.value.forEach((Booking) => {
    if (Booking.id == id) {
      searchedBookings.value = [];
      searchedBookings.value.push(Booking);
    }
  });
};

const searchFromSideBar = (code) => {
    console.log(code);
  bookings.value.forEach((Booking) => {
    if (Booking.booking_code == code) {
      searchedBookings.value = [];
      searchedBookings.value.push(Booking);
    }
  });
};

let code = "";
</script>

<template>
  <TitleBar title="Bookings" />

  <article>
    <section>
      <table>
        <tr>
          <th>Computer</th>
          <th>Booking Code</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Student</th>
          <th>Status</th>
        </tr>
        <tr
          v-for="Booking in bookings"
          :key="Booking.id"
          @click="searchFromTable(Booking.id)"
        >
          <td>{{ Booking.booking_code }}</td>
          <td>{{ Booking.expand?.computer?.display_name }}</td>
          <td>{{ new Date(Booking.start_time).toLocaleTimeString() }}</td>
          <td>{{ new Date(Booking.end_time).toLocaleTimeString() }}</td>
          <td>
            {{ Booking.expand?.student?.name }} -
            {{ Booking.expand?.student?.student_id }}
          </td>
          <td>
            <span :class="Booking.status">{{ Booking.status }}</span>
          </td>
        </tr>
      </table>
    </section>

    <aside>
      <input type="text" placeholder="Search Bookings By Code" class="search" v-model="code"  />
      <button @click="searchFromSideBar(code)">
        Search  
      </button>
      <div v-for="searched in searchedBookings" :key="searched.id">
        {{ searched.booking_code }}
        <br>
        {{ new Date(searched.start_time).toLocaleTimeString() }}
        <br>
        {{ new Date(searched.end_time).toLocaleTimeString() }}
        {{ searched.expand?.student?.name }}
        <button v-if="searched.status == 'Pending'">Accept</button>
        <button v-if="searched.status == 'Accepted'">Complete</button>
      </div>
    </aside>
  </article>
</template>

<style>
.Pending {
  color: white;
  background: rgb(204, 20, 23);
  padding: 2px 10px;
  border-radius: 20px;
}

.Accepted {
  color: white;
  background: rgb(24, 153, 153);
  padding: 2px 10px;
  border-radius: 20px;
}

.Completed {
  color: rgb(27, 10, 10);
  background: rgb(167, 235, 11);
  padding: 2px 10px;
  border-radius: 20px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f5efef;
}
article {
  display: grid;
  grid-template-columns: 1fr 300px;
}

td {
  cursor: pointer;
}
tr:hover {
  color: red;
}

section {
  padding: 20px;
  overflow-y: scroll;
  height: 100dvh;
  padding-bottom: 200px;
}
aside {
  padding: 10px;
}
</style>
