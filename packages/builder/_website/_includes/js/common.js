
const defaultPattern = ''

export function buildIpfsUrl (pattern, cid) {
  pattern = pattern || defaultPattern;
  if (!cid) return '';
  const output = pattern.replace(':hash', cid)
  return output
}
