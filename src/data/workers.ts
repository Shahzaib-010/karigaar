export type WorkerSummary = {
  slug: string;
  name: string;
  trade: string;
  city: string;
  rating: string;
  jobs: number;
  initials: string;
  verified: boolean;
  photo: string;
};

export type WorkerReview = {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  jobType: string;
  text: string;
  photo?: string;
};

export type WorkerDay = {
  day: string;
  status: "available" | "full" | "off";
};

export type WorkerService = {
  service: string;
  price: string;
  duration: string;
};

export type WorkerProfile = WorkerSummary & {
  location: string;
  joined: string;
  responseTime: string;
  status: "online" | "offline";
  experience: string;
  responseAverage: string;
  bio: string;
  skills: string[];
  services: WorkerService[];
  availability: WorkerDay[];
  timeSlots: string[];
  portfolio: { src: string; alt: string }[];
  reviewSummary: {
    overall: string;
    total: number;
    breakdown: { label: string; value: number }[];
  };
  reviews: WorkerReview[];
  serviceAreas: string[];
  mapCenter: string;
  startingPrice: string;
};

const aliRazaPortfolio = [
  {
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    alt: "Wiring job completed",
  },
  {
    src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    alt: "Panel board installed",
  },
  {
    src: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80",
    alt: "Fan installation",
  },
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    alt: "Switch board work",
  },
  {
    src: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?auto=format&fit=crop&w=900&q=80",
    alt: "Inverter wiring",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    alt: "More electrical work",
  },
];

export const workerProfiles: WorkerProfile[] = [
  {
    slug: "ali-raza",
    name: "Ali Raza",
    trade: "Electrician",
    city: "Lahore",
    rating: "4.8",
    jobs: 214,
    initials: "AR",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    location: "Johar Town, Lahore",
    joined: "March 2023",
    responseTime: "Usually responds in 10 minutes",
    status: "online",
    experience: "8 yrs",
    responseAverage: "10 min",
    bio: "I am a certified electrician with 8 years of experience in residential and commercial wiring, fan installation, switch repairs, and inverter setup. I take pride in clean work, honest pricing, and showing up on time. Available 7 days a week.",
    skills: [
      "Wiring",
      "Fan Installation",
      "Switch Repair",
      "Inverter Setup",
      "Load Management",
      "WAPDA Issues",
    ],
    services: [
      { service: "Fan installation", price: "Rs. 500", duration: "30-45 min" },
      {
        service: "Switch / socket repair",
        price: "Rs. 300",
        duration: "15-30 min",
      },
      {
        service: "Full wiring (1 room)",
        price: "Rs. 2,500",
        duration: "2-3 hours",
      },
      { service: "Inverter / UPS setup", price: "Rs. 800", duration: "1 hour" },
      { service: "MCB / fuse repair", price: "Rs. 400", duration: "20-30 min" },
      {
        service: "Site visit / inspection",
        price: "Rs. 200",
        duration: "30 min",
      },
    ],
    availability: [
      { day: "Mon", status: "available" },
      { day: "Tue", status: "available" },
      { day: "Wed", status: "full" },
      { day: "Thu", status: "available" },
      { day: "Fri", status: "available" },
      { day: "Sat", status: "available" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: [
      "Morning 9am-12pm",
      "Afternoon 12pm-4pm",
      "Evening 4pm-7pm",
    ],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.8",
      total: 214,
      breakdown: [
        { label: "5 Star", value: 89 },
        { label: "4 Star", value: 8 },
        { label: "3 Star", value: 2 },
        { label: "2 Star", value: 1 },
        { label: "1 Star", value: 0 },
      ],
    },
    reviews: [
      {
        id: "nasreen",
        name: "Nasreen B.",
        city: "Lahore",
        rating: 5,
        date: "2 weeks ago",
        jobType: "Fan installation",
        text: "Ali came exactly on time. Fixed our ceiling fan and also checked two extra sockets without charging extra. Very honest and professional. Highly recommended.",
        photo:
          "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "imran",
        name: "Imran K.",
        city: "Lahore",
        rating: 5,
        date: "1 month ago",
        jobType: "Full wiring",
        text: "Got my lounge rewired. Took about 3 hours, very clean work. No mess left behind. Price was exactly what was quoted. Will call again for the next room.",
      },
      {
        id: "rabia",
        name: "Rabia S.",
        city: "Lahore",
        rating: 4,
        date: "6 weeks ago",
        jobType: "Switch repair",
        text: "Good work, arrived a bit late but informed me beforehand. Job was done quickly and price was fair.",
      },
    ],
    serviceAreas: [
      "Johar Town",
      "Garden Town",
      "Model Town",
      "Gulberg",
      "Defence",
      "Faisal Town",
      "Township",
    ],
    mapCenter: "Lahore",
    startingPrice: "Rs. 300",
  },
  {
    slug: "kamran-shehzad",
    name: "Kamran Shehzad",
    trade: "Plumber",
    city: "Lahore",
    rating: "4.8",
    jobs: 173,
    initials: "KS",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=80",
    location: "Model Town, Lahore",
    joined: "April 2022",
    responseTime: "Usually responds in 9 minutes",
    status: "online",
    experience: "9 yrs",
    responseAverage: "9 min",
    bio: "Experienced residential plumber handling leak repairs, fittings, drainage work, and geyser connections with clean finishing and fair pricing.",
    skills: [
      "Pipe Leak Repair",
      "Bathroom Fitting",
      "Drain Cleaning",
      "Geyser Connection",
      "Tank Overflow Fix",
    ],
    services: [
      { service: "Tap repair", price: "Rs. 300", duration: "15-30 min" },
      { service: "Pipe leak fix", price: "Rs. 500", duration: "30-60 min" },
      { service: "Drain blockage", price: "Rs. 700", duration: "45 min" },
    ],
    availability: [
      { day: "Mon", status: "available" },
      { day: "Tue", status: "available" },
      { day: "Wed", status: "full" },
      { day: "Thu", status: "available" },
      { day: "Fri", status: "available" },
      { day: "Sat", status: "available" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: [
      "Morning 9am-12pm",
      "Afternoon 12pm-4pm",
      "Evening 4pm-7pm",
    ],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.8",
      total: 173,
      breakdown: [
        { label: "5 Star", value: 87 },
        { label: "4 Star", value: 9 },
        { label: "3 Star", value: 3 },
        { label: "2 Star", value: 1 },
        { label: "1 Star", value: 0 },
      ],
    },
    reviews: [],
    serviceAreas: ["Model Town", "Garden Town", "Johar Town", "Gulberg"],
    mapCenter: "Lahore",
    startingPrice: "Rs. 300",
  },
  {
    slug: "furqan-ahmed",
    name: "Furqan Ahmed",
    trade: "Plumber",
    city: "Lahore",
    rating: "4.7",
    jobs: 138,
    initials: "FA",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=600&q=80",
    location: "Johar Town, Lahore",
    joined: "August 2021",
    responseTime: "Usually responds in 11 minutes",
    status: "online",
    experience: "7 yrs",
    responseAverage: "11 min",
    bio: "Trusted local plumber for kitchen, washroom, and water line repairs with a focus on same-day visits and practical solutions.",
    skills: [
      "Leak Detection",
      "Toilet Repair",
      "Kitchen Plumbing",
      "Water Tank Issues",
    ],
    services: [
      { service: "Toilet repair", price: "Rs. 600", duration: "30-45 min" },
      { service: "Kitchen leak fix", price: "Rs. 500", duration: "30-60 min" },
      { service: "Site visit", price: "Rs. 200", duration: "20 min" },
    ],
    availability: [
      { day: "Mon", status: "available" },
      { day: "Tue", status: "full" },
      { day: "Wed", status: "available" },
      { day: "Thu", status: "available" },
      { day: "Fri", status: "available" },
      { day: "Sat", status: "full" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: ["Morning 10am-1pm", "Afternoon 2pm-5pm"],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.7",
      total: 138,
      breakdown: [
        { label: "5 Star", value: 83 },
        { label: "4 Star", value: 12 },
        { label: "3 Star", value: 3 },
        { label: "2 Star", value: 1 },
        { label: "1 Star", value: 1 },
      ],
    },
    reviews: [],
    serviceAreas: ["Johar Town", "Wapda Town", "Township"],
    mapCenter: "Lahore",
    startingPrice: "Rs. 300",
  },
  {
    slug: "raheel-iqbal",
    name: "Raheel Iqbal",
    trade: "Plumber",
    city: "Lahore",
    rating: "4.9",
    jobs: 205,
    initials: "RI",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    location: "DHA, Lahore",
    joined: "December 2020",
    responseTime: "Usually responds in 8 minutes",
    status: "offline",
    experience: "10 yrs",
    responseAverage: "8 min",
    bio: "Senior plumber for residential fitting, drainage work, and full bathroom line upgrades with strong repeat customer ratings.",
    skills: [
      "Bathroom Fitting",
      "Drainage",
      "Pipe Installation",
      "Geyser Lines",
    ],
    services: [
      { service: "Bathroom fitting", price: "Rs. 3,500", duration: "Half day" },
      { service: "Pipe installation", price: "Rs. 6,000+", duration: "Full day" },
      { service: "Geyser line repair", price: "Rs. 1,200", duration: "1 hour" },
    ],
    availability: [
      { day: "Mon", status: "full" },
      { day: "Tue", status: "available" },
      { day: "Wed", status: "available" },
      { day: "Thu", status: "available" },
      { day: "Fri", status: "full" },
      { day: "Sat", status: "available" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: ["Morning 9am-12pm", "Evening 4pm-7pm"],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.9",
      total: 205,
      breakdown: [
        { label: "5 Star", value: 90 },
        { label: "4 Star", value: 7 },
        { label: "3 Star", value: 2 },
        { label: "2 Star", value: 1 },
        { label: "1 Star", value: 0 },
      ],
    },
    reviews: [],
    serviceAreas: ["DHA", "Cantt", "Gulberg", "Defence Road"],
    mapCenter: "Lahore",
    startingPrice: "Rs. 500",
  },
  {
    slug: "usman-ali",
    name: "Usman Ali",
    trade: "AC Technician",
    city: "Lahore",
    rating: "4.9",
    jobs: 186,
    initials: "UA",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    location: "DHA Phase 4, Lahore",
    joined: "January 2022",
    responseTime: "Usually responds in 12 minutes",
    status: "online",
    experience: "7 yrs",
    responseAverage: "12 min",
    bio: "AC and refrigerator technician focused on clean diagnostics, quick fixes, and transparent pricing for homes and small offices.",
    skills: [
      "AC Servicing",
      "Gas Refill",
      "Installation",
      "Compressor Check",
      "Cooling Issues",
      "Refrigerator Repair",
    ],
    services: [
      { service: "AC servicing", price: "Rs. 1,000", duration: "45 min" },
      { service: "Gas refill", price: "Rs. 2,500", duration: "1 hour" },
      { service: "Split AC install", price: "Rs. 3,000", duration: "2 hours" },
      {
        service: "Refrigerator inspection",
        price: "Rs. 500",
        duration: "30 min",
      },
      { service: "Site visit", price: "Rs. 300", duration: "20 min" },
    ],
    availability: [
      { day: "Mon", status: "available" },
      { day: "Tue", status: "available" },
      { day: "Wed", status: "available" },
      { day: "Thu", status: "full" },
      { day: "Fri", status: "available" },
      { day: "Sat", status: "available" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: [
      "Morning 10am-1pm",
      "Afternoon 1pm-5pm",
      "Evening 5pm-8pm",
    ],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.9",
      total: 186,
      breakdown: [
        { label: "5 Star", value: 91 },
        { label: "4 Star", value: 7 },
        { label: "3 Star", value: 2 },
        { label: "2 Star", value: 0 },
        { label: "1 Star", value: 0 },
      ],
    },
    reviews: [],
    serviceAreas: ["DHA", "Gulberg", "Johar Town", "Cantt"],
    mapCenter: "Lahore",
    startingPrice: "Rs. 300",
  },
  {
    slug: "bilal-ahmed",
    name: "Bilal Ahmed",
    trade: "Refrigerator Expert",
    city: "Karachi",
    rating: "4.8",
    jobs: 142,
    initials: "BA",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80",
    location: "Gulshan, Karachi",
    joined: "June 2022",
    responseTime: "Usually responds in 15 minutes",
    status: "offline",
    experience: "6 yrs",
    responseAverage: "15 min",
    bio: "Specialized in refrigerator cooling issues, compressor faults, and routine maintenance with clear quotations before work starts.",
    skills: [
      "Cooling Repair",
      "Compressor Check",
      "Thermostat Repair",
      "Door Seal Fix",
      "Gas Charge",
    ],
    services: [
      { service: "Cooling issue check", price: "Rs. 400", duration: "30 min" },
      {
        service: "Compressor diagnosis",
        price: "Rs. 700",
        duration: "45 min",
      },
    ],
    availability: [
      { day: "Mon", status: "full" },
      { day: "Tue", status: "available" },
      { day: "Wed", status: "available" },
      { day: "Thu", status: "available" },
      { day: "Fri", status: "full" },
      { day: "Sat", status: "available" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: ["Morning 9am-11am", "Afternoon 1pm-4pm"],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.8",
      total: 142,
      breakdown: [
        { label: "5 Star", value: 88 },
        { label: "4 Star", value: 9 },
        { label: "3 Star", value: 2 },
        { label: "2 Star", value: 1 },
        { label: "1 Star", value: 0 },
      ],
    },
    reviews: [],
    serviceAreas: ["Gulshan", "PECHS", "North Nazimabad"],
    mapCenter: "Karachi",
    startingPrice: "Rs. 400",
  },
  {
    slug: "naveed-khan",
    name: "Naveed Khan",
    trade: "Cooling Specialist",
    city: "Islamabad",
    rating: "4.7",
    jobs: 119,
    initials: "NK",
    verified: true,
    photo:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80",
    location: "G-11, Islamabad",
    joined: "September 2021",
    responseTime: "Usually responds in 18 minutes",
    status: "online",
    experience: "9 yrs",
    responseAverage: "18 min",
    bio: "Cooling systems specialist handling AC and refrigeration maintenance for families who want durable repairs and clear communication.",
    skills: [
      "Split AC",
      "Deep Service",
      "Outdoor Unit Repair",
      "Gas Refill",
      "Fridge Cooling",
    ],
    services: [
      { service: "AC tune-up", price: "Rs. 900", duration: "40 min" },
      { service: "Outdoor repair", price: "Rs. 1,200", duration: "1 hour" },
    ],
    availability: [
      { day: "Mon", status: "available" },
      { day: "Tue", status: "full" },
      { day: "Wed", status: "available" },
      { day: "Thu", status: "available" },
      { day: "Fri", status: "available" },
      { day: "Sat", status: "full" },
      { day: "Sun", status: "off" },
    ],
    timeSlots: ["Morning 8am-11am", "Evening 4pm-7pm"],
    portfolio: aliRazaPortfolio,
    reviewSummary: {
      overall: "4.7",
      total: 119,
      breakdown: [
        { label: "5 Star", value: 84 },
        { label: "4 Star", value: 11 },
        { label: "3 Star", value: 3 },
        { label: "2 Star", value: 2 },
        { label: "1 Star", value: 0 },
      ],
    },
    reviews: [],
    serviceAreas: ["G-11", "F-11", "G-10", "E-11"],
    mapCenter: "Islamabad",
    startingPrice: "Rs. 350",
  },
];

export function getWorkerBySlug(slug: string) {
  return workerProfiles.find((worker) => worker.slug === slug);
}

export function getWorkerSummaries(slugs: string[]) {
  return slugs
    .map((slug) => getWorkerBySlug(slug))
    .filter(Boolean)
    .map(
      ({ slug, name, trade, city, rating, jobs, initials, verified, photo }) => ({
        slug,
        name,
        trade,
        city,
        rating,
        jobs,
        initials,
        verified,
        photo,
      }),
    ) as WorkerSummary[];
}

export const featuredWorkers: WorkerSummary[] = getWorkerSummaries([
  "usman-ali",
  "bilal-ahmed",
  "naveed-khan",
]);
