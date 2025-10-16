import { fetchDepth, fetchFill } from "@/lib/api";
import { Charts } from "@/component/Charts";

export default async function Page() {
  let depth = []
  let fills = []
  try {
    depth = await fetchDepth()
    fills = await fetchFill()
  } catch {
    window.alert("There has been an error fetching data")
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