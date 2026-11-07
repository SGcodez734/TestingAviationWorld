// All site data lives here. Edit freely; every page reads from these arrays.
const AIRCRAFT = [
  { id: "a350", name: "Airbus A350-900", maker: "Airbus", cat: "Widebody", pax: 325, range: 15000, speed: 903, year: 2013, desc: "A long-haul twin-jet built largely from carbon-fibre composites, designed for efficiency on ultra-long routes." },
  { id: "a380", name: "Airbus A380-800", maker: "Airbus", cat: "Widebody", pax: 555, range: 15200, speed: 903, year: 2005, desc: "The world's largest passenger airliner, with two full-length decks. Production ended in 2021." },
  { id: "a320neo", name: "Airbus A320neo", maker: "Airbus", cat: "Narrowbody", pax: 180, range: 6300, speed: 833, year: 2014, desc: "A fuel-efficient update of the best-selling A320 family, with new-generation engines." },
  { id: "b747", name: "Boeing 747-8", maker: "Boeing", cat: "Widebody", pax: 410, range: 14310, speed: 917, year: 2010, desc: "The longest airliner in service in its time and the latest version of the iconic 'Queen of the Skies'." },
  { id: "b787", name: "Boeing 787-9 Dreamliner", maker: "Boeing", cat: "Widebody", pax: 290, range: 14140, speed: 903, year: 2013, desc: "A composite twin-jet known for lower cabin altitude, larger windows and strong fuel economy." },
  { id: "b737", name: "Boeing 737 MAX 8", maker: "Boeing", cat: "Narrowbody", pax: 178, range: 6500, speed: 842, year: 2016, desc: "The latest generation of the world's most produced jet airliner family." },
  { id: "e195", name: "Embraer E195-E2", maker: "Embraer", cat: "Regional", pax: 120, range: 4800, speed: 870, year: 2016, desc: "A quiet, efficient regional jet bridging the gap between regional and mainline operations." },
  { id: "atr72", name: "ATR 72-600", maker: "ATR", cat: "Turboprop", pax: 70, range: 1528, speed: 510, year: 1988, desc: "A twin-turboprop workhorse for short regional sectors and shorter runways." },
  { id: "concorde", name: "Concorde", maker: "BAC / Aérospatiale", cat: "Supersonic", pax: 100, range: 7200, speed: 2158, year: 1969, desc: "The supersonic airliner that cruised at about Mach 2. Retired from service in 2003." },
  { id: "c172", name: "Cessna 172 Skyhawk", maker: "Cessna", cat: "General Aviation", pax: 4, range: 1289, speed: 226, year: 1955, desc: "The most produced aircraft in history, a mainstay of flight training worldwide." }
];

const AIRLINES = [
  { id: "ek", name: "Emirates", code: "EK", country: "United Arab Emirates", region: "Middle East", hub: "Dubai (DXB)", founded: 1985, alliance: "None", fleet: ["a380", "a350"], desc: "A long-haul carrier known for operating one of the largest A380 fleets." },
  { id: "qr", name: "Qatar Airways", code: "QR", country: "Qatar", region: "Middle East", hub: "Doha (DOH)", founded: 1993, alliance: "oneworld", fleet: ["a350", "b787"], desc: "A global network connected through its Doha hub." },
  { id: "sq", name: "Singapore Airlines", code: "SQ", country: "Singapore", region: "Asia-Pacific", hub: "Singapore (SIN)", founded: 1947, alliance: "Star Alliance", fleet: ["a350", "b787", "a380"], desc: "Regularly ranked among the world's best for in-flight service." },
  { id: "lh", name: "Lufthansa", code: "LH", country: "Germany", region: "Europe", hub: "Frankfurt (FRA)", founded: 1953, alliance: "Star Alliance", fleet: ["a350", "b747"], desc: "Germany's flag carrier and a founding member of Star Alliance." },
  { id: "ba", name: "British Airways", code: "BA", country: "United Kingdom", region: "Europe", hub: "London Heathrow (LHR)", founded: 1974, alliance: "oneworld", fleet: ["a380", "b787", "a320neo", "concorde"], desc: "The UK flag carrier, and the former operator of Concorde." },
  { id: "tk", name: "Turkish Airlines", code: "TK", country: "Türkiye", region: "Europe", hub: "Istanbul (IST)", founded: 1933, alliance: "Star Alliance", fleet: ["a350", "b787", "b737"], desc: "Serves one of the largest numbers of countries of any airline." },
  { id: "dl", name: "Delta Air Lines", code: "DL", country: "United States", region: "North America", hub: "Atlanta (ATL)", founded: 1925, alliance: "SkyTeam", fleet: ["a350", "a320neo"], desc: "A major US carrier with a large hub-and-spoke network." },
  { id: "qf", name: "Qantas", code: "QF", country: "Australia", region: "Asia-Pacific", hub: "Sydney (SYD)", founded: 1920, alliance: "oneworld", fleet: ["a380", "b787"], desc: "One of the world's oldest airlines still operating under its original name." },
  { id: "jl", name: "Japan Airlines", code: "JL", country: "Japan", region: "Asia-Pacific", hub: "Tokyo (HND / NRT)", founded: 1951, alliance: "oneworld", fleet: ["a350", "b787"], desc: "Japan's flag carrier, known for punctuality and service." },
  { id: "et", name: "Ethiopian Airlines", code: "ET", country: "Ethiopia", region: "Africa", hub: "Addis Ababa (ADD)", founded: 1945, alliance: "Star Alliance", fleet: ["a350", "b787", "b737"], desc: "Africa's largest carrier by network, with a hub at Addis Ababa." }
];

const AIRPORTS = [
  { code: "JFK", city: "New York", lat: 40.6413, lon: -73.7781 },
  { code: "LHR", city: "London", lat: 51.4700, lon: -0.4543 },
  { code: "CDG", city: "Paris", lat: 49.0097, lon: 2.5479 },
  { code: "DXB", city: "Dubai", lat: 25.2532, lon: 55.3657 },
  { code: "SIN", city: "Singapore", lat: 1.3644, lon: 103.9915 },
  { code: "HND", city: "Tokyo", lat: 35.5494, lon: 139.7798 },
  { code: "SYD", city: "Sydney", lat: -33.9399, lon: 151.1753 },
  { code: "LAX", city: "Los Angeles", lat: 33.9416, lon: -118.4085 },
  { code: "JNB", city: "Johannesburg", lat: -26.1367, lon: 28.2411 },
  { code: "GRU", city: "São Paulo", lat: -23.4356, lon: -46.4731 }
];