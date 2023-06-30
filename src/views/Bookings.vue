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

  pb.collection("bookings").subscribe("*", async function ({action, record}) {
    if(action == "update"){
      bookings.value.forEach(async (book, id) => {
        if(book.id == record.id){
          await pb.collection("bookings").getOne(book.id, {
            expand: "student,computer"
          }).then((result) => {
            bookings.value[id] = result;
          })
        }
      })
    }else 
    if(action == "delete"){
      bookings.value.forEach((book, id) => {
        if(book.id == record.id){
          bookings.value.splice(id, 1);
        }
      })
    }
    else if(action == "create"){

      await pb.collection("bookings").getOne(record.id,{
        expand: "student,computer"
      }).then((result) => {
        bookings.value.push(result);
      });
    }
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

let code = "BC-";

const Accept = async (BookingId, index) => {
  await pb.collection("bookings").update(BookingId, {
    "status": "Accepted",
  }).then(result => {
    console.log(result);
    if (result) {
      bookings.value.forEach((book, id) => {
        if(book.id == BookingId){
          bookings.value[id].status = "Accepted"
        }
      })
    }
  })
  console.log("Accepted");
}
const Complete = async (BookingId, index) => {
  await pb.collection("bookings").update(BookingId, {
    "status": "Completed",
  }).then(result => {
    console.log(result);
    if (result) {
      bookings.value.forEach((book, id) => {
        if(book.id == BookingId){
          bookings.value[id].status = "Completed"
        }
      })
    }
  })
  console.log("Accepted");
}

</script>

<template>
  <TitleBar title="Bookings" />

  <article>
    <section>
      <table>
        <tr>
          <th>Booking Code</th>
          <th>Computer</th>
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
          <td>
            <b>{{ Booking.booking_code }}</b>
          </td>
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
      <div class="form">
        <input
          type="text"
          placeholder="Search Bookings By Code"
          class="search"
          v-model="code"
        />
        <button @click="searchFromSideBar(code)">Search</button>
      </div>
      <div class="pc-c" v-for="searched , index  in searchedBookings" :key="searched.id">
        <div class="pc">
          <div>
            {{ searched.booking_code }}
          </div>
          <div>
            {{ searched.expand?.computer?.display_name }}
          </div>
          <div>
            {{ new Date(searched.start_time).toLocaleTimeString() }}
          </div>

          <div>
            {{ new Date(searched.end_time).toLocaleTimeString() }}
          </div>
          <div style="color: green; font-weight: bolder;">
            {{ searched.status }}
          </div>
        </div>
        <div>
          {{ searched.expand?.student?.name }}
        </div>
        <button v-if="searched.status == 'Pending'" @click="Accept(searched.id, index)">Accept</button>
        <button v-if="searched.status == 'Accepted'" @click="Complete(searched.id, index)">Complete</button>
      </div>
    </aside>
  </article>
</template>

<style>
.form{
  display: flex;
}

.form button{
  border-radius: 0;
}

.form input{
  border-radius: 0;
  border: 0;
  background: rgb(236, 241, 212);
  padding: 10px;
}

.pc-c {
  display: grid;
  gap: 20px;
  background: #dddddd;
  padding: 10px;
  margin-top: 20px;
}

.pc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

button {
  background: rgb(226, 125, 43);
  border-radius: 0;
}
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
