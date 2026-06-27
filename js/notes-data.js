/**
 * NOTES DATA
 * ══════════════════════════════════════════════════════
 * وقتی نوت جدید اضافه می‌کنی:
 *   1. یه فایل HTML توی pages/notes/ بساز
 *   2. یه آبجکت جدید به ابتدای این آرایه اضافه کن (جدیدترین اول)
 *   3. تمام — notes.html و homepage خودکار آپدیت میشن
 * ══════════════════════════════════════════════════════
 */

const NOTES = [
  {
    title: "How I Set Up This Website",
    topic: "Meta · Web",
    topicFilters: ["Meta", "Software"],
    desc: "Plain HTML, CSS, and GitHub Pages — no frameworks, no build step. Here's why and how.",
    date: "Jun 2026",
    readTime: "5 min read",
    href: "notes/test-note.html",       // مسیر نسبی از پوشه pages/
    thumb: null,                         // مسیر عکس — مثلاً: "../assets/images/note-test-thumb.jpg"
    thumbEmoji: "🌐",                    // اگه thumb نداری، ایموجی نشون میده
    thumbBg: "#1a1a2e",
  },
  {
    title: "Java Memory Model",
    topic: "Java · Software",
    topicFilters: ["Java", "Software"],
    desc: "A deep dive into how Java handles memory, threads, and visibility — and why it matters for correct concurrent code.",
    date: "Jun 2026",
    readTime: "12 min read",
    href: "notes/java-memory-model.html",
    thumb: null,
    thumbEmoji: null,                    // null = نشون میده code snippet پیشفرض
    thumbBg: "#0D1117",
  },
];
