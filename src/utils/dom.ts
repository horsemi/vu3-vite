import { camelize } from 'vue';

export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

const trim = function (s: string) {
	return (s || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

export function hasClass(el: HTMLElement, cls: string): boolean {
	if (!el || !cls) return false;
	if (cls.indexOf(' ') !== -1)
		throw new Error('className should not contain space.');
	if (el.classList) {
		return el.classList.contains(cls);
	} else {
		return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}
}

export function addClass(el: HTMLElement, cls: string): void {
	if (!el) return;
	let curClass = el.className;
	const classes = (cls || '').split(' ');

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i];
		if (!clsName) continue;

		if (el.classList) {
			el.classList.add(clsName);
		} else if (!hasClass(el, clsName)) {
			curClass += ' ' + clsName;
		}
	}
	if (!el.classList) {
		el.className = curClass;
	}
}

export function removeClass(el: HTMLElement, cls: string): void {
	if (!el || !cls) return;
	const classes = cls.split(' ');
	let curClass = ' ' + el.className + ' ';

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i];
		if (!clsName) continue;

		if (el.classList) {
			el.classList.remove(clsName);
		} else if (hasClass(el, clsName)) {
			curClass = curClass.replace(' ' + clsName + ' ', ' ');
		}
	}
	if (!el.classList) {
		el.className = trim(curClass);
	}
}

// Here I want to use the type CSSStyleDeclaration, but the definition for CSSStyleDeclaration
// has { [index: number]: string } in its type annotation, which does not satisfy the method
// camelize(s: string)
// Same as the return type
export const getStyle = function(
	element: HTMLElement,
	styleName: string,
): string {
	if (!element || !styleName) return '';
	styleName = camelize(styleName);
	if (styleName === 'float') {
		styleName = 'cssFloat';
	}
	try {
		const style = element.style[styleName];
		if (style) return style;
		const computed = document.defaultView?.getComputedStyle(element, '');
		return computed ? computed[styleName] : '';
	} catch (e) {
		return element.style[styleName];
	}
};

export function getBoundingClientRect(element: Element): DOMRect | number {
	if (!element || !element.getBoundingClientRect) {
		return 0;
	}
	return element.getBoundingClientRect();
}

/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
	const doc = document.documentElement;

	const docScrollLeft = doc.scrollLeft;
	const docScrollTop = doc.scrollTop;
	const docClientLeft = doc.clientLeft;
	const docClientTop = doc.clientTop;

	const pageXOffset = window.pageXOffset;
	const pageYOffset = window.pageYOffset;

	const box = getBoundingClientRect(element);

	const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

	const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
	const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
	const offsetLeft = retLeft + pageXOffset;
	const offsetTop = rectTop + pageYOffset;

	const left = offsetLeft - scrollLeft;
	const top = offsetTop - scrollTop;

	const clientWidth = window.document.documentElement.clientWidth;
	const clientHeight = window.document.documentElement.clientHeight;
	return {
		left: left,
		top: top,
		right: clientWidth - rectWidth - left,
		bottom: clientHeight - rectHeight - top,
		rightIncludeBody: clientWidth - left,
		bottomIncludeBody: clientHeight - top,
	};
}