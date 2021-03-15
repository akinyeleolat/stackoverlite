import slug from 'slug';

/**
 * @param {string} title
 * @return {string} unique_slug
 */
export const createUniqueSlug = (title: string): string =>
    `${slug(title, { lower: true })}-${Date.now()}`;

/**
 * @param {string} text
 * @param {integer} length
 * @return {string} text
 */
export const createEllipsis = (text: string, length: number): string => {
    const textLength: number = length === null ? 200 : length;
    if (textLength > text.length) {
        return text;
    }
    return `${text.slice(0, textLength - 3).trim()}...`;
};
