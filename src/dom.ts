const parser = new DOMParser();

export const $parseElement = (html: string): HTMLElement | Node | null => {
	const dom = parser.parseFromString(html, "text/html");
	const first = dom.body.firstChild;

	return first instanceof HTMLElement ? (first as HTMLElement) : first;
};

export const $parseDom = (html: string): Document => {
	return parser.parseFromString(html, "text/html");
};
