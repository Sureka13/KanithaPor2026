import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Administrator Sign In — KanithaPor 2026" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function requireAdminAccess() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Signed in, but no user session was found.");
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);

    if (rolesError) throw rolesError;

    const isAdmin = (roles ?? []).some((role) => role.role === "admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      throw new Error("This account does not have admin access yet. Contact your administrator for an admin account.");
    }
  }

  function getFriendlyError(err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed";

    if (message.includes("Invalid login credentials")) {
      return "Wrong email or password.";
    }
    if (message.includes("Email not confirmed")) {
      return "This email is not confirmed yet. Confirm it first, then sign in again.";
    }
    return message;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await requireAdminAccess();
      navigate({ to: "/admin" });
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-hero px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/95 p-7 shadow-glow backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-20 w-auto" />
          <h1 className="mt-3 font-display text-xl font-bold">Administrator Access</h1>
          <p className="text-xs text-muted-foreground">Restricted area · staff only</p>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
          />
          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-cta px-4 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Contact your administrator to create an admin account.
        </p>
      </div>
    </div>
  );
}
