export function kebabCasify(string: string) {
	return string.replace(/\B(?:([A-Z])(?=[a-z]))|(?:(?<=[a-z0-9])([A-Z]))/g, '-$1$2').toLowerCase();
}

export function stringToUintArray(string: string): Uint8Array {
	return Buffer.from(string, "utf8");
}

export function camelCasify(string: string) {
	return string.charAt(0).toLocaleLowerCase() + string.slice(1);
}

export function capitalizeFirstLetter(str: string): string {
	return str.replace(/^\w/, (c) => c.toUpperCase());
}

export function toPascalCase(str: string): string {
	return (str.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('');
}
export function toSnakeCase(str: string): string {
	return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase()
}