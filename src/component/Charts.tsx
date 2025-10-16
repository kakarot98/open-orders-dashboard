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
import { useBreakpoint } from "@/lib/utils"

type DepthPoint = { ts: number | string; buy: number; sell: number }
type FillPoint = { ts: number | string; volume: number }

const toEpoch = (t: number | string) => (typeof t === "string" ? Date.parse(t) : t) //converting to epoch numbers to feed the chart x-axis

const BUCKET_MS = 30_000 // creates a bucket of 30 second window, so that both the fill and depth data can be shown in same time windows

//snaps the timestamp to the down to the start of its 30 seconds window
const bucket = (ts: number, sizeMs = BUCKET_MS) => Math.floor(ts / sizeMs) * sizeMs

export function Charts({
  depth,
  fills,
}: {
  depth: DepthPoint[]
  fills: FillPoint[]
}) {

  //get the screen width of device
  const {isSm, isMd} = useBreakpoint()


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

    const tickFont = {fontSize: isSm ? 11 : 13, fill: "#475569"}
    
    return (
    <div className="card">
      <h2 className="text-sm sm:text-base font-medium mb-2">
        Open Order Depth + Fill Volume
      </h2>
      <div style={{ width: "100%", height: 380, overflow: "hidden" }}>
        <ResponsiveContainer>
          <ComposedChart
            data={merged}
            barCategoryGap="1%"
            barGap={0}
            margin={{ top: 20, right: isSm ? 20 : 40, left: isSm ? 12 : 20, bottom: isSm ? 12 : 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="ts"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTs}
              tickCount={isSm ? 3 : isMd ? 5 : 20} //This only TRIES to put these many ticks, but mostly will only fit enough to be visible and clean
              height={isSm ? 38 : 50}
              tick={tickFont}
            />

            {/* Left Y axis for the depth dta indicator */}
            <YAxis
              yAxisId="left"
              tickCount={6}
              width={isSm ? 40 : 50}
              stroke="#64748b"
              tickFormatter={(v) => v.toLocaleString()}
              allowDataOverflow={false}
              domain={[0, "auto"]}
              tick={tickFont}
            />

            {/* Obviously the right Yaxis for fill quantity  */}
            <YAxis
              yAxisId="right"
              orientation="right"
              width={isSm ? 32 : 40}
              stroke="#94a3b8"
              tickFormatter={(v) => v.toLocaleString()}
              allowDataOverflow={false}
              domain={[0, "auto"]}
              tick={tickFont}
            />
            <Tooltip
              labelFormatter={(v) => formatTs(Number(v))}
              formatter={(v: any, name: string) => [v, name]}
              wrapperStyle={{
                fontSize: isSm ? 11 : 12
              }}
            />
            <Legend verticalAlign="top" align="center" wrapperStyle={{padding: isSm ? 8 : 12, fontSize: isSm ? 11 : 13}} height={isSm ? 24 : 32} />

            {/* Bars in the background */}
            <Bar
              yAxisId="right"
              dataKey="volume"
              name="Fill Volume"
              fill="#a3a3a3"
              barSize={isSm ? 5 : 6}
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