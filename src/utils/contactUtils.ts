function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Strips non-digit characters (and leading 00 international prefix) so wa.me links
 * work reliably regardless of spaces, dashes, or leading "+" entered in Admin.
 */
export function formatWhatsAppDigits(raw: string): string {
  const digits = (raw || '').replace(/\D+/g, '');
  if (digits.startsWith('00')) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Builds a safe https://wa.me/... link with an optional pre-filled message.
 */
export function buildWhatsAppUrl(rawNumber: string, message?: string): string {
  const digits = formatWhatsAppDigits(rawNumber);
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Replaces previous phone, email, WhatsApp digits, and office address strings
 * inside CMS pages so Contact Us, Beat My Price, and Legal pages stay synced.
 */
export function replaceContactDetailsDeep<T>(
  value: T,
  prev: {
    phone: string;
    whatsappNumber: string;
    email: string;
    officeAddress: string;
  },
  next: {
    phone: string;
    whatsappNumber: string;
    email: string;
    officeAddress: string;
  }
): T {
  const pairs: Array<[string, string]> = [];

  if (prev.email.trim() && next.email.trim() && prev.email.trim() !== next.email.trim()) {
    pairs.push([prev.email.trim(), next.email.trim()]);
  }
  if (prev.phone.trim() && next.phone.trim() && prev.phone.trim() !== next.phone.trim()) {
    pairs.push([prev.phone.trim(), next.phone.trim()]);
  }
  const prevWa = formatWhatsAppDigits(prev.whatsappNumber);
  const nextWa = formatWhatsAppDigits(next.whatsappNumber);
  if (prevWa && nextWa && prevWa !== nextWa) {
    pairs.push([prevWa, nextWa]);
  }
  if (
    prev.officeAddress.trim() &&
    next.officeAddress.trim() &&
    prev.officeAddress.trim() !== next.officeAddress.trim()
  ) {
    pairs.push([prev.officeAddress.trim(), next.officeAddress.trim()]);
    // Also match shorter address prefix without ", United Kingdom"
    const shortPrev = prev.officeAddress.replace(/,\s*United Kingdom$/i, '').trim();
    const shortNext = next.officeAddress.replace(/,\s*United Kingdom$/i, '').trim();
    if (shortPrev && shortNext && shortPrev !== prev.officeAddress.trim()) {
      pairs.push([shortPrev, shortNext]);
    }
  }

  if (pairs.length === 0) return value;

  const transformString = (text: string): string => {
    let out = text;
    for (const [oldVal, newVal] of pairs) {
      out = out.replace(new RegExp(escapeRegExp(oldVal), 'gi'), newVal);
    }
    return out;
  };

  const walk = (node: unknown): unknown => {
    if (typeof node === 'string') {
      if (node.startsWith('data:image/') || node.startsWith('/src/assets/')) {
        return node;
      }
      return transformString(node);
    }
    if (Array.isArray(node)) {
      return node.map((item) => walk(item));
    }
    if (node && typeof node === 'object') {
      const result: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        if (k === 'slug' || k === 'id' || k === 'category' || k === 'actionType') {
          result[k] = v;
        } else {
          result[k] = walk(v);
        }
      }
      return result;
    }
    return node;
  };

  return walk(value) as T;
}
