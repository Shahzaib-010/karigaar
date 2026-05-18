import {
  getWorkerSummaries,
  type WorkerSummary,
} from "@/src/data/workers";

export type ServiceFeature = {
  icon: string;
  title: string;
  description: string;
};

export type ServicePricingRow = {
  jobType: string;
  price: string;
  duration: string;
  complexity: "Simple" | "Medium" | "Complex";
};

export type ServiceGuideItem = {
  title: string;
  body: string;
};

export type ServiceReview = {
  id: string;
  name: string;
  city: string;
  rating: string;
  jobType: string;
  date: string;
  text: string;
};

export type RelatedService = {
  slug: string;
  icon: string;
  name: string;
  startingFrom: string;
};

export type ServiceProfile = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  pageLabel: string;
  categoryLabel: string;
  rating: string;
  cities: number;
  startingPrice: string;
  heroChips: string[];
  includes: ServiceFeature[];
  bookingSteps: ServiceGuideItem[];
  pricing: ServicePricingRow[];
  note: string;
  city: string;
  workerCount: number;
  workers: WorkerSummary[];
  prepGuide: string[];
  visitTimeline: ServiceGuideItem[];
  guarantees: { title: string; icon: string; body: string }[];
  reviewsSummary: {
    overall: string;
    totalJobs: string;
  };
  reviews: ServiceReview[];
  relatedServices: RelatedService[];
  finalCtaTitle: string;
  finalCtaBody: string;
};

const nearbyElectricians = getWorkerSummaries([
  "ali-raza",
  "usman-ali",
  "naveed-khan",
]);
const nearbyPlumbers = getWorkerSummaries([
  "kamran-shehzad",
  "furqan-ahmed",
  "raheel-iqbal",
]);
const nearbyCoolingWorkers = getWorkerSummaries([
  "usman-ali",
  "bilal-ahmed",
  "naveed-khan",
]);

export const serviceProfiles: ServiceProfile[] = [
  {
    slug: "plumber",
    name: "Plumber",
    icon: "🔧",
    description:
      "Fast, reliable plumbing repairs and installations at your home",
    pageLabel: "Home Services",
    categoryLabel: "Services",
    rating: "4.7",
    cities: 18,
    startingPrice: "Rs. 300",
    heroChips: [
      "Verified workers only",
      "Price shown upfront",
      "Book in 60 seconds",
      "Rated 4.7 across 18 cities",
    ],
    includes: [
      {
        icon: "🔧",
        title: "Pipe Leaks & Bursts",
        description: "Underground, wall, or exposed pipe repair",
      },
      {
        icon: "🚿",
        title: "Tap & Faucet Repair",
        description: "Dripping taps, broken handles, replacement",
      },
      {
        icon: "🚽",
        title: "Toilet Repair",
        description: "Flush issues, seat replacement, blockage",
      },
      {
        icon: "🛁",
        title: "Bathroom Fitting",
        description: "New basin, shower, commode installation",
      },
      {
        icon: "🔩",
        title: "Water Tank",
        description: "Cleaning, float valve, overflow issues",
      },
      {
        icon: "💧",
        title: "Drainage & Blockage",
        description: "Blocked drains, sink, bathroom drain clearance",
      },
      {
        icon: "🌡️",
        title: "Geyser / Water Heater",
        description: "Installation, repair, gas connection",
      },
      {
        icon: "🏗️",
        title: "New Pipe Fitting",
        description: "Full bathroom or kitchen pipe installation",
      },
    ],
    bookingSteps: [
      {
        title: "Step 1 - Choose your job type",
        body: "Select from the list above or describe your problem in your own words. No technical knowledge needed.",
      },
      {
        title: "Step 2 - See available plumbers",
        body: "Instantly see verified plumbers near you with their ratings, experience, and starting price.",
      },
      {
        title: "Step 3 - Pick a time slot",
        body: "Choose when you want the plumber to arrive. Same day slots available in most cities.",
      },
      {
        title: "Step 4 - Plumber arrives and works",
        body: "Your plumber arrives at the confirmed time. Price is agreed before work starts. You pay only after the job is done.",
      },
    ],
    pricing: [
      {
        jobType: "Tap repair",
        price: "Rs. 300",
        duration: "15-30 min",
        complexity: "Simple",
      },
      {
        jobType: "Pipe leak fix",
        price: "Rs. 500",
        duration: "30-60 min",
        complexity: "Simple",
      },
      {
        jobType: "Toilet repair",
        price: "Rs. 600",
        duration: "30-45 min",
        complexity: "Simple",
      },
      {
        jobType: "Geyser installation",
        price: "Rs. 1,200",
        duration: "1-2 hours",
        complexity: "Medium",
      },
      {
        jobType: "Bathroom fitting",
        price: "Rs. 3,500",
        duration: "Half day",
        complexity: "Complex",
      },
      {
        jobType: "Full pipe installation",
        price: "Rs. 6,000+",
        duration: "Full day",
        complexity: "Complex",
      },
    ],
    note:
      "Parts and materials are not included in the starting price. Your plumber will inform you of any parts needed before purchasing.",
    city: "Lahore",
    workerCount: 47,
    workers: nearbyPlumbers,
    prepGuide: [
      "Know where your main water shutoff valve is",
      "Clear the area around the problem under sink or near pipes",
      "Have photos of the issue ready to share with the worker",
      "Note when the problem started - helps with diagnosis",
      "If it is a burst pipe - turn off the main valve immediately before booking",
      "Tell the worker if the area is difficult to access such as rooftop tank",
    ],
    visitTimeline: [
      {
        title: "On arrival (0-5 min)",
        body: "Worker introduces himself, shows his Karigaar ID card. You confirm the job before any work begins.",
      },
      {
        title: "Assessment (5-15 min)",
        body: "Worker inspects the issue. Gives you a final price quote. Work only starts after you agree.",
      },
      {
        title: "Work begins (15 min onwards)",
        body: "Worker carries standard tools. For parts he informs you first, and you decide whether to proceed.",
      },
      {
        title: "Job complete",
        body: "Worker shows you the completed work. You confirm it is done to your satisfaction before paying.",
      },
      {
        title: "Payment",
        body: "Pay the agreed amount. Cash or digital payment both accepted. Worker never asks for advance payment.",
      },
      {
        title: "Rate your worker",
        body: "One-tap rating takes 10 seconds. Your review helps future customers and rewards good workers.",
      },
    ],
    guarantees: [
      {
        title: "Verified Workers",
        icon: "Shield",
        body: "Every plumber on Karigaar has been verified with CNIC, address proof, and trade experience check. We vet every worker before they appear on the platform.",
      },
      {
        title: "Transparent Pricing",
        icon: "Receipt",
        body: "No hidden charges. Price is discussed and agreed before work starts. If the final price is more than quoted, you are not obligated to pay more without agreeing first.",
      },
      {
        title: "Satisfaction Promise",
        icon: "Star",
        body: "If you are not satisfied with the work, report it within 24 hours through the app. Our support team reviews every complaint and takes action.",
      },
    ],
    reviewsSummary: {
      overall: "4.7",
      totalJobs: "1,840 plumbing jobs in Lahore",
    },
    reviews: [
      {
        id: "ayesha-r",
        name: "Ayesha R.",
        city: "Gulberg, Lahore",
        rating: "★★★★★",
        jobType: "Pipe leak repair",
        date: "3 days ago",
        text: "Had a burst pipe under the kitchen sink at 9am. Booked through Karigaar, plumber arrived by 11. Fixed it cleanly, charged exactly what was quoted. No mess, no stress.",
      },
      {
        id: "bilal-m",
        name: "Bilal M.",
        city: "Model Town, Lahore",
        rating: "★★★★★",
        jobType: "Bathroom fitting",
        date: "1 week ago",
        text: "Got a full new bathroom fitted. Took one full day, two workers came. They brought most tools themselves. Very professional. Will use again for the second bathroom.",
      },
      {
        id: "huma-f",
        name: "Huma F.",
        city: "DHA, Lahore",
        rating: "★★★★☆",
        jobType: "Geyser installation",
        date: "2 weeks ago",
        text: "Good service overall. The plumber was knowledgeable and explained everything before starting. Took slightly longer than expected but the work was solid.",
      },
    ],
    relatedServices: [
      { slug: "electrician", icon: "⚡", name: "Electrician", startingFrom: "Rs. 300" },
      { slug: "carpenter", icon: "🪚", name: "Carpenter", startingFrom: "Rs. 500" },
      { slug: "painter", icon: "🎨", name: "Painter", startingFrom: "Rs. 800" },
      { slug: "ac-repair", icon: "❄️", name: "AC Repair", startingFrom: "Rs. 600" },
      { slug: "mason", icon: "🏠", name: "Mason", startingFrom: "Rs. 1,000" },
      { slug: "cleaning", icon: "🧹", name: "Cleaning", startingFrom: "Rs. 1,500" },
    ],
    finalCtaTitle: "Ready to Book a Plumber?",
    finalCtaBody:
      "Join 50,000+ customers who fixed their homes with Karigaar",
  },
  {
    slug: "electrician",
    name: "Electrician",
    icon: "⚡",
    description:
      "Certified electricians for repairs, installations, and safe home wiring",
    pageLabel: "Home Services",
    categoryLabel: "Services",
    rating: "4.8",
    cities: 18,
    startingPrice: "Rs. 300",
    heroChips: [
      "Verified workers only",
      "Price shown upfront",
      "Book in 60 seconds",
      "Rated 4.8 across 18 cities",
    ],
    includes: [
      {
        icon: "💡",
        title: "Light & Fan Repairs",
        description: "Ceiling fan, regulator, bulb holder, and fitting fixes",
      },
      {
        icon: "🔌",
        title: "Sockets & Switches",
        description: "Broken switches, burnt sockets, new plate installation",
      },
      {
        icon: "🧰",
        title: "Panel & MCB Work",
        description: "Trip issues, fuse changes, distribution board setup",
      },
      {
        icon: "🔋",
        title: "UPS & Inverter Setup",
        description: "Backup wiring, inverter fitting, load balancing",
      },
    ],
    bookingSteps: [
      {
        title: "Step 1 - Choose your electrical issue",
        body: "Select the problem type or describe it in plain words. We translate it into the right job request.",
      },
      {
        title: "Step 2 - Compare nearby electricians",
        body: "Review experience, ratings, response time, and starting price before you choose.",
      },
      {
        title: "Step 3 - Confirm a slot",
        body: "Pick the day and time that works for you. Same day visits are often available.",
      },
      {
        title: "Step 4 - Work starts after approval",
        body: "Your worker confirms the issue, quotes the final amount, and only begins after you say yes.",
      },
    ],
    pricing: [
      {
        jobType: "Switch / socket repair",
        price: "Rs. 300",
        duration: "15-30 min",
        complexity: "Simple",
      },
      {
        jobType: "Fan installation",
        price: "Rs. 500",
        duration: "30-45 min",
        complexity: "Simple",
      },
      {
        jobType: "MCB / fuse repair",
        price: "Rs. 400",
        duration: "20-30 min",
        complexity: "Simple",
      },
      {
        jobType: "Inverter setup",
        price: "Rs. 800",
        duration: "1 hour",
        complexity: "Medium",
      },
      {
        jobType: "Full wiring (1 room)",
        price: "Rs. 2,500",
        duration: "2-3 hours",
        complexity: "Complex",
      },
    ],
    note:
      "Parts and materials are not included in the starting price. Your electrician will explain any extra material cost before installation.",
    city: "Lahore",
    workerCount: 34,
    workers: nearbyElectricians,
    prepGuide: [
      "Turn off the main switch if there is visible sparking",
      "Keep the work area clear and dry",
      "List all switches, lights, or rooms affected",
      "Share photos of damaged boards or wiring if possible",
    ],
    visitTimeline: [
      {
        title: "On arrival (0-5 min)",
        body: "Worker checks the issue and confirms the exact electrical task with you.",
      },
      {
        title: "Assessment (5-15 min)",
        body: "The fault is diagnosed and a final quote is shared before work begins.",
      },
      {
        title: "Repair or install",
        body: "Standard tools are used on site and any extra parts are approved by you first.",
      },
      {
        title: "Final safety check",
        body: "The worker tests the completed work with you before closing the job.",
      },
    ],
    guarantees: [
      {
        title: "Verified Workers",
        icon: "Shield",
        body: "Every electrician is identity-verified and checked for relevant field experience before joining Karigaar.",
      },
      {
        title: "Transparent Pricing",
        icon: "Receipt",
        body: "You see the starting rate first, and the final quote is confirmed before any job begins.",
      },
      {
        title: "Satisfaction Promise",
        icon: "Star",
        body: "If something feels off, report it within 24 hours and our support team reviews the case.",
      },
    ],
    reviewsSummary: {
      overall: "4.8",
      totalJobs: "1,220 electrical jobs in Lahore",
    },
    reviews: [
      {
        id: "sana-i",
        name: "Sana I.",
        city: "Johar Town, Lahore",
        rating: "★★★★★",
        jobType: "Switch repair",
        date: "5 days ago",
        text: "The electrician diagnosed the problem quickly and fixed two sockets in one visit. Clear communication and very fair pricing.",
      },
      {
        id: "hamza-r",
        name: "Hamza R.",
        city: "Model Town, Lahore",
        rating: "★★★★★",
        jobType: "Fan installation",
        date: "10 days ago",
        text: "Booked in the morning and got same day service. Clean work and no unnecessary upsell.",
      },
      {
        id: "maha-t",
        name: "Maha T.",
        city: "Gulberg, Lahore",
        rating: "★★★★☆",
        jobType: "Inverter setup",
        date: "2 weeks ago",
        text: "Professional job overall and everything was explained in simple language before starting.",
      },
    ],
    relatedServices: [
      { slug: "plumber", icon: "🔧", name: "Plumber", startingFrom: "Rs. 300" },
      { slug: "carpenter", icon: "🪚", name: "Carpenter", startingFrom: "Rs. 500" },
      { slug: "painter", icon: "🎨", name: "Painter", startingFrom: "Rs. 800" },
      { slug: "ac-repair", icon: "❄️", name: "AC Repair", startingFrom: "Rs. 600" },
      { slug: "mason", icon: "🏠", name: "Mason", startingFrom: "Rs. 1,000" },
      { slug: "cleaning", icon: "🧹", name: "Cleaning", startingFrom: "Rs. 1,500" },
    ],
    finalCtaTitle: "Ready to Book an Electrician?",
    finalCtaBody:
      "Join 50,000+ customers who fixed their homes with Karigaar",
  },
  {
    slug: "ac-repair",
    name: "AC Repair",
    icon: "❄️",
    description:
      "Trusted AC and refrigerator service for cooling issues, gas refill, and installation",
    pageLabel: "Home Services",
    categoryLabel: "Services",
    rating: "4.9",
    cities: 12,
    startingPrice: "Rs. 600",
    heroChips: [
      "Verified workers only",
      "Price shown upfront",
      "Book in 60 seconds",
      "Rated 4.9 across major cities",
    ],
    includes: [
      {
        icon: "❄️",
        title: "Cooling Issues",
        description: "Low cooling, no cooling, and uneven airflow diagnosis",
      },
      {
        icon: "🧰",
        title: "AC Servicing",
        description: "Filter cleaning, indoor unit wash, and performance checks",
      },
      {
        icon: "🛠️",
        title: "Gas Refill",
        description: "Pressure testing and refill when leakage is ruled out",
      },
      {
        icon: "🏠",
        title: "Installation",
        description: "Split AC fitting, shifting, and basic alignment",
      },
      {
        icon: "🧊",
        title: "Refrigerator Repair",
        description: "Compressor, thermostat, and cooling fault support",
      },
      {
        icon: "🔍",
        title: "Inspection Visit",
        description: "On-site diagnostics before larger repair or replacement",
      },
      {
        icon: "⚡",
        title: "Voltage & Wiring Check",
        description: "Power and load checks for AC startup and safe operation",
      },
      {
        icon: "📦",
        title: "Outdoor Unit Work",
        description: "Drain line, fan, and condenser unit troubleshooting",
      },
    ],
    bookingSteps: [
      {
        title: "Step 1 - Tell us the cooling issue",
        body: "Choose a common problem or describe what your AC or fridge is doing right now.",
      },
      {
        title: "Step 2 - Compare available technicians",
        body: "See verified nearby workers with ratings, experience, and starting price.",
      },
      {
        title: "Step 3 - Choose your preferred slot",
        body: "Pick the visit time that suits you. Same-day support is available in many areas.",
      },
      {
        title: "Step 4 - Confirm before work begins",
        body: "Your technician inspects the issue, explains the final price, and starts only after your approval.",
      },
    ],
    pricing: [
      {
        jobType: "Inspection visit",
        price: "Rs. 300",
        duration: "20-30 min",
        complexity: "Simple",
      },
      {
        jobType: "Basic AC service",
        price: "Rs. 600",
        duration: "30-45 min",
        complexity: "Simple",
      },
      {
        jobType: "Gas refill",
        price: "Rs. 2,500",
        duration: "1 hour",
        complexity: "Medium",
      },
      {
        jobType: "Split AC installation",
        price: "Rs. 3,000",
        duration: "2-3 hours",
        complexity: "Complex",
      },
      {
        jobType: "Refrigerator diagnosis",
        price: "Rs. 500",
        duration: "30-45 min",
        complexity: "Medium",
      },
    ],
    note:
      "Extra copper pipe, brackets, gas, and replacement parts are quoted separately before any work starts.",
    city: "Lahore",
    workerCount: 29,
    workers: nearbyCoolingWorkers,
    prepGuide: [
      "Share the exact brand and model if visible",
      "Note whether the issue is no cooling, noise, or water leakage",
      "Clear space around the indoor or outdoor unit before the visit",
      "Mention if the appliance was recently shifted or installed",
    ],
    visitTimeline: [
      {
        title: "On arrival (0-5 min)",
        body: "The technician confirms the issue and checks the appliance condition before opening panels.",
      },
      {
        title: "Assessment (5-15 min)",
        body: "A diagnosis is shared along with the final quote and any parts that may be needed.",
      },
      {
        title: "Service or repair",
        body: "Cleaning, electrical checks, gas work, or installation starts only after you approve.",
      },
      {
        title: "Testing and handover",
        body: "Cooling performance is tested in front of you before the job is closed.",
      },
    ],
    guarantees: [
      {
        title: "Verified Workers",
        icon: "Shield",
        body: "Every technician is screened for identity, address, and hands-on experience before going live on Karigaar.",
      },
      {
        title: "Transparent Pricing",
        icon: "Receipt",
        body: "Starting prices are visible early and every additional cost is explained before the worker proceeds.",
      },
      {
        title: "Satisfaction Promise",
        icon: "Star",
        body: "If the job is incomplete or misleading, report it within 24 hours and our team reviews the booking.",
      },
    ],
    reviewsSummary: {
      overall: "4.9",
      totalJobs: "980 AC and refrigeration jobs in Lahore",
    },
    reviews: [
      {
        id: "sara-a",
        name: "Sara A.",
        city: "DHA, Lahore",
        rating: "★★★★★",
        jobType: "AC service",
        date: "4 days ago",
        text: "Booked a same-day AC service and the technician arrived exactly when promised. Clean work and much better cooling after the visit.",
      },
      {
        id: "talha-n",
        name: "Talha N.",
        city: "Gulberg, Lahore",
        rating: "★★★★★",
        jobType: "Gas refill",
        date: "1 week ago",
        text: "Everything was explained properly before gas refill. No surprise charges and the unit has been performing great since.",
      },
      {
        id: "hira-l",
        name: "Hira L.",
        city: "Johar Town, Lahore",
        rating: "★★★★☆",
        jobType: "Refrigerator repair",
        date: "2 weeks ago",
        text: "Professional and polite technician. The cooling issue was fixed and the pricing was fair for the amount of work done.",
      },
    ],
    relatedServices: [
      { slug: "electrician", icon: "⚡", name: "Electrician", startingFrom: "Rs. 300" },
      { slug: "plumber", icon: "🔧", name: "Plumber", startingFrom: "Rs. 300" },
      { slug: "carpenter", icon: "🪚", name: "Carpenter", startingFrom: "Rs. 500" },
      { slug: "painter", icon: "🎨", name: "Painter", startingFrom: "Rs. 800" },
      { slug: "mason", icon: "🏠", name: "Mason", startingFrom: "Rs. 1,000" },
      { slug: "cleaning", icon: "🧹", name: "Cleaning", startingFrom: "Rs. 1,500" },
    ],
    finalCtaTitle: "Ready to Book AC Repair?",
    finalCtaBody:
      "Join 50,000+ customers who fixed their homes with Karigaar",
  },
];

export function getServiceBySlug(slug: string) {
  return serviceProfiles.find((service) => service.slug === slug);
}

export const serviceCardLinks = [
  { slug: "plumber", icon: "🔧", name: "Plumber", description: "Pipe leaks, taps, bathroom fitting", available: true },
  { slug: "electrician", icon: "⚡", name: "Electrician", description: "Wiring, switches, fans, power issues", available: true },
  { slug: "carpenter", icon: "🪚", name: "Carpenter", description: "Doors, wardrobes, furniture repair", available: false },
  { slug: "painter", icon: "🎨", name: "Painter", description: "Interior painting, wall putty, polish", available: false },
  { slug: "ac-repair", icon: "❄️", name: "AC Repair", description: "Servicing, gas refill, installation", available: true },
  { slug: "mason", icon: "🏠", name: "Mason", description: "Roofing, wall repair, tile work", available: false },
  { slug: "welder", icon: "🔩", name: "Welder", description: "Grills, gates, iron work", available: false },
  { slug: "cleaning", icon: "🧹", name: "Cleaning", description: "Deep clean, sofa, carpet washing", available: false },
];
