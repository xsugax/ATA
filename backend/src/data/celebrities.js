const categories = ["Film", "Music", "Sports", "Fashion", "Business", "Influencer"];
const regions = ["North America", "Europe", "Middle East", "Asia", "Latin America", "Africa"];
const awards = ["Grammy", "Oscar", "Ballon d'Or", "Emmy", "Forbes 30", "Cannes"];
const agencies = ["CAA", "WME", "UTA", "Independent Office", "Roc Nation", "IMG"];
const partnerships = ["Nike", "LVMH", "Apple", "Netflix", "Rolex", "Patek Philippe", "Mercedes-Benz"];

const heroCelebrities = [
  { name: "Beyoncé", category: "Music", region: "North America" },
  { name: "Leonardo DiCaprio", category: "Film", region: "North America" },
  { name: "Cristiano Ronaldo", category: "Sports", region: "Europe" },
  { name: "Kim Kardashian", category: "Fashion", region: "North America" },
  { name: "Drake", category: "Music", region: "North America" },
  { name: "Dwayne Johnson", category: "Film", region: "North America" },
];

const tierTemplates = [
  { type: "Private Event", multiplier: 1.0 },
  { type: "Corporate Keynote", multiplier: 1.25 },
  { type: "Brand Endorsement", multiplier: 1.7 },
  { type: "Virtual Appearance", multiplier: 0.65 },
];

const makeAvatar = (index) => `https://i.pravatar.cc/400?img=${((index - 1) % 70) + 1}`;

const generateCelebrity = (index, seed = {}) => {
  const category = seed.category || categories[index % categories.length];
  const region = seed.region || regions[index % regions.length];
  const basePrice = 150000 + ((index * 17000) % 1350000);
  const demandIndex = 55 + (index * 7) % 45;
  const popularityScore = 60 + (index * 5) % 40;
  const availability = ["Open", "Limited", "Waitlist"][index % 3];
  const riskIndex = ["low", "medium", "high"][index % 3];

  return {
    id: `c${index + 1}`,
    name: seed.name || `Global Icon ${index + 1}`,
    verified: true,
    category,
    region,
    portrait: makeAvatar(index + 1),
    bookingTiers: tierTemplates.map((tier) => ({
      ...tier,
      startPrice: Math.round(basePrice * tier.multiplier),
    })),
    startingPrice: basePrice,
    dynamicPriceRange: {
      min: Math.round(basePrice * 0.85),
      max: Math.round(basePrice * 1.5),
    },
    averageEventRate: Math.round(basePrice * 1.18),
    demandIndex,
    popularityScore,
    netWorthTier: ["$50M+", "$100M+", "$500M+", "$1B+"][index % 4],
    availability,
    availabilityWindowDays: 7 + (index % 30),
    socialReachMillions: Number((20 + ((index * 3.8) % 280)).toFixed(1)),
    partnerships: [
      partnerships[index % partnerships.length],
      partnerships[(index + 2) % partnerships.length],
    ],
    agencyRepresentation: agencies[index % agencies.length],
    awards: [awards[index % awards.length], awards[(index + 1) % awards.length]],
    riskIndex,
    ndaDefault: index % 2 === 0,
    securityTiers: ["Standard", "Enhanced", "Executive", "Sovereign"],
    recentBrandAlignment: partnerships[(index + 3) % partnerships.length],
    eventCompatibility: ["Summit", "Gala", "Launch", "Private Dinner", "Festival"].slice(0, 3 + (index % 3)),
  };
};

const generated = Array.from({ length: 100 }, (_, index) => {
  if (index < heroCelebrities.length) {
    return generateCelebrity(index, heroCelebrities[index]);
  }
  return generateCelebrity(index);
});

export const celebrities = generated;

export const applyCelebrityFilters = (data, filters) => {
  return data.filter((celebrity) => {
    if (filters.search && !celebrity.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && filters.category !== "All" && celebrity.category !== filters.category) {
      return false;
    }
    if (filters.region && filters.region !== "All" && celebrity.region !== filters.region) {
      return false;
    }
    if (filters.minPrice && celebrity.startingPrice < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && celebrity.startingPrice > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.minPopularity && celebrity.popularityScore < Number(filters.minPopularity)) {
      return false;
    }
    if (filters.minDemand && celebrity.demandIndex < Number(filters.minDemand)) {
      return false;
    }
    if (filters.maxAvailabilityDays && celebrity.availabilityWindowDays > Number(filters.maxAvailabilityDays)) {
      return false;
    }
    if (filters.netWorthTier && filters.netWorthTier !== "All" && celebrity.netWorthTier !== filters.netWorthTier) {
      return false;
    }
    if (filters.eventType && filters.eventType !== "All" && !celebrity.eventCompatibility.includes(filters.eventType)) {
      return false;
    }
    return true;
  });
};
