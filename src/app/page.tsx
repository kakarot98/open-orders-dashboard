import { fetchDepth, fetchFill } from "@/lib/api";
import { Charts } from "@/component/Charts";
import { DepthPoint, FillPoint } from "@/lib/types";

export default async function Page() {
  let depth: DepthPoint[] = []
  let fills: FillPoint[] = []
  try {
    depth = await fetchDepth()
    fills = await fetchFill()
  } catch {
    return (
      <main className="space-y-3">
      <div className="card">
        Failed to fetch from the backend
      </div>
    </main>
    )
  }

  return (
    <main className="space-y-3">
      <div className="card">
        <p className="text-sm text-gray-700">
          Data source: <code>GET /depth</code> and <code>GET /fill</code> from the provided mock server in Rust.
        </p>
      </div>
      <Charts depth={depth} fills={fills} />
    </main>
  );
}