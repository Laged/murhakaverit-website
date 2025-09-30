# Static Export Behavior Notes

## ⚠️ Expected Behaviors (Not Bugs!)

### 1. Dev Server Shows Warnings About `generateStaticParams`

**Error you see:**
```
⨯ Failed to generate static paths for /notes/[...slug]:
[Error: Page "/notes/[...slug]/page" is missing param "/notes/[...slug]" in "generateStaticParams()", which is required with "output: export" config.]
```

**This is normal!**
- Next.js dev server with `output: 'export'` shows this warning
- It doesn't break anything - just a noisy warning
- The function IS there (line 16 of `src/app/notes/[...slug]/page.tsx`)
- Only matters during build, not dev
- Build works perfectly ✅

### 2. 404 Routes Return 200 in Dev Server

**Behavior:**
```
GET /notes/999/non-existent 200 in 1124ms
```

**This is normal for Next.js dev mode!**

#### Why This Happens

According to [Next.js documentation](https://nextjs.org/docs/app/api-reference/file-conventions/not-found):

> **not-found.js returns:**
> - `200` HTTP status code for **streamed responses** (dev mode)
> - `404` HTTP status code for **non-streamed responses** (production build)

Dev server streams responses, so you see 200. Production static export doesn't stream, so it returns proper 404!

#### How 404s Work in Production

When deployed to a static host:

1. **Build generates `404.html`** ✅
   ```bash
   ls out/*.html
   # Shows: 404.html, index.html
   ```

2. **Static hosts serve 404.html for unknown routes**
   - Vercel, Netlify, GitHub Pages all do this automatically
   - Web server returns proper 404 status code
   - User sees not-found page

3. **Client-side routing handles navigation**
   - `notFound()` is called in page component
   - Renders not-found page content
   - URL stays as-is (no redirect)

### 3. How We Handle 404s

#### In Development
- Non-existent routes → 200 status (expected)
- Page calls `notFound()` → shows not-found UI
- Tests check for not-found content (not status code)

#### In Production Build
- Next.js generates `out/404.html`
- Static host (Vercel, etc.) serves it with 404 status
- Users see proper error page

#### Code Implementation

**src/app/notes/[...slug]/page.tsx:**
```typescript
export async function generateStaticParams() {
  const summaries = await getNoteSummaries();
  return summaries.map((summary) => ({ slug: summary.slugSegments }));
}

// Prevent dynamic route generation for non-existent paths
export const dynamicParams = false;

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound(); // Triggers not-found.tsx rendering with 404 status in production
  }
  // ...
}
```

**src/app/not-found.tsx:**
```typescript
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Note Not Found",
};

export default function NotFound() {
  return (
    <section>
      <h1>404 - Note missing</h1>
      <p>That vault entry is not available.</p>
      <Link href="/">Return to Home</Link>
    </section>
  );
}
```

**Best Practices Applied:**
- ✅ Added metadata for SEO
- ✅ Included navigation link to home
- ✅ User-friendly error message
- ✅ Proper semantic HTML structure

---

## ✅ Summary

| Behavior | Dev Server | Production Build |
|----------|-----------|------------------|
| Valid route | 200 ✅ | 200 ✅ |
| Invalid route HTTP status | 200 ⚠️ | 404 ✅ |
| Invalid route UI | Shows not-found page ✅ | Shows not-found page ✅ |
| `generateStaticParams` warning | Shows warning ⚠️ | No warning ✅ |

**Bottom line:** Everything is working correctly! The warnings and 200 status in dev are expected Next.js behavior with static exports.

---

## 🔧 Testing 404 Behavior

### In Development
```bash
# Test shows not-found content (not status code)
curl http://localhost:3000/notes/999/non-existent | grep -i "not found"
```

### In Production
```bash
# Build and serve
bun run build
npx serve out

# Test returns proper 404 status
curl -I http://localhost:3000/notes/999/non-existent
# HTTP/1.1 404 Not Found ✅
```

### In Tests
Our tests check for not-found **content**, not status codes:
```typescript
test('404 page should work for non-existent notes', async ({ page }) => {
  await page.goto('/notes/999/non-existent');
  const bodyText = await page.textContent('body');
  expect(bodyText?.toLowerCase()).toMatch(/404|not found/);
});
```

---

## 📚 References

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [notFound()](https://nextjs.org/docs/app/api-reference/functions/not-found)