type Str = string & { ___?: never };

type ElementName = keyof HTMLElementTagNameMap;

type ElementInterface<T extends ElementName> = HTMLElementTagNameMap[T];

type ElementAttributeNames<T extends ElementName> =
	| keyof {
			[K in keyof ElementInterface<T>]?: ElementInterface<T>[K] extends (
				...args: never
			) => unknown
				? never
				: K;
	  }
	| Str;

type ElementFunctions<T extends ElementName> = {
	[K in keyof ElementInterface<T>]?: ElementInterface<T>[K] extends (
		...args: never
	) => unknown
		? K
		: never;
};

type ElementFunctionNames<T extends ElementName> =
	| keyof ElementFunctions<T>
	| Str;

type ElementEventNames = keyof HTMLElementEventMap;

type ClassList = (string | null | undefined | false)[];

export type ElementBuilder<TElement extends ElementName> = {
	id(id: string): ElementBuilder<TElement>;
	on<T extends ElementEventNames>(
		event: T,
		listener: (e: HTMLElementEventMap[T]) => void,
	): ElementBuilder<TElement>;
	call<
		T extends ElementFunctionNames<TElement>,
		Fn extends ElementFunctions<TElement>,
	>(
		func: T,
		...args: Fn extends (...args: never) => unknown ? Parameters<Fn> : never
	): ElementBuilder<TElement>;
	do(
		func: (element: HTMLElementTagNameMap[TElement]) => void,
	): ElementBuilder<TElement>;
	content(content: string | HTMLElement): ElementBuilder<TElement>;
	attribute<T extends ElementAttributeNames<TElement>>(
		name: T,
		value: unknown,
	): ElementBuilder<TElement>;
	attributes<T extends ElementAttributeNames<TElement>>(
		attributes: Record<T, unknown>,
	): ElementBuilder<TElement>;
	style(style: string): ElementBuilder<TElement>;
	classes(...classes: ClassList): ElementBuilder<TElement>;
	get: () => HTMLElementTagNameMap[TElement];
	mount(parent?: HTMLElement): void;
};

export const $el = <TElement extends ElementName>(
	name: TElement | Str,
): ElementBuilder<TElement> => {
	const el = document.createElement(name) as HTMLElementTagNameMap[TElement];

	type El = typeof el;

	return {
		id(id: string) {
			el.id = id;
			return this;
		},

		on(event, listener) {
			el.addEventListener(event, listener as EventListener);
			return this;
		},

		call(func, ...args) {
			const fn = el[func as keyof El];
			if (typeof fn === "function") {
				fn.apply(el, args);
			}
			return this;
		},

		do(func) {
			func(el);
			return this;
		},

		content(content) {
			if (content instanceof HTMLElement) {
				el.appendChild(content);
			} else {
				el.innerHTML = content;
			}
			return this;
		},

		attribute(name, value) {
			el.setAttribute(String(name), String(value));
			return this;
		},

		attributes(attributes) {
			for (const [k, v] of Object.entries(attributes)) {
				el.setAttribute(String(k), String(v));
			}
			return this;
		},

		style(style) {
			el.style = style;
			return this;
		},

		classes(...classes) {
			for (const cls of classes) {
				if (cls) {
					el.classList.add(cls);
				}
			}
			return this;
		},

		get: () => el,

		mount(parent = document.body) {
			parent.append(el);
		},
	};
};
