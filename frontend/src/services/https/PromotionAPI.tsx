import { PromotionInterface } from "../../interfaces/IPromotion";

const apiUrl = "http://localhost:8080";

// GET all promotions
export async function GetPromotion() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/promotions`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET promotion by ID
export async function GetPromotionById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/promotions/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new promotion
export async function CreatePromotion(data: PromotionInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/promotions`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing promotion
export async function UpdatePromotion(data: PromotionInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/promotions/${data.id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a promotion by ID
export async function DeletePromotionById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/promotions/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? true : false));

  return res;
}
