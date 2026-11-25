# Free database setup (optional)

By default Learning Buddies saves progress **on the device** (localStorage) – no setup, no account.
To let the **teacher dashboard see every child's device**, connect the free [Supabase](https://supabase.com) database.
It works from GitHub Pages because the app talks to Supabase directly from the browser (no server needed).

## 1. Create the database (about 5 minutes)
1. Sign up at supabase.com and create a **New project** (free plan). Save the database password somewhere safe.
2. (On the new-project screen: keep **Enable Data API** ticked.) Open **SQL Editor → New query**, paste everything from [`supabase/schema.sql`](../supabase/schema.sql), click **Run**.
3. Open **Project Settings → API** and copy:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - the **anon / publishable** key
4. Paste them into `js/config.js`:
   ```js
   SUPABASE_URL: "https://abcdxyz.supabase.co",
   SUPABASE_ANON_KEY: "your-anon-or-publishable-key",
   ```
5. Commit and push. The teacher dashboard now says *"Scores are shared across devices."*

If the keys are empty, or the internet/database is unavailable, the app keeps working on the device only
and uploads any unsent records the next time it can connect.

## Important: keep the right key, and protect children's data
- The **anon / publishable** key is designed to be public (it's visible to anyone who opens the site).
  **Never** put the `service_role` / secret key in this project.
- Because the key is public, **anyone who finds it could read the saved names and scores**, and add rows.
  The SQL file blocks edits and deletes, but not reading. So:
  - Tell children/parents to use **first names or nicknames only**, never full names or personal details.
  - For a real classroom or school, check your school's privacy rules (and local child-data laws) first.
  - The teacher PIN (`1234`) only hides the dashboard screen in the browser – it is **not** security.
    For stronger protection, add Supabase Auth for the teacher and restrict the `select` policy to that user.
- Row Level Security is switched on by the SQL file. Don't turn it off.

## Free-plan notes
Supabase's free plan has size limits and may pause inactive projects – check their current pricing page.
Each record is tiny (a few hundred bytes), so a class will use very little space.
To reset: Supabase → Table Editor → `attempts` → delete rows (the app itself can't delete shared data).

## Other free options
If you prefer a different backend, only `js/services/RemoteDb.js` needs to change
(`fetchAll()` and `insert(records)`); the rest of the app doesn't care where records are stored.
