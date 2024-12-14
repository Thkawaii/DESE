import { Passenger } from "../../interfaces/IPassenger";

const apiUrl = "http://localhost:8080";

// GET all passengers
export async function GetPassenger() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/passengers`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET passenger by ID
export async function GetPassengerById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/passengers/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new passenger
export async function CreatePassenger(data: Passenger) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/passengers`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing passenger
export async function UpdatePassenger(data: Passenger) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/passengers/${data.ID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a passenger by ID
export async function DeletePassengerById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/passengers/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? true : false));

  return res;
}
