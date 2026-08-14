import { createRequire } from "node:module";
import { Marked } from "marked";
import { createHighlighter, type Highlighter } from "shiki";

// sanitize-html is CommonJS ("main": "index.js", no "type": "module"). A bare
// import() goes through Vite's SSR dep optimizer, whose ESM-wrapped copy calls
// require() at top level → "require is not defined" in dev. Node's own
// createRequire bypasses Vite entirely and loads the real CJS file; the Vercel
// adapter bundles it as an external, where plain require works too.
const nodeRequire = createRequire(import.meta.url);

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [
        "javascript",
        "typescript",
        "svelte",
        "html",
        "css",
        "json",
        "bash",
        "markdown",
        "python",
        "sql",
      ],
    });
  }
  return highlighterPromise;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface ProcessedMarkdown {
  html: string;
  wordCount: number;
  readingTimeMinutes: number;
  toc: TocItem[];
}

const sanitizeOptions: any = {
  allowedTags: [
    "p",
    "br",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "figure",
    "figcaption",
    "hr",
    "strong",
    "em",
    "del",
    "code",
    "pre",
    "button",
    "blockquote",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "ul",
    "ol",
    "li",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel", "class"],
    img: [
      "src",
      "alt",
      "title",
      "loading",
      "decoding",
      "width",
      "height",
      "data-pswp-src",
    ],
    th: ["class"],
    td: ["class"],
    button: ["data-copy", "type", "class"],
    code: ["class"],
    pre: ["class"],
    span: ["class"],
    div: ["class"],
    p: ["class"],
    figure: ["class"],
    figcaption: ["class"],
    h1: ["class", "id"],
    h2: ["class", "id"],
    h3: ["class", "id"],
    h4: ["class", "id"],
    h5: ["class", "id"],
    h6: ["class", "id"],
    blockquote: ["class"],
    table: ["class"],
    hr: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
  allowProtocolRelative: false,
};

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") ||
    `heading-${Math.random().toString(36).slice(2, 8)}`
  );
}

/**
 * Renders markdown to HTML with heading ids + TOC + syntax highlighting.
 */
export async function processMarkdown(
  markdownText: string,
): Promise<ProcessedMarkdown> {
  if (!markdownText) {
    return { html: "", wordCount: 0, readingTimeMinutes: 0, toc: [] };
  }

  const plainText = markdownText
    .replace(/<[^>]*>/g, "")
    .replace(/[#*`_~\[\]()]/g, "");
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const toc: TocItem[] = [];
  const seenIds = new Set<string>();

  const marked = new Marked();

  const renderer = {
    heading({ text, depth }: { text: string; depth: number }) {
      let id = slugify(text);
      while (seenIds.has(id)) {
        id = `${id}-${seenIds.size + 1}`;
      }
      seenIds.add(id);

      if (depth <= 3) {
        toc.push({ id, text, level: depth });
      }

      return `<h${depth} id="${id}" class="group relative font-bold text-white font-['Space_Grotesk'] mt-8 mb-4 tracking-tight">
				<a href="#${id}" class="no-underline text-white hover:text-red-400">
					${text}
				</a>
			</h${depth}>`;
    },

    link({
      href,
      title,
      tokens,
    }: {
      href: string;
      title?: string | null;
      tokens: any;
    }) {
      const anyThis = this as any;
      const text = anyThis.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href);
      const target = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${href}"${target} class="${external ? "md-link md-link-external" : "md-link"}">${title ? `<span class="md-link-title">${title}</span>` : ""}${text}</a>`;
    },

    image({
      href,
      title,
      text,
    }: {
      href: string;
      title: string | null;
      text: string;
    }) {
      const alt = title || text || "";

      return `<figure class="my-6 rounded-2xl overflow-hidden border border-[#222222] bg-[#121212]">
				<img
					src="${href}"
					alt="${alt}"
					loading="lazy"
					decoding="async"
					class="w-full h-auto object-cover rounded-2xl cursor-zoom-in transition-transform hover:scale-[1.01]"
					data-pswp-src="${href}"
				/>
			</figure>`;
    },

    blockquote({ text }: { text: string }) {
      return `<blockquote class="my-6 border-l-4 border-red-500/80 bg-red-500/5 p-4 rounded-r-xl text-xs font-mono text-[#ededed] italic space-y-2">
				${text}
			</blockquote>`;
    },

    table(token: any) {
      const header = token.header
        .map((cell: any) => `<th class="px-4 py-3 text-left">${cell.text}</th>`)
        .join("");
      const rows = token.rows
        .map(
          (row: any) =>
            `<tr class="border-b border-[#1e1e1e]">${row.map((cell: any) => `<td class="px-4 py-3">${cell.text}</td>`).join("")}</tr>`,
        )
        .join("");

      return `<div class="my-6 overflow-x-auto rounded-2xl border border-[#222222] bg-[#121212]">
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#181818] font-mono text-[#888888] uppercase border-b border-[#222222]">
						<tr>${header}</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						${rows}
					</tbody>
				</table>
			</div>`;
    },
  };

  marked.use({ renderer });

  const rawHtml = await marked.parse(markdownText);

  let sanitized = rawHtml;
  try {
    const sanitizeHtml = nodeRequire("sanitize-html");
    sanitized = sanitizeHtml(rawHtml, sanitizeOptions);
  } catch (err) {
    console.warn(
      "[processor] sanitize-html failed, using marked output directly:",
      err,
    );
  }

  // Add Shiki Syntax Highlighting & Copy Code Button to code blocks
  let finalHtml = sanitized;
  try {
    const hl = await getHighlighter();
    finalHtml = sanitized.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (_, lang, code) => {
        const decodedCode = code
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"');
        let highlighted = decodedCode;
        try {
          highlighted = hl.codeToHtml(decodedCode, {
            lang: lang || "text",
            theme: "github-dark",
          });
        } catch {
          highlighted = `<pre><code>${code}</code></pre>`;
        }

        return `<div class="not-prose relative group my-8 rounded-2xl border border-[#222222] bg-[#090909] overflow-hidden">
				<div class="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#222222] text-[11px] font-mono text-[#777777] uppercase tracking-wider">
					<span>${lang || "code"}</span>
					<button data-copy type="button" class="px-2.5 py-1 rounded-md bg-[#222222] hover:bg-[#2a2a2a] text-[#ededed] transition-colors cursor-pointer inline-flex items-center gap-1.5">
						<span class="md-copy-icon"><!-- lucide Copy/Check mounted by MarkdownContent --></span>
						<span class="copy-label font-sans capitalize">Copy</span>
					</button>
				</div>
				<div class="p-5 overflow-x-auto text-sm font-mono leading-relaxed [&>pre]:m-0! [&>pre]:p-0! [&>pre]:bg-transparent!">
					${highlighted}
				</div>
			</div>`;
      },
    );
  } catch (e) {
    console.warn("[Shiki] Syntax highlighting failed:", e);
  }

  return {
    html: finalHtml,
    wordCount,
    readingTimeMinutes,
    toc,
  };
}
