import { createFileRoute } from "@tanstack/react-router";
import { ResultsTable } from "@/components/ResultsTable";

export const Route = createFileRoute("/_authenticated/admin/junior")({
  component: () => <ResultsTable category="junior" title="Standards 1-3 Results" />,
});
