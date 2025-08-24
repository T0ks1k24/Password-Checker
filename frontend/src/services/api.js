export async function checkPassword(password) {
  const res = await fetch("http://localhost:8000/api/check-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return await res.json();
}
