// Where the staff portal lives in the URL space.
//
// The login path is set in .env so it can be moved to something unguessable
// without a code change — it is the front door that replaces /admin/ on the
// Django side:
//
//   VITE_LOGIN_ALIAS="/DeadlyMangoZebra"
//
// Change it, rebuild, redeploy, and the old path stops resolving.
//
// The VITE_ prefix is not optional: Vite only exposes variables starting with
// VITE_ to the browser bundle. A bare LOGIN_ALIAS reads back as undefined and
// silently falls through to the default below.

function normalisePath(value: string | undefined, fallback: string): string {
  // Vite usually strips surrounding quotes, but strip them again so a value
  // written as "/Foo" can never end up as a literal /"Foo" in the route table.
  const raw = (value ?? '').trim().replace(/^["']|["']$/g, '').trim();
  if (!raw) return fallback;

  // Tolerate "staff-login", "/staff-login" and "/staff-login/" alike.
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const trimmed = withLeadingSlash.replace(/\/+$/, '');
  return trimmed || fallback;
}

/** Route of the staff login page — the alias set in .env. */
export const STAFF_LOGIN_PATH = normalisePath(
  import.meta.env.VITE_LOGIN_ALIAS,
  '/staff-login'
);

/** Base route of the authenticated staff dashboard. */
export const STAFF_PORTAL_PATH = normalisePath(
  import.meta.env.VITE_STAFF_PORTAL_PATH,
  '/admin'
);
