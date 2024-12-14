import { Booking } from "../../interfaces/IBooking";

const apiUrl = "http://localhost:8080";

// GET all bookings
export async function GetBooking() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/bookings`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET booking by ID
export async function GetBookingById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/bookings/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new booking
export async function CreateBooking(data: Booking) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/bookings`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing booking
export async function UpdateBooking(data: Booking) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/bookings/${data.BookingID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a booking by ID
export async function DeleteBookingById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/bookings/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? true : false));

  return res;
}
