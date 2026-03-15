export function $get<T extends `#${string}`>(selector: T): HTMLElement | null;
export function $get<T extends string>(selector: T): Element | null;

export function $get(selector: string): Element | null {
	return selector.startsWith("#")
		? document.getElementById(selector.substring(1))
		: document.querySelector(selector);
}

export const $getAll = (selector: string) => {
	return [...document.querySelectorAll(selector)];
};
