import { Driver } from "../../interfaces/IDriver";

const apiUrl = "http://localhost:8080";

// GET all drivers
export async function GetDriver() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/drivers`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET driver by ID
export async function GetDriverById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/drivers/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new driver
export async function CreateDriver(data: Driver) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/drivers`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing driver
export async function UpdateDriver(data: Driver) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/drivers/${data.ID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a driver by ID
export async function DeleteDriverById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/drivers/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? true : false));

  return res;
}
