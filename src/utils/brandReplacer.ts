function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Recursively replaces brand name and domain name strings inside any CMS payload
 * (homepage sections, pages, contact details, legal policies, testimonials, FAQs).
 */
export function replaceBrandAndDomainDeep<T>(
  value: T,
  oldBrand: string,
  newBrand: string,
  oldDomain: string,
  newDomain: string
): T {
  const cleanOldBrand = oldBrand.trim();
  const cleanNewBrand = newBrand.trim();
  const cleanOldDomain = oldDomain.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  const cleanNewDomain = newDomain.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');

  const oldSlug = cleanOldBrand.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const newSlug = cleanNewBrand.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const oldFirstWord = cleanOldBrand.split(/\s+/)[0] || '';
  const newFirstWord = cleanNewBrand.split(/\s+/)[0] || '';

  const transformString = (text: string): string => {
    let out = text;

    // 1. Replace full domain name (e.g. aqdastravel.co.uk -> newdomain.co.uk)
    if (cleanOldDomain && cleanNewDomain && cleanOldDomain !== cleanNewDomain) {
      out = out.replace(new RegExp(escapeRegExp(cleanOldDomain), 'gi'), cleanNewDomain);
    }

    // 2. Replace full brand name (e.g. Aqdas Travel -> Makkah Path Travel)
    if (cleanOldBrand && cleanNewBrand && cleanOldBrand !== cleanNewBrand) {
      out = out.replace(new RegExp(escapeRegExp(cleanOldBrand), 'gi'), cleanNewBrand);

      // Replace social handles like "aqdastraveluk" or "aqdastravel"
      if (oldSlug && newSlug && oldSlug !== newSlug) {
        out = out.replace(new RegExp(`${escapeRegExp(oldSlug)}uk`, 'gi'), `${newSlug}uk`);
        out = out.replace(new RegExp(escapeRegExp(oldSlug), 'gi'), newSlug);
      }

      // Replace short brand reference such as "Aqdas team" or "Aqdas emblem"
      if (
        oldFirstWord &&
        newFirstWord &&
        oldFirstWord.length >= 3 &&
        oldFirstWord.toLowerCase() !== newFirstWord.toLowerCase()
      ) {
        out = out.replace(
          new RegExp(`\\b${escapeRegExp(oldFirstWord)}(?=\\s+(?:team|emblem|specialist|desk))`, 'gi'),
          newFirstWord
        );
      }
    }

    return out;
  };

  const walk = (node: unknown): unknown => {
    if (typeof node === 'string') {
      // Do not corrupt base64 data URLs or local asset paths
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
        // Keep page slugs stable so navigation links keep working
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
