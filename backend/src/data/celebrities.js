const partnerships = ["Nike", "LVMH", "Apple", "Netflix", "Rolex", "Patek Philippe", "Mercedes-Benz"];
const awards = ["Grammy", "Oscar", "Ballon d\u2019Or", "Emmy", "Forbes 30", "Cannes"];

const tierTemplates = [
  { type: "Private Event",      multiplier: 1.0  },
  { type: "Corporate Keynote",  multiplier: 1.25 },
  { type: "Brand Endorsement",  multiplier: 1.70 },
  { type: "Virtual Appearance", multiplier: 0.65 },
];

// Accurate portrait map — keyed by celebrity name, verified by visual inspection
const PORTRAIT_MAP = {
  "Beyonce":            "/assets/portraits/c1.jpg",
  "Leonardo DiCaprio":  "/assets/portraits/c2.jpg",
  "Cristiano Ronaldo":  "/assets/portraits/c3.jpg",
  "Kim Kardashian":     "/assets/portraits/c4.jpg",
  "Drake":              "/assets/portraits/c5.jpg",
  "Dwayne Johnson":     "/assets/portraits/c6.jpg",
  "Zendaya":            "/assets/portraits/c11.jpg",
  "Taylor Swift":       "/assets/portraits/c12.png",
  "Rihanna":            "/assets/portraits/c13.png",
  "Lewis Hamilton":     "/assets/portraits/c14.jpg",
  "Margot Robbie":      "/assets/portraits/c16.jpg",
  "Priyanka Chopra":    "/assets/portraits/c35.jpg",
  "Lionel Messi":       "/assets/portraits/c38.jpg",
  "LeBron James":       "/assets/portraits/c39.jpg",
  "Serena Williams":    "/assets/portraits/c40.jpg",
  "Naomi Osaka":        "/assets/portraits/c41.png",
  "Simone Biles":       "/assets/portraits/c42.jpg",
  "Shakira":            "/assets/portraits/c43.jpg",
  "Bad Bunny":          "/assets/portraits/c44.jpg",
  "Jennifer Lopez":     "/assets/portraits/c45.jpg",
  "Maluma":             "/assets/portraits/c46.jpg",
  "Ed Sheeran":         "/assets/portraits/c50.jpg",
  "Ariana Grande":      "/assets/portraits/c51.jpg",
  "Billie Eilish":      "/assets/portraits/c52.jpg",
  "Adele":              "/assets/portraits/c54.jpg",
  "Bruno Mars":         "/assets/portraits/c55.jpg",
  "The Weeknd":         "/assets/portraits/c56.jpg",
  "Cardi B":            "/assets/portraits/c57.png",
  "Nicki Minaj":        "/assets/portraits/c58.jpg",
  "Will Smith":         "/assets/portraits/c59.jpg",
  "Denzel Washington":  "/assets/portraits/c60.jpg",
  "Chris Hemsworth":    "/assets/portraits/c66.jpg",
  "Ryan Reynolds":      "/assets/portraits/c67.jpg",
  "Nicole Kidman":      "/assets/portraits/c68.jpg",
  "Cate Blanchett":     "/assets/portraits/c70.jpg",
  "J Balvin":           "/assets/portraits/c75.jpg",
  "Jackie Chan":        "/assets/portraits/c78.jpg",
  "Vin Diesel":         "/assets/portraits/c81.jpg",
  "Akon":               "/assets/portraits/c84.png",
  "Elton John":         "/assets/portraits/c85.jpg",
  "Roger Federer":      "/assets/portraits/c87.jpg",
  "Rafael Nadal":       "/assets/portraits/c88.jpg",
  "Novak Djokovic":     "/assets/portraits/c90.jpg",
  "Post Malone":        "/assets/portraits/c91.jpg",
  "Kevin Hart":         "/assets/portraits/c94.jpg",
  "Lady Gaga":          "/assets/portraits/c120.jpg",
  "Jay-Z":              "/assets/portraits/c121.jpg",
  "Justin Bieber":      "/assets/portraits/c122.jpg",
  "Kanye West":         "/assets/portraits/c123.jpg",
  "Eminem":             "/assets/portraits/c124.jpg",
  "Madonna":            "/assets/portraits/c125.jpg",
  "Snoop Dogg":         "/assets/portraits/c126.jpg",
  "Brad Pitt":          "/assets/portraits/c127.jpg",
  "Angelina Jolie":     "/assets/portraits/c128.jpg",
  "Tom Cruise":         "/assets/portraits/c129.jpg",
  "Robert Downey Jr.":  "/assets/portraits/c130.jpg",
  "Scarlett Johansson": "/assets/portraits/c131.jpg",
  "Tom Hanks":          "/assets/portraits/c132.jpg",
  "Julia Roberts":      "/assets/portraits/c133.jpg",
  "Morgan Freeman":     "/assets/portraits/c134.jpg",
  "Meryl Streep":       "/assets/portraits/c135.jpg",
  "Sandra Bullock":     "/assets/portraits/c136.jpg",
  "Tiger Woods":        "/assets/portraits/c137.jpg",
  "Michael Jordan":     "/assets/portraits/c138.jpg",
  "Usain Bolt":         "/assets/portraits/c139.jpg",
  "Neymar Jr.":         "/assets/portraits/c140.jpg",
  "Kylian Mbappe":      "/assets/portraits/c141.jpg",
  "Stephen Curry":      "/assets/portraits/c142.jpg",
  "Kevin Durant":       "/assets/portraits/c143.jpg",
  "Floyd Mayweather":   "/assets/portraits/c144.jpg",
  "Conor McGregor":     "/assets/portraits/c145.jpg",
  "Anthony Joshua":     "/assets/portraits/c146.png",
  "Kylie Jenner":       "/assets/portraits/c147.png",
  "Kendall Jenner":     "/assets/portraits/c148.jpg",
  "Gigi Hadid":         "/assets/portraits/c149.jpg",
  "Bella Hadid":        "/assets/portraits/c150.jpg",
  "Naomi Campbell":     "/assets/portraits/c151.jpg",
  "Cara Delevingne":    "/assets/portraits/c152.jpg",
  "Heidi Klum":         "/assets/portraits/c153.jpg",
  "Tyra Banks":         "/assets/portraits/c154.png",
  "Paris Hilton":       "/assets/portraits/c155.jpg",
  "Hailey Bieber":      "/assets/portraits/c156.jpg",
  "Emily Ratajkowski":  "/assets/portraits/c157.jpg",
  "Chrissy Teigen":     "/assets/portraits/c158.png",
  "Winnie Harlow":      "/assets/portraits/c159.jpg",
  "Karlie Kloss":       "/assets/portraits/c160.png",
  "Oprah Winfrey":      "/assets/portraits/c161.jpg",
  "Tony Robbins":       "/assets/portraits/c162.jpg",
  "Gary Vaynerchuk":    "/assets/portraits/c163.jpg",
  "Will.i.am":          "/assets/portraits/c164.jpg",
  "Steve Harvey":       "/assets/portraits/c165.jpg",
  "Pitbull":            "/assets/portraits/c166.jpg",
  "Enrique Iglesias":   "/assets/portraits/c167.jpg",
  "Marc Anthony":       "/assets/portraits/c168.png",
  "Alicia Keys":        "/assets/portraits/c169.jpg",
  "John Legend":        "/assets/portraits/c170.jpg",
  "Carlos Santana":     "/assets/portraits/c171.jpg",
  "Daddy Yankee":       "/assets/portraits/c172.png",
  "Luis Fonsi":         "/assets/portraits/c173.jpg",
};

const parseNetWorthTier = (worth) => {
  const num = parseFloat(worth.replace(/[$,+]/g, ""));
  const millions = /[bB]/.test(worth) ? num * 1000 : num;
  if (millions >= 1000) return "$1B+";
  if (millions >= 500)  return "$500M+";
  if (millions >= 100)  return "$100M+";
  return "$50M+";
};

const seeds = [
  { name: "Beyonce",           cat: "Music",      region: "North America", price: 2500000, worth: "$540M",  reach: 320, agency: "CAA",         signal: "The definitive global live-performance icon. Renaissance World Tour grossed $580M. Private shows start at $2.5M with six-week advance coordination and full NDA stack." },
  { name: "Taylor Swift",      cat: "Music",      region: "North America", price: 3000000, worth: "$1.1B",  reach: 380, agency: "WME",         signal: "Billboard's highest-grossing touring artist of all time. Eras Tour cleared $1B. Private access requires platinum-level escrow and 60-day logistics lead time." },
  { name: "Rihanna",           cat: "Music",      region: "North America", price: 2000000, worth: "$1.4B",  reach: 340, agency: "CAA",         signal: "Super Bowl LVII halftime headliner and Fenty Beauty billionaire. Private appearances are rare and exclusively through certified third-party representation." },
  { name: "Drake",             cat: "Music",      region: "North America", price: 1500000, worth: "$250M",  reach: 162, agency: "WME",         signal: "Certified Billboard record-breaker with 275 charted entries. Private events require escrow confirmation 45 days prior and background-screened guest list." },
  { name: "Jay-Z",             cat: "Music",      region: "North America", price: 1800000, worth: "$2.5B",  reach: 74,  agency: "Roc Nation",  signal: "Entrepreneur-mogul and first hip-hop billionaire. Engagements are curated at sovereign-fund level; calendar access routed through Roc Nation C-suite only." },
  { name: "Lady Gaga",         cat: "Music",      region: "North America", price: 1200000, worth: "$320M",  reach: 88,  agency: "CAA",         signal: "RIAA platinum 29-time certified artist and Oscar winner. Theatrical private events available through Haus of Gaga coordination with full production rider." },
  { name: "Bruno Mars",        cat: "Music",      region: "North America", price: 1000000, worth: "$175M",  reach: 68,  agency: "WME",         signal: "Las Vegas residency record-holder at $90M+ per annum. Private bookings demand full production crew and 30-day setup window with venue pre-approval." },
  { name: "The Weeknd",        cat: "Music",      region: "North America", price: 1200000, worth: "$300M",  reach: 114, agency: "CAA",         signal: "After Hours Til Dawn Tour grossed $280M. Private engagements through XO Management require advance vetting and full creative briefing." },
  { name: "Adele",             cat: "Music",      region: "Europe",        price: 2000000, worth: "$220M",  reach: 52,  agency: "WME",         signal: "Las Vegas residency grossed $800M across 100 nights. Private appearances routed exclusively through Columbia Records partnership desk with 90-day lead." },
  { name: "Justin Bieber",     cat: "Music",      region: "North America", price: 1000000, worth: "$300M",  reach: 290, agency: "CAA",         signal: "Grammy-winning artist with 100B+ combined streams. Private events require confirmed guest lists, enhanced security protocols and management clearance." },
  { name: "Ariana Grande",     cat: "Music",      region: "North America", price: 1200000, worth: "$200M",  reach: 378, agency: "CAA",         signal: "Certified diamond recording artist and Wicked global lead. All private engagements require written rider approval, premium venue standards and advance NDA execution." },
  { name: "Nicki Minaj",       cat: "Music",      region: "North America", price:  500000, worth: "$100M",  reach: 218, agency: "WME",         signal: "Platinum rap icon and Pink Friday 2 tour headliner. Engagements subject to Queen production approval; intake through WME Music desk only." },
  { name: "Post Malone",       cat: "Music",      region: "North America", price:  600000, worth: "$45M",   reach: 66,  agency: "CAA",         signal: "Multi-genre certified platinum artist with 40B+ streams. Private appearances require 30-day advance through Republic Records coordination desk." },
  { name: "Ed Sheeran",        cat: "Music",      region: "Europe",        price:  700000, worth: "$200M",  reach: 112, agency: "WME",         signal: "World's highest-grossing solo touring artist this decade. Intimate performances available via Atlantic Records booking desk with 21-day advance." },
  { name: "Cardi B",           cat: "Music",      region: "North America", price:  500000, worth: "$40M",   reach: 186, agency: "WME",         signal: "Grammy Award-winning artist and cultural phenomenon. Events capped at 12 per year; all bookings require advance qualifier screening through WME." },
  { name: "Kanye West",        cat: "Music",      region: "North America", price: 1800000, worth: "$400M",  reach: 98,  agency: "Independent", signal: "Creative polymath, certified platinum artist and YEEZY brand architect. Access is strictly by referral through verified independent intermediaries only." },
  { name: "Eminem",            cat: "Music",      region: "North America", price:  800000, worth: "$250M",  reach: 58,  agency: "WME",         signal: "Best-selling rap artist of all time with 220M+ records sold. Private engagements require full NDA execution and platinum event classification." },
  { name: "Billie Eilish",     cat: "Music",      region: "North America", price:  700000, worth: "$50M",   reach: 108, agency: "CAA",         signal: "Youngest artist to sweep all four major Grammy categories. Private access through Darkroom/Interscope with advance qualification and sustainability alignment." },
  { name: "Bad Bunny",         cat: "Music",      region: "Latin America", price: 1000000, worth: "$48M",   reach: 92,  agency: "WME",         signal: "Billboard's most-streamed artist three consecutive years. Private engagements through Rimas Entertainment require full escrow within 15 days of inquiry." },
  { name: "Shakira",           cat: "Music",      region: "Latin America", price:  800000, worth: "$300M",  reach: 88,  agency: "CAA",         signal: "80M records sold worldwide. Private performances demand full Copa production crew, six-week lead time and confirmed venue certification." },
  { name: "Jennifer Lopez",    cat: "Music",      region: "North America", price: 1000000, worth: "$400M",  reach: 248, agency: "WME",         signal: "A-list film and music icon with $3B+ lifetime touring gross. Private events limited to 8 per year via Nuyorican Productions." },
  { name: "Mariah Carey",      cat: "Music",      region: "North America", price: 1000000, worth: "$320M",  reach: 66,  agency: "CAA",         signal: "Best-selling female recording artist with 200M+ records sold. Annual holiday engagement slots are the most competed private booking in music." },
  { name: "Madonna",           cat: "Music",      region: "North America", price: 1500000, worth: "$850M",  reach: 74,  agency: "WME",         signal: "Best-selling female touring artist in history at $1.4B+ gross. Corporate engagements through Live Nation with full creative co-development agreement." },
  { name: "Elton John",        cat: "Music",      region: "Europe",        price: 1500000, worth: "$550M",  reach: 42,  agency: "WME",         signal: "Farewell Yellow Brick Road Tour grossed $939M. A full concert experience requires 8-week advance booking and Royal Charter-level NDA." },
  { name: "Snoop Dogg",        cat: "Music",      region: "North America", price:  500000, worth: "$160M",  reach: 94,  agency: "CAA",         signal: "Olympic Games co-host and global brand ambassador. 150+ private appearances annually; bookings via CAA affiliated desk." },
  { name: "Leonardo DiCaprio", cat: "Film",       region: "North America", price: 1200000, worth: "$300M",  reach: 62,  agency: "CAA",         signal: "Oscar winner and UN Environment Programme advocate. Rare private appearances exclusively through environmental summit frameworks; 90-day lead required." },
  { name: "Dwayne Johnson",    cat: "Film",       region: "North America", price: 1000000, worth: "$800M",  reach: 396, agency: "WME",         signal: "Highest-paid actor 2016-2022 and Forbes #1 social media earner. Private keynotes via Seven Bucks Productions with 30-day lead and confirmed audience tier." },
  { name: "Brad Pitt",         cat: "Film",       region: "North America", price:  800000, worth: "$400M",  reach: 38,  agency: "CAA",         signal: "Two-time Oscar nominee and Plan B Entertainment producer. Private appearances are strictly curated; intake through Plan B with verified event classification." },
  { name: "Angelina Jolie",    cat: "Film",       region: "North America", price:  800000, worth: "$160M",  reach: 46,  agency: "WME",         signal: "Oscar winner, UNHCR Special Envoy and Atelier Jolie founder. Private engagements require humanitarian or cultural event alignment and UNHCR clearance." },
  { name: "Will Smith",        cat: "Film",       region: "North America", price:  600000, worth: "$350M",  reach: 78,  agency: "CAA",         signal: "Oscar-winning actor and Westbrook Inc. co-founder. Private appearances via Westbrook with 21-day lead, full media rights agreement and NDA stack." },
  { name: "Tom Cruise",        cat: "Film",       region: "North America", price:  800000, worth: "$600M",  reach: 28,  agency: "CAA",         signal: "Mission Impossible producer-star and Top Gun: Maverick $1.5B record-holder. All private engagements require background-vetted guest lists and air-side security." },
  { name: "Robert Downey Jr.", cat: "Film",       region: "North America", price: 1000000, worth: "$300M",  reach: 72,  agency: "UTA",         signal: "Iron Man franchise anchor and Oppenheimer Oscar winner. Private keynotes via Team Downey require confirmed partner-level NDA and 45-day advance commitment." },
  { name: "Scarlett Johansson",cat: "Film",       region: "North America", price:  700000, worth: "$165M",  reach: 44,  agency: "CAA",         signal: "Highest-grossing actress of all time and These Pictures founder. Events require full exclusivity clause, media blackout agreement and advance screening." },
  { name: "Zendaya",           cat: "Film",       region: "North America", price:  500000, worth: "$20M",   reach: 182, agency: "WME",         signal: "Emmy winner, Dune and Challengers global lead. Private access exclusively via Dune Productions international desk." },
  { name: "Ryan Reynolds",     cat: "Film",       region: "North America", price:  700000, worth: "$350M",  reach: 52,  agency: "WME",         signal: "Maximum Effort Productions co-founder and Aviation Gin $610M sale architect. Private appearances include integrated brand partnerships and comedy licensing." },
  { name: "Chris Hemsworth",   cat: "Film",       region: "North America", price:  600000, worth: "$130M",  reach: 60,  agency: "CAA",         signal: "Thor franchise anchor and CENTR wellness platform founder. Private engagements via DG Entertainment require advance rider qualification and NDA." },
  { name: "Tom Hanks",         cat: "Film",       region: "North America", price:  600000, worth: "$400M",  reach: 22,  agency: "CAA",         signal: "Two-time consecutive Oscar winner and Pistachio Pictures founder. Private engagements for charitable or educational events only; bookings only via Playtone." },
  { name: "Julia Roberts",     cat: "Film",       region: "North America", price:  500000, worth: "$250M",  reach: 18,  agency: "WME",         signal: "America's sweetheart, Oscar laureate and Lancome global ambassador. Private appearances at premium gala-level events with 45-day advance booking." },
  { name: "Margot Robbie",     cat: "Film",       region: "North America", price:  600000, worth: "$50M",   reach: 58,  agency: "CAA",         signal: "LuckyChap Entertainment co-founder and Barbie $1.44B domestic record-holder. Events via LuckyChap with full executive-level vetting and media clearance." },
  { name: "Denzel Washington", cat: "Film",       region: "North America", price:  600000, worth: "$280M",  reach: 14,  agency: "WME",         signal: "Two-time Oscar winner and NAACP Spingarn Medal laureate. Private events aligned exclusively with educational, faith-based or leadership programming." },
  { name: "Morgan Freeman",    cat: "Film",       region: "North America", price:  500000, worth: "$250M",  reach: 16,  agency: "CAA",         signal: "Oscar-winning anchor of six $1B+ franchise films. Private engagements via Revelations Entertainment; strictly limited to four appearances per year." },
  { name: "Meryl Streep",      cat: "Film",       region: "North America", price:  500000, worth: "$160M",  reach: 8,   agency: "UTA",         signal: "Most nominated actor in Oscar history with 21 nominations. Private appearances exclusively aligned to arts, culture or humanitarian summit platforms." },
  { name: "Cate Blanchett",    cat: "Film",       region: "Europe",        price:  500000, worth: "$95M",   reach: 12,  agency: "WME",         signal: "Two-time Oscar winner and Armani Beauty ambassador. Private engagements available only through Sydney-based management with European tour alignment." },
  { name: "Nicole Kidman",     cat: "Film",       region: "North America", price:  600000, worth: "$250M",  reach: 22,  agency: "CAA",         signal: "Oscar winner, Emmy winner and OMEGA global brand ambassador. Private events require six-week qualification, full briefing and confirmed media embargo." },
  { name: "Sandra Bullock",    cat: "Film",       region: "North America", price:  500000, worth: "$250M",  reach: 18,  agency: "WME",         signal: "Oscar-winning actress and Fortis Films producer. Private events limited to three per year and routed exclusively via registered management representation." },
  { name: "Cristiano Ronaldo", cat: "Sports",     region: "Europe",        price: 3000000, worth: "$1.2B",  reach: 636, agency: "IMG",         signal: "Most-followed individual on social media and highest-earning footballer in history. Private access requires 90-day executive coordination and sovereign-level NDA." },
  { name: "Lionel Messi",      cat: "Sports",     region: "Latin America", price: 2500000, worth: "$1.1B",  reach: 504, agency: "IMG",         signal: "Eight-time Ballon d'Or winner and 2022 World Cup champion. Private appearances available through Inter Miami management with confirmed 60-day lead." },
  { name: "LeBron James",      cat: "Sports",     region: "North America", price: 1500000, worth: "$1.2B",  reach: 162, agency: "CAA",         signal: "Most decorated active NBA player and SpringHill Company founder. Private events require executive partner qualification and 45-day production lead." },
  { name: "Tiger Woods",       cat: "Sports",     region: "North America", price: 1200000, worth: "$1.1B",  reach: 22,  agency: "IMG",         signal: "15-time Major champion and highest-earning golfer in history ($1.8B+ career earnings). Private appearances via TGR Ventures with confirmed partner-level escrow." },
  { name: "Serena Williams",   cat: "Sports",     region: "North America", price:  800000, worth: "$290M",  reach: 16,  agency: "WME",         signal: "23-time Grand Slam champion and Serena Ventures $111M fund founder. Private keynotes require VC/leadership event alignment and confirmed audience brief." },
  { name: "Roger Federer",     cat: "Sports",     region: "Europe",        price:  700000, worth: "$650M",  reach: 14,  agency: "IMG",         signal: "20-time Grand Slam champion, Laver Cup founder and On Running ambassador. All appearances via TEAM8 Management with 45-day advance booking." },
  { name: "Michael Jordan",    cat: "Sports",     region: "North America", price: 2000000, worth: "$3B",    reach: 58,  agency: "IMG",         signal: "Six-time NBA champion and billionaire Charlotte Hornets owner. Appearances exclusively through Jordan Brand with 90-day lead, escrow and background screening." },
  { name: "Usain Bolt",        cat: "Sports",     region: "Latin America", price:  600000, worth: "$90M",   reach: 10,  agency: "IMG",         signal: "World's fastest human and eight-time Olympic gold medalist. Appearances via Bolt Enterprises with confirmed production brief and brand partner alignment." },
  { name: "Novak Djokovic",    cat: "Sports",     region: "Europe",        price:  700000, worth: "$220M",  reach: 12,  agency: "IMG",         signal: "Record 24-time Grand Slam champion. Private events via ND Management with confirmed international venue qualification and full NDA execution." },
  { name: "Rafael Nadal",      cat: "Sports",     region: "Europe",        price:  700000, worth: "$200M",  reach: 18,  agency: "IMG",         signal: "22-time Grand Slam champion and Rafa Nadal Foundation patron. Private events with charitable framework alignment preferred; 30-day advance required." },
  { name: "Neymar Jr.",        cat: "Sports",     region: "Latin America", price: 1500000, worth: "$200M",  reach: 220, agency: "IMG",         signal: "Most expensive transfer in football history at 222M euros. Private engagements via NR Sport Management require 60-day lead and certified fan-safe protocols." },
  { name: "Kylian Mbappe",     cat: "Sports",     region: "Europe",        price: 1500000, worth: "$200M",  reach: 198, agency: "IMG",         signal: "Youngest World Cup finalist since Pele and Real Madrid's marquee acquisition. Private appearances via KM Productions with full executive NDA and escrow." },
  { name: "Stephen Curry",     cat: "Sports",     region: "North America", price: 1000000, worth: "$160M",  reach: 48,  agency: "WME",         signal: "NBA all-time 3-point record holder and Unanimous MVP. Private events via Unanimous Media require confirmed audience tier and 30-day production lead." },
  { name: "Kevin Durant",      cat: "Sports",     region: "North America", price:  800000, worth: "$210M",  reach: 38,  agency: "CAA",         signal: "Two-time NBA champion, Olympic gold medalist and Boardroom founder. Private engagements require confirmed event tier qualification and full NDA." },
  { name: "Floyd Mayweather",  cat: "Sports",     region: "North America", price: 1000000, worth: "$1B",    reach: 28,  agency: "Independent", signal: "Undefeated 50-0 world champion and Mayweather Promotions CEO. Private events require certified escrow only; all booking via Mayweather organization directly." },
  { name: "Conor McGregor",    cat: "Sports",     region: "Europe",        price: 1000000, worth: "$200M",  reach: 46,  agency: "WME",         signal: "Dual-weight UFC world champion and Proper No. Twelve founder. Private events exclusively via McGregor Sports & Entertainment with full security sweep." },
  { name: "Naomi Osaka",       cat: "Sports",     region: "Asia",          price:  600000, worth: "$60M",   reach: 22,  agency: "IMG",         signal: "Four-time Grand Slam champion and KINLO beauty founder. Appearances capped at six per year; advance qualification and partner-level NDA required." },
  { name: "Lewis Hamilton",    cat: "Sports",     region: "Europe",        price: 1000000, worth: "$285M",  reach: 34,  agency: "WME",         signal: "Seven-time F1 World Champion, race equality activist and X44 Extreme E owner. Private events require full background screening and 45-day advance." },
  { name: "Simone Biles",      cat: "Sports",     region: "North America", price:  400000, worth: "$16M",   reach: 14,  agency: "WME",         signal: "Most decorated gymnast in World Championship history with 37 medals. Keynotes and private appearances via WME Sports desk with 30-day advance." },
  { name: "Anthony Joshua",    cat: "Sports",     region: "Europe",        price:  500000, worth: "$100M",  reach: 18,  agency: "IMG",         signal: "Two-time unified IBF/WBA/WBO heavyweight world champion. Private events via 258 MGT with advance security clearance and venue qualification." },
  { name: "Kim Kardashian",    cat: "Fashion",    region: "North America", price:  800000, worth: "$1.7B",  reach: 364, agency: "WME",         signal: "SKIMS $4B valuation founder and Skkn by Kim co-founder. Appearances via SKIMS LLC comms desk with confirmed NDA, media rights agreement, and 30-day advance." },
  { name: "Kylie Jenner",      cat: "Fashion",    region: "North America", price:  500000, worth: "$700M",  reach: 400, agency: "WME",         signal: "Kylie Cosmetics co-founder and Forbes cover subject. Private engagements via Jenner Communications require full NDA, style brief and production rider." },
  { name: "Kendall Jenner",    cat: "Fashion",    region: "North America", price:  400000, worth: "$60M",   reach: 300, agency: "WME",         signal: "World's highest-paid model per Forbes. All runway and private event bookings exclusively via Jenner Communications with confirmed press embargo." },
  { name: "Gigi Hadid",        cat: "Fashion",    region: "North America", price:  350000, worth: "$29M",   reach: 82,  agency: "IMG",         signal: "Top-ranked supermodel with 35+ cover appearances per year. Events via IMG Models require fashion industry alignment and full editorial agreement." },
  { name: "Bella Hadid",       cat: "Fashion",    region: "North America", price:  300000, worth: "$25M",   reach: 58,  agency: "IMG",         signal: "Vogue Model of the Year. Private appearances via The Wall Group with advance press rights negotiation and brand integration agreement." },
  { name: "Naomi Campbell",    cat: "Fashion",    region: "Europe",        price:  400000, worth: "$75M",   reach: 18,  agency: "Independent", signal: "Fashion royalty with 35+ year career and Fashion for Relief charity founder. Events and runway appearances through NC Management at sovereign-tier pricing only." },
  { name: "Cara Delevingne",   cat: "Fashion",    region: "Europe",        price:  300000, worth: "$50M",   reach: 44,  agency: "WME",         signal: "Multi-hyphenate model, actress and activist. Engagements via Storm Model Management at confirmed editorial rate with advance production brief." },
  { name: "Heidi Klum",        cat: "Fashion",    region: "Europe",        price:  280000, worth: "$160M",  reach: 16,  agency: "UTA",         signal: "Sports Illustrated Swimsuit icon and AGT judge. Private corporate events and runway appearances via Creature Entertainment with 21-day advance." },
  { name: "Tyra Banks",        cat: "Fashion",    region: "North America", price:  250000, worth: "$90M",   reach: 14,  agency: "CAA",         signal: "Sports Illustrated Swimsuit trailblazer and ANTM creator. Corporate keynotes and private events via Bankable Productions with confirmed audience." },
  { name: "Paris Hilton",      cat: "Fashion",    region: "North America", price:  350000, worth: "$300M",  reach: 22,  agency: "CAA",         signal: "11:11 Media founder and Forbes-recognized technology entrepreneur. Private event appearances available via 11:11 Media talent desk with brand alignment." },
  { name: "Hailey Bieber",     cat: "Fashion",    region: "North America", price:  300000, worth: "$20M",   reach: 52,  agency: "WME",         signal: "Rhode Skin co-founder and Levi's and Versace global ambassador. Private events via The Wall Group with confirmed brand integration and NDA." },
  { name: "Emily Ratajkowski", cat: "Influencer", region: "North America", price:  200000, worth: "$8M",    reach: 32,  agency: "CAA",         signal: "Inamorata founder and My Body essayist. Private appearances and brand integrations exclusively via CAA Influencer desk with editorial alignment." },
  { name: "Chrissy Teigen",    cat: "Influencer", region: "North America", price:  250000, worth: "$75M",   reach: 42,  agency: "WME",         signal: "Cravings culinary brand founder and cookbook author. Private dining events and brand integrations via WME Lifestyle desk with 14-day advance." },
  { name: "Winnie Harlow",     cat: "Fashion",    region: "North America", price:  200000, worth: "$8M",    reach: 10,  agency: "IMG",         signal: "Vitiligo activist, Sports Illustrated cover model and global ambassador. Events via The Wall Group with confirmed platform alignment and social brief." },
  { name: "Karlie Kloss",      cat: "Fashion",    region: "North America", price:  250000, worth: "$18M",   reach: 12,  agency: "IMG",         signal: "Kode With Klossy STEM founder and Victoria's Secret Angel. Private events with STEM or innovation alignment preferred; bookings via IMG Models desk." },
  { name: "Oprah Winfrey",     cat: "Business",   region: "North America", price: 1500000, worth: "$2.8B",  reach: 44,  agency: "WME",         signal: "Highest-rated talk show host in history and OWN Network founder. Appearances for leadership, wellness or publishing summits only via Harpo Productions desk." },
  { name: "Tony Robbins",      cat: "Business",   region: "North America", price: 1000000, worth: "$600M",  reach: 28,  agency: "WME",         signal: "Life strategist, nine-time NYT bestseller and Unleash the Power Within record-holder. Seminars and private events via Robbins Research International." },
  { name: "Gary Vaynerchuk",   cat: "Business",   region: "North America", price:  200000, worth: "$200M",  reach: 42,  agency: "Independent", signal: "VaynerMedia chairman and NFT and Web3 thought leader. Corporate keynotes via VaynerTalent with confirmed C-suite audience brief and 14-day advance." },
  { name: "Kevin Hart",        cat: "Film",       region: "North America", price:  800000, worth: "$450M",  reach: 166, agency: "CAA",         signal: "Highest-grossing stand-up comedian and HartBeat Studios founder. Corporate events via Hartbeat require full comedy rights licensing agreement." },
  { name: "Will.i.am",         cat: "Music",      region: "North America", price:  400000, worth: "$70M",   reach: 22,  agency: "UTA",         signal: "Black Eyed Peas founder and will.i.am brands AI-tech CEO. Private tech summits and corporate events available via i.am+ enterprise desk." },
  { name: "Steve Harvey",      cat: "Film",       region: "North America", price:  500000, worth: "$200M",  reach: 28,  agency: "CAA",         signal: "#1 daytime talk show host and Steve Harvey Global CEO. Corporate event hosting appearances via Steve Harvey Global with audience qualification." },
  { name: "Pitbull",           cat: "Music",      region: "Latin America", price:  400000, worth: "$100M",  reach: 28,  agency: "WME",         signal: "Mr. Worldwide with 25M+ records sold globally and Formula E race franchise owner. Private events and corporate occasions via WME Latin desk." },
  { name: "Enrique Iglesias",  cat: "Music",      region: "Europe",        price:  500000, worth: "$100M",  reach: 18,  agency: "WME",         signal: "Best-selling Latin recording artist of all time with 180M records sold. Private concert events via EI Entertainment with full production rider." },
  { name: "Marc Anthony",      cat: "Music",      region: "Latin America", price:  400000, worth: "$80M",   reach: 16,  agency: "CAA",         signal: "Multiple Grammy and Latin Grammy winner and Magnus Media co-founder. Private events require 30-day lead, full NDA and confirmed Latin market alignment." },
  { name: "Alicia Keys",       cat: "Music",      region: "North America", price:  700000, worth: "$150M",  reach: 38,  agency: "WME",         signal: "15-time Grammy winner, Broadway producer and She Is the Music co-founder. Keynotes and private events via AK Worldwide with purpose and values alignment." },
  { name: "John Legend",       cat: "Music",      region: "North America", price:  600000, worth: "$100M",  reach: 28,  agency: "CAA",         signal: "EGOT recipient and Get Lifted Film Co. founder. Private events via Get Lifted require confirmed ethical brand alignment and 21-day advance." },
  { name: "Carlos Santana",    cat: "Music",      region: "Latin America", price:  400000, worth: "$50M",   reach: 10,  agency: "WME",         signal: "Rock and Roll Hall of Fame inductee and Supernatural Grammy sweep record-holder. Private concert events via Santana Management with full production rider." },
  { name: "J Balvin",          cat: "Music",      region: "Latin America", price:  600000, worth: "$30M",   reach: 54,  agency: "WME",         signal: "Reggaeton global ambassador with 90M social followers. Private events via J Balvin Enterprises require Latin market vetting and advance cultural brief." },
  { name: "Daddy Yankee",      cat: "Music",      region: "Latin America", price:  600000, worth: "$40M",   reach: 48,  agency: "WME",         signal: "King of Reggaeton and Despacito 8B-stream record co-holder. Private appearances via El Cartel Records with certified fan-safe protocols." },
  { name: "Vin Diesel",        cat: "Film",       region: "North America", price:  500000, worth: "$225M",  reach: 98,  agency: "WME",         signal: "Fast and Furious $7B+ franchise producer-star. Private events via One Race Films require full IP and brand alignment agreement with 21-day advance." },
  { name: "Jackie Chan",       cat: "Film",       region: "Asia",          price:  500000, worth: "$400M",  reach: 36,  agency: "CAA",         signal: "Jackie Chan Charitable Foundation patron and 60-year active film career. Events via JCG Management Hong Kong with APAC market qualification." },
  { name: "Priyanka Chopra",   cat: "Film",       region: "Asia",          price:  400000, worth: "$70M",   reach: 92,  agency: "WME",         signal: "UNICEF Global Goodwill Ambassador and Purple Pebble Pictures founder. Events via Purple Pebble with brand alignment and South Asian market brief." },
  { name: "Akon",              cat: "Music",      region: "Africa",        price:  300000, worth: "$80M",   reach: 8,   agency: "Independent", signal: "Akon Lighting Africa founder and pan-African investment champion. Private events and investment summits via Akonda Media and Entertainment." },
  { name: "Luis Fonsi",        cat: "Music",      region: "Latin America", price:  300000, worth: "$20M",   reach: 18,  agency: "WME",         signal: "Despacito co-creator and 8B YouTube record holder. Private concert events via WME Latin desk; all engagements include social-media rights agreement." },
  { name: "Maluma",            cat: "Music",      region: "Latin America", price:  400000, worth: "$18M",   reach: 62,  agency: "CAA",         signal: "Latin Grammy winner and global reggaeton ambassador. Private events require 21-day advance through CAA Latin desk with confirmed event tier." },
];

const build = (s, i) => {
  const avail = s.price >= 1500000 ? "Waitlist" : s.price >= 600000 ? "Limited" : "Open";
  return {
    id: `c${i + 1}`,
    name: s.name,
    verified: true,
    category: s.cat,
    region: s.region,
    portrait: PORTRAIT_MAP[s.name] || `https://i.pravatar.cc/300?u=${encodeURIComponent(s.name)}`,
    eliteSignal: s.signal,
    bookingTiers: tierTemplates.map((t) => ({
      ...t,
      startPrice: Math.round(s.price * t.multiplier),
    })),
    startingPrice: s.price,
    dynamicPriceRange: {
      min: Math.round(s.price * 0.9),
      max: Math.round(s.price * 1.4),
    },
    averageEventRate:       Math.round(s.price * 1.15),
    demandIndex:            Math.min(99, 62 + (i * 7)  % 37),
    popularityScore:        Math.min(99, 65 + (i * 5)  % 35),
    netWorth:               s.worth,
    netWorthTier:           parseNetWorthTier(s.worth),
    availability:           avail,
    availabilityWindowDays: avail === "Waitlist" ? 90 : avail === "Limited" ? 45 : 21,
    socialReachMillions:    s.reach,
    agencyRepresentation:   s.agency,
    partnerships: [
      partnerships[i % partnerships.length],
      partnerships[(i + 2) % partnerships.length],
    ],
    awards: [awards[i % awards.length], awards[(i + 1) % awards.length]],
    riskIndex:              ["low", "medium", "high"][i % 3],
    ndaDefault:             true,
    securityTiers:          ["Standard", "Enhanced", "Executive", "Sovereign"],
    recentBrandAlignment:   partnerships[(i + 3) % partnerships.length],
    eventCompatibility:     ["Summit", "Gala", "Launch", "Private Dinner", "Festival"].slice(0, 3 + (i % 3)),
  };
};

export const celebrities = seeds.map(build);

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