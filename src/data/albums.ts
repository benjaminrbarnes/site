export interface Album {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  folder: string;
  images: number[];
  ext: string;
  visible: boolean;
}

const CDN_BASE = 'https://d3dsxdu5t5tqsc.cloudfront.net/photos';

// Helper to generate sequential image numbers
const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const albums: Album[] = [
  // Newer albums (currently hidden in gallery - commented out in original)
  {
    slug: 'p25',
    title: 'June 2023 - Sept 2023',
    description: 'Camping / 4th of July / Cruise / Lake House / DIY / Tahoe',
    thumbnail: `${CDN_BASE}/25/md/img21.jpg`,
    folder: '25',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p24',
    title: 'March 2023 - Pt. 4',
    description: 'Hawaii / Half Marathon (Bend)',
    thumbnail: `${CDN_BASE}/24/md/img19.jpg`,
    folder: '24',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p23',
    title: 'March 2023 - Pt. 3',
    description: 'Kauai / Hawaii',
    thumbnail: `${CDN_BASE}/23/md/img34.jpg`,
    folder: '23',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p22',
    title: 'March 2023 - Pt. 2',
    description: 'Honolulu / Kauai',
    thumbnail: `${CDN_BASE}/22/md/img16.jpg`,
    folder: '22',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p21',
    title: 'March 2023 - Pt. 1',
    description: 'Seattle / Pizza / Juno',
    thumbnail: `${CDN_BASE}/21/md/img12.jpg`,
    folder: '21',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p20',
    title: 'Jan & Feb 2023',
    description: 'North GA / Seattle Trip',
    thumbnail: `${CDN_BASE}/20-feb2023/md/img12.jpg`,
    folder: '20-feb2023',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  // Visible albums
  {
    slug: 'p19',
    title: 'Nov & Dec 2022',
    description: 'Christmas / New Years',
    thumbnail: `${CDN_BASE}/19-dec2022/md/img3.jpg`,
    folder: '19-dec2022',
    images: [...range(1, 25), 28, 31, 32, 33, 34, 35, 37],
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p18',
    title: 'Sept - Nov 2022',
    description: 'New house / Halloween / Thanksgiving',
    thumbnail: `${CDN_BASE}/18-aug2022/md/img19.jpg`,
    folder: '18-aug2022',
    images: range(5, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p17',
    title: 'Aug 2022',
    description: 'Scott & Connie Wedding',
    thumbnail: `${CDN_BASE}/17-july2022-2/md/img31.jpg`,
    folder: '17-july2022-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p16',
    title: 'July & Aug 2022',
    description: 'Visiting Zach & Eliz in LA / Scott & Connie Wedding',
    thumbnail: `${CDN_BASE}/16-july2022-1/md/img34.jpg`,
    folder: '16-july2022-1',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'lateJuly2022',
    title: 'July 2022 - 2',
    description: 'Pool with Payton / Visiting Zach & Eliz in LA',
    thumbnail: `${CDN_BASE}/8-25-2022/2/md/img28.jpg`,
    folder: '8-25-2022/2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'earlyJuly2022',
    title: 'July 2022',
    description: 'St. Theresa beach / Braves game',
    thumbnail: `${CDN_BASE}/8-25-2022/1/md/img18.jpg`,
    folder: '8-25-2022/1',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p15',
    title: 'June 2022 - July 2022',
    description: "Peter's wedding / ATL Apartment",
    thumbnail: `${CDN_BASE}/15-june2022-4/md/img11.jpg`,
    folder: '15-june2022-4',
    images: range(2, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p14',
    title: 'June 2022 - 3',
    description: "Peter's wedding",
    thumbnail: `${CDN_BASE}/14-june2022-3/md/img26.jpg`,
    folder: '14-june2022-3',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p13',
    title: 'June 2022 - 2',
    description: "Scott Bachelor Party / Colorado / Peter's wedding",
    thumbnail: `${CDN_BASE}/13-june2022-2/md/img16.jpg`,
    folder: '13-june2022-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p12',
    title: 'June 2022',
    description: 'Scott Bachelor Party / Austin, TX',
    thumbnail: `${CDN_BASE}/12-june2022-1/md/img24.jpg`,
    folder: '12-june2022-1',
    images: [1, 2, ...range(5, 11), 13, 14, ...range(16, 37)],
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p11',
    title: 'Feb 2022 - June 2022',
    description: 'Park City / Lily visit CO / Scott Bachelor Austin TX',
    thumbnail: `${CDN_BASE}/11-feb2022/md/img17.jpg`,
    folder: '11-feb2022',
    images: [...range(1, 32), ...range(34, 37)],
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p10',
    title: 'Nov 2021 - Feb 2022',
    description: "North GA / Colorado / Park City / Peter's Bachelor",
    thumbnail: `${CDN_BASE}/10-nov2021/md/img29.jpg`,
    folder: '10-nov2021',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p9',
    title: 'Sept 2021 - Nov 2021',
    description: 'Roadtrip / Colorado / Seattle',
    thumbnail: `${CDN_BASE}/9-oct2021/md/img22.jpg`,
    folder: '9-oct2021',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p8',
    title: 'Sept & Oct 2021',
    description: 'Zurich / Chris / Grandma / Atlanta / Van',
    thumbnail: `${CDN_BASE}/8-sept2021-6/md/img19.jpg`,
    folder: '8-sept2021-6',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p7',
    title: 'Sept 2021 - 5',
    description: 'Matterhorn / Lauterbrunnen / Jungfraujoch / First',
    thumbnail: `${CDN_BASE}/7-sept2021-5/md/img10.jpg`,
    folder: '7-sept2021-5',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p6',
    title: 'Sept 2021 - 4',
    description: 'Venice / Milan / Zermatt / Matterhorn',
    thumbnail: `${CDN_BASE}/6-sept2021-4/md/img11.jpg`,
    folder: '6-sept2021-4',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p5',
    title: 'Sept 2021 - 3',
    description: 'Florence / Venice',
    thumbnail: `${CDN_BASE}/5-sept2021-3/md/img2.jpg`,
    folder: '5-sept2021-3',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p4',
    title: 'Sept 2021 - 2',
    description: 'Positano / Capri',
    thumbnail: `${CDN_BASE}/4-sept2021-2/md/img19.jpg`,
    folder: '4-sept2021-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p3',
    title: 'Sept 2021 - 1',
    description: 'Rome / Vatican',
    thumbnail: `${CDN_BASE}/3-sept2021-1/md/img23.jpg`,
    folder: '3-sept2021-1',
    images: range(1, 36),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p2',
    title: 'Aug & Sept 2021',
    description: 'Time in NYC / Rome, Italy',
    thumbnail: `${CDN_BASE}/2-aug2021-2/md/img26.jpg`,
    folder: '2-aug2021-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p1',
    title: 'Aug 2021',
    description: 'New camera / time in NYC',
    thumbnail: `${CDN_BASE}/1-aug2021-1/md/img36.JPG`,
    folder: '1-aug2021-1',
    images: range(2, 67),
    ext: 'JPG',
    visible: true,
  },
];

export function getAlbum(slug: string): Album | undefined {
  return albums.find(a => a.slug === slug);
}

export function getVisibleAlbums(): Album[] {
  return albums.filter(a => a.visible);
}

export function getAllAlbums(): Album[] {
  return albums;
}

export function getImageUrls(album: Album): string[] {
  return album.images.map(
    num => `${CDN_BASE}/${album.folder}/md/img${num}.${album.ext}`
  );
}
