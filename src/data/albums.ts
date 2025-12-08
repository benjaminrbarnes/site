export interface Album {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  folder: string;
  images: number[];
  ext: string;
  visible: boolean;
  // For new-style albums with different naming convention
  filePrefix?: string;  // e.g., '004540640' -> files are 004540640001.jpg, etc.
  noSubfolder?: boolean; // true = images in folder root, false = images in /md/ subfolder
  reverseOrder?: boolean; // true = display images in reverse order
  paddingLength?: number; // digit padding for image numbers (default: 3)
}

// AWS Serverless Image Handler endpoint
const IMAGE_HANDLER = 'https://d35s6fmxia7g6v.cloudfront.net';

// Helper to build image URLs with automatic resizing
// width=0 means auto (maintain aspect ratio)
const img = (path: string, width = 2400) =>
  `${IMAGE_HANDLER}/fit-in/${width}x0/filters:quality(90)/photos/${path}`;

// Helper to generate sequential image numbers
const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

// Helper to build thumbnail URLs for new-style albums (3-digit padding: 001, 002, etc.)
const imgNew = (folder: string, prefix: string, num: number, width = 800) => {
  const paddedNum = num.toString().padStart(3, '0');
  return `${IMAGE_HANDLER}/fit-in/${width}x0/filters:quality(90)/photos/${folder}/${prefix}${paddedNum}.jpg`;
};

// Helper for thumbnails with custom padding (e.g., 7-digit for Ricoh GR files)
const imgPadded = (folder: string, prefix: string, num: number, padding: number, width = 800) => {
  const paddedNum = num.toString().padStart(padding, '0');
  return `${IMAGE_HANDLER}/fit-in/${width}x0/filters:quality(90)/photos/${folder}/${prefix}${paddedNum}.jpg`;
};

export const albums: Album[] = [
  // ========== 2025 Austria Trip (newest first) ==========
  {
    slug: 'austria-day5',
    title: 'Austria Pt. 5',
    description: 'September 2025',
    thumbnail: imgPadded('2025/austria/day5', 'R', 1037, 7),
    folder: '2025/austria/day5',
    images: [951,953,964,967,968,971,990,993,994,996,998,999,1000,1002,1003,1006,1007,1013,1022,1028,1034,1035,1036,1037,1038,1039,1041,1042,1044,1046,1055,1064,1068,1069,1072,1073,1074,1075,1077,1079,1081,1082,1085,1087,1090,1095,1096],
    ext: 'jpg',
    visible: true,
    filePrefix: 'R',
    noSubfolder: true,
    paddingLength: 7,
  },
  {
    slug: 'austria-day4',
    title: 'Austria Pt. 4',
    description: 'September 2025',
    thumbnail: imgPadded('2025/austria/day4', 'R', 825, 7),
    folder: '2025/austria/day4',
    images: [672,682,684,686,688,695,699,706,718,729,735,742,745,747,748,752,753,761,762,764,767,770,773,775,776,781,782,783,785,796,807,821,825,826,830,833,836,837,838,840,841,843,846,852,857,863,867,869,870,875,878,882,884,888,891,894,897,899,904,905,912,913,914,917,918,921,922,924,925,926,927,933,934],
    ext: 'jpg',
    visible: true,
    filePrefix: 'R',
    noSubfolder: true,
    paddingLength: 7,
  },
  {
    slug: 'austria-day3',
    title: 'Austria Pt. 3',
    description: 'September 2025',
    thumbnail: imgPadded('2025/austria/day3', 'R', 560, 7),
    folder: '2025/austria/day3',
    images: [478,482,486,495,501,516,519,522,534,538,539,542,544,546,551,556,560,567,570,581,582,584,600,603,605,609,613,614,615,628,634,636,638,640,641,643,657,667,669],
    ext: 'jpg',
    visible: true,
    filePrefix: 'R',
    noSubfolder: true,
    paddingLength: 7,
  },
  {
    slug: 'austria-day2',
    title: 'Austria Pt. 2',
    description: 'September 2025',
    thumbnail: imgPadded('2025/austria/day2', 'R', 340, 7),
    folder: '2025/austria/day2',
    images: [255,256,257,258,259,261,264,278,279,280,281,282,284,285,289,290,291,292,294,295,296,297,303,310,312,313,316,318,320,321,322,324,325,329,333,340,341,356,357,362,365,366,368,369,370,371,372,373,375,378,382,386,387,388,392,393,405,413,420,426,430,432,437,445,447,449,454,464,467,469,472,477],
    ext: 'jpg',
    visible: true,
    filePrefix: 'R',
    noSubfolder: true,
    paddingLength: 7,
  },
  {
    slug: 'austria-day1',
    title: 'Austria Pt. 1',
    description: 'September 2025',
    thumbnail: imgPadded('2025/austria/day1', 'R', 145, 7),
    folder: '2025/austria/day1',
    images: [64,66,74,81,86,88,92,95,97,99,100,109,116,122,123,128,129,130,131,132,133,137,138,139,141,145,150,170,171,176,177,180,186,189,196,197,207,208,210,217,230,234,236,237,243],
    ext: 'jpg',
    visible: true,
    filePrefix: 'R',
    noSubfolder: true,
    paddingLength: 7,
  },
  // ========== 2025 Film Albums ==========
  {
    slug: 'bvi',
    title: 'May 2025',
    description: 'BVI',
    thumbnail: imgNew('2025/new10', '006961160', 13),
    folder: '2025/new10',
    images: [...range(1, 22), ...range(24, 37)],
    ext: 'jpg',
    visible: true,
    filePrefix: '006961160',
    noSubfolder: true,
  },
  {
    slug: 'orchard-skiing-bvi',
    title: "Oct '24 - May '25",
    description: 'Orchard + Skiing + BVI',
    thumbnail: imgNew('2025/new9', '006961150', 10),
    folder: '2025/new9',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
    filePrefix: '006961150',
    noSubfolder: true,
  },
  {
    slug: 'london-3',
    title: 'Sept 2024',
    description: 'London pt. 3',
    thumbnail: imgNew('2025/new8', '005780090', 4),
    folder: '2025/new8',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
    filePrefix: '005780090',
    noSubfolder: true,
    reverseOrder: true,
  },
  {
    slug: 'london-2',
    title: 'Sept 2024',
    description: 'London pt. 2',
    thumbnail: imgNew('2025/new7', '005780100', 3),
    folder: '2025/new7',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
    filePrefix: '005780100',
    noSubfolder: true,
    reverseOrder: true,
  },
  {
    slug: 'london-1',
    title: 'Sept 2024',
    description: 'London pt. 1',
    thumbnail: imgNew('2025/new6', '005780080', 10),
    folder: '2025/new6',
    images: range(1, 25),
    ext: 'jpg',
    visible: true,
    filePrefix: '005780080',
    noSubfolder: true,
  },
  {
    slug: 'wedding-garden',
    title: 'June 2024',
    description: 'Z&E Wedding + Garden',
    thumbnail: imgNew('2025/new5', '004615660', 10),
    folder: '2025/new5',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
    filePrefix: '004615660',
    noSubfolder: true,
  },
  {
    slug: 'montreal-wedding',
    title: 'May - June 2024',
    description: 'Montreal + Z&E Wedding',
    thumbnail: imgNew('2025/new4', '004615670', 5),
    folder: '2025/new4',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
    filePrefix: '004615670',
    noSubfolder: true,
  },
  {
    slug: 'vegas-montreal',
    title: 'April - May 2024',
    description: 'Vegas + Montreal',
    thumbnail: imgNew('2025/new3', '004615650', 7),
    folder: '2025/new3',
    images: range(1, 36),
    ext: 'jpg',
    visible: true,
    filePrefix: '004615650',
    noSubfolder: true,
  },
  {
    slug: 'atl-vegas',
    title: 'Dec 2023 - April 2024',
    description: 'ATL + Vegas',
    thumbnail: imgNew('2025/new2', '004540650', 18),
    folder: '2025/new2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
    filePrefix: '004540650',
    noSubfolder: true,
  },
  {
    slug: 'tahoe-ny-la',
    title: 'Sept 2023 - Dec 2023',
    description: 'Tahoe / NY / LA',
    thumbnail: imgNew('2025/new1', '004540640', 32),
    folder: '2025/new1',
    images: [1, 2, 3, 4, 7, 9, ...range(12, 37)],
    ext: 'jpg',
    visible: true,
    filePrefix: '004540640',
    noSubfolder: true,
  },
  // ========== Older albums (hidden) ==========
  {
    slug: 'p25',
    title: 'June 2023 - Sept 2023',
    description: 'Camping / 4th of July / Cruise / Lake House / DIY / Tahoe',
    thumbnail: img('25/md/img21.jpg', 400),
    folder: '25',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p24',
    title: 'March 2023 - Pt. 4',
    description: 'Hawaii / Half Marathon (Bend)',
    thumbnail: img('24/md/img19.jpg', 400),
    folder: '24',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p23',
    title: 'March 2023 - Pt. 3',
    description: 'Kauai / Hawaii',
    thumbnail: img('23/md/img34.jpg', 400),
    folder: '23',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p22',
    title: 'March 2023 - Pt. 2',
    description: 'Honolulu / Kauai',
    thumbnail: img('22/md/img16.jpg', 400),
    folder: '22',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p21',
    title: 'March 2023 - Pt. 1',
    description: 'Seattle / Pizza / Juno',
    thumbnail: img('21/md/img12.jpg', 400),
    folder: '21',
    images: range(1, 37),
    ext: 'jpg',
    visible: false,
  },
  {
    slug: 'p20',
    title: 'Jan & Feb 2023',
    description: 'North GA / Seattle Trip',
    thumbnail: img('20-feb2023/md/img12.jpg', 400),
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
    thumbnail: img('19-dec2022/md/img3.jpg', 400),
    folder: '19-dec2022',
    images: [...range(1, 25), 28, 31, 32, 33, 34, 35, 37],
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p18',
    title: 'Sept - Nov 2022',
    description: 'New house / Halloween / Thanksgiving',
    thumbnail: img('18-aug2022/md/img19.jpg', 400),
    folder: '18-aug2022',
    images: range(5, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p17',
    title: 'Aug 2022',
    description: 'Scott & Connie Wedding',
    thumbnail: img('17-july2022-2/md/img31.jpg', 400),
    folder: '17-july2022-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p16',
    title: 'July & Aug 2022',
    description: 'Visiting Zach & Eliz in LA / Scott & Connie Wedding',
    thumbnail: img('16-july2022-1/md/img34.jpg', 400),
    folder: '16-july2022-1',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'lateJuly2022',
    title: 'July 2022 - 2',
    description: 'Pool with Payton / Visiting Zach & Eliz in LA',
    thumbnail: img('8-25-2022/2/md/img28.jpg', 400),
    folder: '8-25-2022/2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'earlyJuly2022',
    title: 'July 2022',
    description: 'St. Theresa beach / Braves game',
    thumbnail: img('8-25-2022/1/md/img18.jpg', 400),
    folder: '8-25-2022/1',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p15',
    title: 'June 2022 - July 2022',
    description: "Peter's wedding / ATL Apartment",
    thumbnail: img('15-june2022-4/md/img11.jpg', 400),
    folder: '15-june2022-4',
    images: range(2, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p14',
    title: 'June 2022 - 3',
    description: "Peter's wedding",
    thumbnail: img('14-june2022-3/md/img26.jpg', 400),
    folder: '14-june2022-3',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p13',
    title: 'June 2022 - 2',
    description: "Scott Bachelor Party / Colorado / Peter's wedding",
    thumbnail: img('13-june2022-2/md/img16.jpg', 400),
    folder: '13-june2022-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p12',
    title: 'June 2022',
    description: 'Scott Bachelor Party / Austin, TX',
    thumbnail: img('12-june2022-1/md/img24.jpg', 400),
    folder: '12-june2022-1',
    images: [1, 2, ...range(5, 11), 13, 14, ...range(16, 37)],
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p11',
    title: 'Feb 2022 - June 2022',
    description: 'Park City / Lily visit CO / Scott Bachelor Austin TX',
    thumbnail: img('11-feb2022/md/img17.jpg', 400),
    folder: '11-feb2022',
    images: [...range(1, 32), ...range(34, 37)],
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p10',
    title: 'Nov 2021 - Feb 2022',
    description: "North GA / Colorado / Park City / Peter's Bachelor",
    thumbnail: img('10-nov2021/md/img29.jpg', 400),
    folder: '10-nov2021',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p9',
    title: 'Sept 2021 - Nov 2021',
    description: 'Roadtrip / Colorado / Seattle',
    thumbnail: img('9-oct2021/md/img22.jpg', 400),
    folder: '9-oct2021',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p8',
    title: 'Sept & Oct 2021',
    description: 'Zurich / Chris / Grandma / Atlanta / Van',
    thumbnail: img('8-sept2021-6/md/img19.jpg', 400),
    folder: '8-sept2021-6',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p7',
    title: 'Sept 2021 - 5',
    description: 'Matterhorn / Lauterbrunnen / Jungfraujoch / First',
    thumbnail: img('7-sept2021-5/md/img10.jpg', 400),
    folder: '7-sept2021-5',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p6',
    title: 'Sept 2021 - 4',
    description: 'Venice / Milan / Zermatt / Matterhorn',
    thumbnail: img('6-sept2021-4/md/img11.jpg', 400),
    folder: '6-sept2021-4',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p5',
    title: 'Sept 2021 - 3',
    description: 'Florence / Venice',
    thumbnail: img('5-sept2021-3/md/img2.jpg', 400),
    folder: '5-sept2021-3',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p4',
    title: 'Sept 2021 - 2',
    description: 'Positano / Capri',
    thumbnail: img('4-sept2021-2/md/img19.jpg', 400),
    folder: '4-sept2021-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p3',
    title: 'Sept 2021 - 1',
    description: 'Rome / Vatican',
    thumbnail: img('3-sept2021-1/md/img23.jpg', 400),
    folder: '3-sept2021-1',
    images: range(1, 36),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p2',
    title: 'Aug & Sept 2021',
    description: 'Time in NYC / Rome, Italy',
    thumbnail: img('2-aug2021-2/md/img26.jpg', 400),
    folder: '2-aug2021-2',
    images: range(1, 37),
    ext: 'jpg',
    visible: true,
  },
  {
    slug: 'p1',
    title: 'Aug 2021',
    description: 'New camera / time in NYC',
    thumbnail: img('1-aug2021-1/md/img36.JPG', 400),
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
  let images = album.images;

  // Reverse order if specified
  if (album.reverseOrder) {
    images = [...images].reverse();
  }

  return images.map(num => {
    if (album.filePrefix) {
      // New-style naming: prefix + padded number
      const padding = album.paddingLength ?? 3;
      const paddedNum = num.toString().padStart(padding, '0');
      const subfolder = album.noSubfolder ? '' : '/md';
      return img(`${album.folder}${subfolder}/${album.filePrefix}${paddedNum}.${album.ext}`);
    } else {
      // Old-style naming: img + number
      return img(`${album.folder}/md/img${num}.${album.ext}`);
    }
  });
}

// For thumbnails in the gallery grid (smaller size)
export function getThumbnailUrl(album: Album, imgNum: number): string {
  return img(`${album.folder}/md/img${imgNum}.${album.ext}`, 400);
}
