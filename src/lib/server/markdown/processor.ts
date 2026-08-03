import { marked } from 'marked';
import { createHighlighter } from 'shiki';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark'],
			langs: ['javascript', 'typescript', 'svelte', 'html', 'css', 'json', 'bash', 'markdown', 'python', 'sql']
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

export async function processMarkdown(markdownText: string): Promise<ProcessedMarkdown> {
	if (!markdownText) {
		return { html: '', wordCount: 0, readingTimeMinutes: 0, toc: [] };
	}

	const plainText = markdownText.replace(/<[^>]*>/g, '').replace(/[#*`_~\[\]()]/g, '');
	const words = plainText.trim().split(/\s+/).filter(Boolean);
	const wordCount = words.length;
	const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

	const toc: TocItem[] = [];

	// Configure marked renderer for custom heading IDs & syntax highlighting
	const renderer = new marked.Renderer();

	renderer.heading = (item: any) => {
		const text = item.text || '';
		const level = item.depth || item.level || 2;
		const id = text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');

		if (level <= 3) {
			toc.push({ id, text, level });
		}

		return `<h${level} id="${id}" class="group relative font-bold text-white font-['Space_Grotesk'] mt-8 mb-4 tracking-tight">
			<a href="#${id}" class="no-underline text-white hover:text-red-400">
				${text}
			</a>
		</h${level}>`;
	};

	renderer.image = (item) => {
		const href = item.href || '';
		const title = item.title || item.text || '';
		const isWebp = href.endsWith('.webp') || href.includes('opt_');

		return `<figure class="my-6 rounded-2xl overflow-hidden border border-[#222222] bg-[#121212]">
			<img
				src="${href}"
				alt="${title}"
				loading="lazy"
				decoding="async"
				class="w-full h-auto object-cover rounded-2xl cursor-zoom-in transition-transform hover:scale-[1.01]"
				data-pswp-src="${href}"
			/>
			${title ? `<figcaption class="p-2 text-center text-xs font-mono text-[#777777] border-t border-[#1a1a1a]">${title}</figcaption>` : ''}
		</figure>`;
	};

	renderer.blockquote = (item) => {
		return `<blockquote class="my-6 border-l-4 border-red-500/80 bg-red-500/5 p-4 rounded-r-xl text-xs font-mono text-[#ededed] italic space-y-2">
			${item.text}
		</blockquote>`;
	};

	renderer.table = (item) => {
		return `<div class="my-6 overflow-x-auto rounded-2xl border border-[#222222] bg-[#121212]">
			<table class="w-full text-left text-xs text-[#ededed]">
				<thead class="bg-[#181818] font-mono text-[#888888] uppercase border-b border-[#222222]">
					${item.header}
				</thead>
				<tbody class="divide-y divide-[#1e1e1e]">
					${item.rows}
				</tbody>
			</table>
		</div>`;
	};

	marked.use({ renderer });

	let rawHtml = await marked.parse(markdownText);

	// Add Shiki Syntax Highlighting & Copy Code Button to code blocks
	try {
		const hl = await getHighlighter();
		rawHtml = rawHtml.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (_, lang, code) => {
			const decodedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
			let highlighted = decodedCode;
			try {
				highlighted = hl.codeToHtml(decodedCode, { lang: lang || 'text', theme: 'github-dark' });
			} catch {
				highlighted = `<pre><code>${code}</code></pre>`;
			}

			return `<div class="relative group my-6 rounded-2xl border border-[#222222] bg-[#090909] overflow-hidden text-xs">
				<div class="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#222222] text-[10px] font-mono text-[#777777]">
					<span>${lang || 'code'}</span>
					<button
						onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000)"
						class="px-2 py-0.5 rounded bg-[#222222] hover:bg-[#2a2a2a] text-[#ededed] transition-colors cursor-pointer"
					>
						Copy
					</button>
				</div>
				<div class="p-4 overflow-x-auto font-mono leading-relaxed">
					${highlighted}
				</div>
			</div>`;
		});
	} catch (e) {
		console.warn('[Shiki] Syntax highlighting failed:', e);
	}

	return {
		html: rawHtml,
		wordCount,
		readingTimeMinutes,
		toc
	};
}
