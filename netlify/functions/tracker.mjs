import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("mythfolk");
  const read = async () => (await store.get("data", { type: "json" })) || { marks: {} };
  if (req.method === "GET") return Response.json(await read());
  const b = await req.json();
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass || b.password !== pass) return new Response("Not allowed", { status: 401 });
  if (b.check) return Response.json({ ok: true });
  const d = await read();
  if (b.value) d.marks[b.key] = b.value; else delete d.marks[b.key];
  await store.setJSON("data", d);
  return Response.json({ ok: true });
};

export const config = { path: "/api/tracker" };
