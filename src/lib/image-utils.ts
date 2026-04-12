export function getPlaceholderImage(category?: string): string {
  const placeholders: Record<string, string> = {
    'Diagnostic': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
    'PPE': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600',
    'Surgical': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    'Patient Care': 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600',
    'Pharmacy': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600',
  };

  return placeholders[category || ''] || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600';
}

export function getValidImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') {
    return getPlaceholderImage();
  }
  if (url.startsWith('data:') || url.startsWith('http')) {
    return url;
  }
  // If it's a local path that failed, return placeholder
  return getPlaceholderImage();
}