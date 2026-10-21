export interface ProjectPhoto {
  file: string;
  date: string | null;
  width: number;
  height: number;
  chapter?: string;
}

export interface ProjectPhotoSection {
  key: string;
  label: string;
  month: string | null;
  photos: ProjectPhoto[];
}

// Capture dates are local calendar dates, not upload dates. Don't shift them
// through a visitor's time zone, or invent a month for an undated photograph.
export function groupProjectPhotos(photos: ProjectPhoto[]): ProjectPhotoSection[] {
  const sections = new Map<string, ProjectPhotoSection>();
  const files = new Set<string>();
  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  let previousDate = '';
  let reachedUndated = false;

  for (const photo of photos) {
    if (!/^[\w-]+\.jpg$/.test(photo.file) || files.has(photo.file)) {
      throw new Error(`Invalid or duplicate project photo: ${photo.file}`);
    }
    files.add(photo.file);
    if (![photo.width, photo.height].every(n => Number.isInteger(n) && n > 0)) {
      throw new Error(`Missing dimensions: ${photo.file}`);
    }

    let month: string | null = null;
    let key = 'undated';
    let label = photo.chapter || 'Undated';
    if (photo.date !== null) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(photo.date)) throw new Error('Invalid capture date');
      const date = new Date(`${photo.date}T12:00:00Z`);
      if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== photo.date) {
        throw new Error('Invalid capture date');
      }
      if (reachedUndated || photo.date < previousDate) {
        throw new Error('Project photos must remain oldest to newest, with undated photos last');
      }
      previousDate = photo.date;
      month = photo.date.slice(0, 7);
      key = month;
      label = monthName.format(date);
    } else {
      reachedUndated = true;
    }

    if (!sections.has(key)) sections.set(key, { key, label, month, photos: [] });
    sections.get(key)!.photos.push(photo);
  }
  return [...sections.values()];
}
