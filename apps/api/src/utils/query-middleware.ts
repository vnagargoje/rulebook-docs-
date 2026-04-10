import qs from 'qs';

type ParsedValue =
    | string
    | number
    | boolean
    | Date
    | Record<string, unknown>
    | unknown[];

function isObject(val: unknown): val is Record<string, unknown> {
    return (
        val !== null && typeof val === 'object' && val.constructor === Object
    );
}

function isNumber(val: unknown): boolean {
    return !isNaN(parseFloat(String(val))) && isFinite(Number(val));
}

function isBoolean(val: unknown): boolean {
    return val === 'false' || val === 'true';
}

function isDate(val: unknown): boolean {
    if (
        !(
            typeof val === 'string' ||
            typeof val === 'number' ||
            val instanceof Date
        )
    )
        return false;
    return !isNaN(new Date(val).getTime());
}

function isArray(val: unknown): val is unknown[] {
    return Array.isArray(val);
}

function isNestedArray(val: unknown): val is unknown[][] {
    return Array.isArray(val) && val.length > 0 && Array.isArray(val[0]);
}

function parseValue(val: unknown): ParsedValue | null {
    if (typeof val === 'undefined' || val === 'null' || val === '') {
        return null;
    } else if (isNumber(val)) {
        return parseNumber(val);
    } else if (isBoolean(val)) {
        return parseBoolean(val);
    } else if (isDate(val)) {
        return parseDate(val);
    } else if (isNestedArray(val)) {
        return (val as unknown[][]).map((arr) => parseArray(arr));
    } else if (isArray(val)) {
        return parseArray(val);
    } else if (isObject(val)) {
        return parseObject(val);
    } else {
        return val as string;
    }
}

function parseObject(
    obj: Record<string, unknown>,
): Record<string, ParsedValue> {
    const result: Record<string, ParsedValue> = {};
    for (const key in obj) {
        const val = parseValue(obj[key]);
        if (val !== null) result[key] = val;
    }
    return result;
}

function parseNumber(val: unknown): number {
    return Number(val);
}

function parseBoolean(val: unknown): boolean {
    return String(val) === 'true';
}

function parseDate(val: unknown): Date | string {
    const parsed = new Date(val as string | number | Date);
    return isNaN(parsed.getTime()) ? String(val) : parsed;
}

function parseArray(arr: unknown[]): ParsedValue[] {
    return arr
        .map((item) => parseValue(item))
        .filter((item): item is ParsedValue => item !== null);
}

function queryMiddleware(
    options?: qs.IParseOptions,
): (str: string) => Record<string, ParsedValue> {
    return function (str: string): Record<string, ParsedValue> {
        try {
            return parseObject(
                qs.parse(str, options) as Record<string, unknown>,
            );
        } catch (error) {
            console.error('Query parsing failed:', error);
            return {};
        }
    };
}

export { queryMiddleware };
