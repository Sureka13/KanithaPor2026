import { createFileRoute } from "@tanstack/react-router";
import { ResultsTable } from "@/components/ResultsTable";

export const Route = createFileRoute("/_authenticated/admin/senior")({
  component: () => <ResultsTable category="senior" title="Standards 4-6 Results" />,
});
