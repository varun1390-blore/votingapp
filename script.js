// Daily Quote Generator
//
// How the daily quote works:
// 1) We compute a deterministic index for "today" by hashing the local date string
//    (YYYY-MM-DD) and taking the remainder with the number of quotes. That means the
//    same quote will be selected for the entire day without needing localStorage or a server.
// 2) We schedule a timer to fire at the next local midnight. When it triggers, we
//    recompute the daily index and update the displayed quote, so it changes automatically.
// 3) The "Show New Quote" button simply shows a random quote immediately without
//    refreshing the page. At midnight, the daily quote will take over again.

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can, or you think you can't—you're right.", author: "Henry Ford" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Light tomorrow with today.", author: "Elizabeth Barrett Browning" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "No pressure, no diamonds.", author: "Thomas Carlyle" },
  { text: "Stay hungry. Stay foolish.", author: "Steve Jobs" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.", author: "James Baldwin" }
];

const quoteTextEl = document.getElementById("quoteText");
const quoteAuthorEl = document.getElementById("quoteAuthor");
const dailyBadgeEl = document.getElementById("dailyBadge");
const newQuoteBtn = document.getElementById("newQuoteBtn");

let lastShownIndex = null;

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Local date
}

function hashStringToInt(input) {
  // djb2-inspired hash, returns a non-negative 32-bit integer
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) + hash + input.charCodeAt(i);
    hash |= 0; // force 32-bit integer
  }
  return Math.abs(hash);
}

function getDailyIndex() {
  const todayKey = getTodayKey();
  return hashStringToInt(todayKey) % quotes.length;
}

function applyFadeInAnimation() {
  quoteTextEl.classList.remove("fade-in");
  quoteAuthorEl.classList.remove("fade-in");
  // Force reflow so the animation can restart
  void quoteTextEl.offsetWidth;
  quoteTextEl.classList.add("fade-in");
  quoteAuthorEl.classList.add("fade-in");
}

function setQuoteByIndex(index, isDaily) {
  const quote = quotes[index];
  quoteTextEl.textContent = `“${quote.text}”`;
  quoteAuthorEl.textContent = quote.author ? `— ${quote.author}` : "";
  dailyBadgeEl.style.visibility = isDaily ? "visible" : "hidden";
  lastShownIndex = index;
  applyFadeInAnimation();
}

function showDailyQuote() {
  const index = getDailyIndex();
  setQuoteByIndex(index, true);
}

function showRandomQuote() {
  let index = Math.floor(Math.random() * quotes.length);
  if (quotes.length > 1) {
    // try to avoid repeating the same quote immediately
    let safety = 0;
    while (index === lastShownIndex && safety < 10) {
      index = Math.floor(Math.random() * quotes.length);
      safety += 1;
    }
  }
  setQuoteByIndex(index, false);
}

function msUntilNextLocalMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0); // next local midnight
  return nextMidnight.getTime() - now.getTime();
}

function scheduleMidnightRefresh() {
  const delay = msUntilNextLocalMidnight();
  setTimeout(() => {
    showDailyQuote();
    scheduleMidnightRefresh();
  }, delay);
}

newQuoteBtn.addEventListener("click", showRandomQuote);

// Initial render
showDailyQuote();
// Auto-refresh at local midnight
scheduleMidnightRefresh();