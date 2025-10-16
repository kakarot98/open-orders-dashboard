"use client"
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useMemo } from "react"

type DepthPoint = { ts: number | string; buy: number; sell: number }
type FillPoint = { ts: number | string; volume: number }

const toEpoch = (t: number | string) => (typeof t === "string" ? Date.parse(t) : t) //converting to epoch numbers to feed the chart x-axis

const BUCKET_MS = 60000 // creates a bucket of 60 second window, so that both the fill and depth data can be shown in same time windows

//snaps the timestamp to the down to the start of its 30 seconds window
const bucket = (ts: number, sizeMs = BUCKET_MS) => Math.floor(ts / sizeMs) * sizeMs

export function Charts({
  depth,
  fills,
}: {
  depth: DepthPoint[]
  fills: FillPoint[]
}) {

  //creating a single array to be given to ComposedChart
  const merged = useMemo(() => {
    //obj to store both depth and fill data
    const map = new Map<number,{ ts: number; buy?: number; sell?: number; volume?: number }>()


    //for every t, it will store the latest depthbuy and sell data for the time bucket
    for (const d of depth) {
      const t = bucket(toEpoch(d.ts))
      const prev = map.get(t) ?? { ts: t }
      map.set(t, { ...prev, buy: d.buy, sell: d.sell })
    }

    //fill gets accumulated for that very window
    for (const f of fills) {
      const t = bucket(toEpoch(f.ts))
      const prev = map.get(t) ?? { ts: t }
      map.set(t, { ...prev, volume: (prev.volume ?? 0) + f.volume })
    }


    return [...map.values()]
      .filter((r) => Number.isFinite(r.ts)) //for bad timespamp
      .sort((a, b) => a.ts - b.ts) //ensuring chronology
  }, [depth, fills])


  //formatting the timestamp in readable format for ease of reading
  const formatTs = (t: number) =>
    new Date(t).toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "2-digit",
    })

    return (
    <div className="card">
      <h2 className="text-sm font-medium mb-2">
        Open Order Depth + Fill Volume
      </h2>
      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={merged}
            barCategoryGap="1%"
            barGap={0}
            margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ts"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTs}
              tickCount={6}
              height={50}
              tick={{
                fontSize: 13,
                fill: "#475569"
              }}
            />

            {/* Left Y axis for the depth dta indicator */}
            <YAxis
              yAxisId="left"
              tickCount={6}
              width={50}
              stroke="#64748b"
              tickFormatter={(v) => v.toLocaleString()}
              allowDataOverflow={false}
              domain={[0, "auto"]}
              tick={{fontSize: 13, fill: "#475569"}}
            />

            {/* Obviously the right Yaxis for fill quantity  */}
            <YAxis
              yAxisId="right"
              orientation="right"
              width={35}
              stroke="#94a3b8"
              tickFormatter={(v) => v.toLocaleString()}
              allowDataOverflow={false}
              domain={[0, "auto"]}
              tick={{fontSize: 13, fill: "#475569"}}
            />
            <Tooltip
              labelFormatter={(v) => formatTs(Number(v))}
              formatter={(v: any, name: string) => [v, name]}
            />
            <Legend verticalAlign="top" align="center" wrapperStyle={{padding: 15, fontSize: 13}} />

            {/* Bars in the background */}
            <Bar
              yAxisId="right"
              dataKey="volume"
              name="Fill Volume"
              fill="#a3a3a3"
              barSize={6}
              maxBarSize={8}
              fillOpacity={0.3}
              stroke="none"
              isAnimationActive={false}
            />

            {/* Depth lines in the foreground */}
            <Line
              yAxisId="left"
              type="linear"
              dataKey="buy"
              name="Buy Depth"
              stroke="#2563eb"
              strokeWidth={1.8}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="linear"
              dataKey="sell"
              name="Sell Depth"
              stroke="#dc2626"
              strokeWidth={1.8}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}