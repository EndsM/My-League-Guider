export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="BP Voice"
            desc="Audio input and output for BP choices"
          />
          <DashboardCard
            title="Live Context"
            desc="Current version's hero stats integration"
          />
          <DashboardCard
            title="BYOK"
            desc="Bring Your Own Key & customizable endpoints"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-card text-card-foreground border p-6 shadow">
      <h3 className="mb-2 leading-none font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}
