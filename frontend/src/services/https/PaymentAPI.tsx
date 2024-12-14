import { Payment } from "../../interfaces/IPayment";

const apiUrl = "http://localhost:8080";

// GET all payments
export async function GetPayment() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/payments`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET payment by ID
export async function GetPaymentById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/payments/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new payment
export async function CreatePayments(data: Payment) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/payments`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing payment
export async function UpdatePayments(data: Payment) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/payments/${data.ID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a payment by ID
export async function DeletePaymentsByID(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/payments/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? true : false));

  return res;
}
