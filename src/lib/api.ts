import { DepthPoint, FillPoint } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchDepth(): Promise<DepthPoint[]> {
  type Raw = { time: string; depth_buy: number; depth_sell: number };
  const raw = await getJSON<Raw[]>("/depth");
  return raw.map(d => ({
    ts: Date.parse(d.time),
    buy: d.depth_buy,
    sell: d.depth_sell,
  }));
}

export async function fetchFill(): Promise<FillPoint[]> {
  type Raw = { time: string; price: number; qty: number };
  const raw = await getJSON<Raw[]>("/fill");
  return raw.map(f => ({
    ts: Date.parse(f.time),
    volume: f.qty,
  }));
}