import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { claimAdminRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Administrator Sign In — KanithaPor 2026" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const claim = useServerFn(claimAdminRole);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
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
      throw new Error("This account does not have admin access yet. Use Register Admin first, or add the admin role in Supabase.");
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
    if (message.includes("Admin signup not configured")) {
      return "Admin registration is not configured yet. Add ADMIN_SIGNUP_CODE to your .env file first.";
    }
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return "Admin registration is not configured yet. Add SUPABASE_SERVICE_ROLE_KEY to your .env file first.";
    }
    if (message.includes("Invalid admin code")) {
      return "The admin invitation code is incorrect.";
    }

    return message;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await requireAdminAccess();
      } else {
        const signInResult = await supabase.auth.signInWithPassword({ email, password });

        if (signInResult.error) {
          const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { emailRedirectTo: window.location.origin + "/admin" },
          });
          if (error) throw error;
          if (!data.session) {
            throw new Error("Account created. Confirm the email first, then sign in again to finish admin access.");
          }
        }

        await claim({ data: { code } });
        await requireAdminAccess();
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(getFriendlyError(err));
    } finally { setBusy(false); }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-hero px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/95 p-7 shadow-glow backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-20 w-auto" />
          <h1 className="mt-3 font-display text-xl font-bold">Administrator Access</h1>
          <p className="text-xs text-muted-foreground">Restricted area · staff only</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
          <button onClick={() => setMode("signin")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Sign In</button>
          <button onClick={() => setMode("signup")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Register Admin</button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <input type="password" required placeholder="Password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          {mode === "signup" && (
            <input type="text" required placeholder="Admin invitation code" value={code} onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          )}
          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-cta px-4 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60">
            {busy ? "…" : mode === "signin" ? "Sign In" : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
