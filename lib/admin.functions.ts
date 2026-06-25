import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string }) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const expected = process.env.ADMIN_SIGNUP_CODE;
    if (!expected) throw new Error("Admin signup not configured");
    if (data.code.trim() !== expected.trim()) {
      throw new Error("Invalid admin code");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    // ignore unique violation - already admin
    if (error && !String(error.message).toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
    return { ok: true };
  });
