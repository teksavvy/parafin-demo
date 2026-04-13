import { PersonaKey } from "@/lib/personas";

export interface Order {
  id: string;
  time: string;
  customer: string;
  items: number;
  total: number;
  status: "Delivered" | "Preparing" | "Out for delivery" | "New" | "Cancelled";
  driver?: string;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  orders30d: number;
  available: boolean;
}

export interface PayoutRow {
  id: string;
  date: string;
  gross: number;
  fees: number;
  net: number;
  status: "Paid" | "In transit" | "Scheduled";
}

export interface PersonaOperations {
  headline: {
    salesToday: number;
    ordersToday: number;
    avgTicket: number;
    rating: number;
    satRate: number;
  };
  weeklyTrend: number[]; // 7 values
  orders: Order[];
  menu: MenuItem[];
  payouts: PayoutRow[];
  topItems: { name: string; count: number; revenue: number }[];
  salesByDaypart: { hour: string; value: number }[];
}

function gen(weeklyBase: number, variance = 0.15): number[] {
  const days = 7;
  const out: number[] = [];
  for (let i = 0; i < days; i++) {
    const drift = 1 + (Math.sin(i * 1.3) * variance);
    out.push(Math.round(weeklyBase * drift));
  }
  return out;
}

export const OPS: Record<PersonaKey, PersonaOperations> = {
  "no-offers": {
    headline: { salesToday: 412, ordersToday: 18, avgTicket: 22.9, rating: 4.6, satRate: 93 },
    weeklyTrend: gen(420, 0.25),
    orders: [
      { id: "GD-48812", time: "12:42 PM", customer: "Erin M.", items: 2, total: 24.5, status: "Out for delivery", driver: "Rico P." },
      { id: "GD-48809", time: "12:30 PM", customer: "Dev P.", items: 1, total: 14.0, status: "Preparing" },
      { id: "GD-48801", time: "12:14 PM", customer: "Jules A.", items: 3, total: 38.75, status: "Delivered", driver: "Monica L." },
      { id: "GD-48790", time: "11:52 AM", customer: "Sam R.", items: 1, total: 16.5, status: "Delivered", driver: "Rico P." },
      { id: "GD-48781", time: "11:31 AM", customer: "Nina T.", items: 2, total: 28.0, status: "Delivered", driver: "Alex K." },
      { id: "GD-48774", time: "11:08 AM", customer: "Chris D.", items: 4, total: 51.25, status: "Delivered", driver: "Monica L." },
    ],
    menu: [
      { id: "m1", category: "Pizzas", name: "Margherita", price: 14, orders30d: 210, available: true },
      { id: "m2", category: "Pizzas", name: "Pepperoni", price: 16, orders30d: 268, available: true },
      { id: "m3", category: "Pizzas", name: "White Truffle", price: 22, orders30d: 48, available: true },
      { id: "m4", category: "Sides", name: "Garlic Knots", price: 6, orders30d: 412, available: true },
      { id: "m5", category: "Desserts", name: "Tiramisu", price: 8, orders30d: 64, available: false },
    ],
    payouts: [
      { id: "po-0421", date: "Apr 9", gross: 2840, fees: 284, net: 2556, status: "Paid" },
      { id: "po-0420", date: "Apr 8", gross: 2412, fees: 241, net: 2171, status: "Paid" },
      { id: "po-0419", date: "Apr 7", gross: 2934, fees: 293, net: 2641, status: "Paid" },
      { id: "po-0418", date: "Apr 6", gross: 2056, fees: 206, net: 1850, status: "Paid" },
    ],
    topItems: [
      { name: "Pepperoni Pizza", count: 268, revenue: 4288 },
      { name: "Margherita Pizza", count: 210, revenue: 2940 },
      { name: "Garlic Knots", count: 412, revenue: 2472 },
    ],
    salesByDaypart: [
      { hour: "11a", value: 140 },
      { hour: "12p", value: 320 },
      { hour: "1p", value: 260 },
      { hour: "5p", value: 180 },
      { hour: "6p", value: 430 },
      { hour: "7p", value: 510 },
      { hour: "8p", value: 360 },
      { hour: "9p", value: 180 },
    ],
  },
  "pre-approved": {
    headline: { salesToday: 1284, ordersToday: 47, avgTicket: 27.33, rating: 4.8, satRate: 97 },
    weeklyTrend: gen(1300, 0.18),
    orders: [
      { id: "GD-91204", time: "12:58 PM", customer: "Priya S.", items: 3, total: 42.1, status: "Out for delivery", driver: "Hector V." },
      { id: "GD-91201", time: "12:49 PM", customer: "Omar F.", items: 2, total: 28.5, status: "Preparing" },
      { id: "GD-91199", time: "12:41 PM", customer: "Kira L.", items: 4, total: 61.75, status: "New" },
      { id: "GD-91188", time: "12:22 PM", customer: "Liam J.", items: 2, total: 31.0, status: "Delivered", driver: "Maya C." },
      { id: "GD-91181", time: "12:03 PM", customer: "Rosa D.", items: 5, total: 78.4, status: "Delivered", driver: "Hector V." },
      { id: "GD-91174", time: "11:47 AM", customer: "Tyler M.", items: 2, total: 26.0, status: "Delivered", driver: "Maya C." },
    ],
    menu: [
      { id: "m1", category: "Tacos", name: "Al Pastor Taco", price: 4, orders30d: 1240, available: true },
      { id: "m2", category: "Tacos", name: "Carnitas Taco", price: 4, orders30d: 980, available: true },
      { id: "m3", category: "Tacos", name: "Carne Asada Taco", price: 4.5, orders30d: 1120, available: true },
      { id: "m4", category: "Bowls", name: "Burrito Bowl", price: 12, orders30d: 540, available: true },
      { id: "m5", category: "Sides", name: "Elote", price: 5, orders30d: 720, available: true },
      { id: "m6", category: "Drinks", name: "Horchata", price: 4, orders30d: 610, available: true },
    ],
    payouts: [
      { id: "po-8821", date: "Apr 9", gross: 8910, fees: 891, net: 8019, status: "Paid" },
      { id: "po-8820", date: "Apr 8", gross: 9240, fees: 924, net: 8316, status: "Paid" },
      { id: "po-8819", date: "Apr 7", gross: 10184, fees: 1018, net: 9166, status: "Paid" },
      { id: "po-8818", date: "Apr 6", gross: 7850, fees: 785, net: 7065, status: "Paid" },
    ],
    topItems: [
      { name: "Al Pastor Taco", count: 1240, revenue: 4960 },
      { name: "Carne Asada Taco", count: 1120, revenue: 5040 },
      { name: "Carnitas Taco", count: 980, revenue: 3920 },
    ],
    salesByDaypart: [
      { hour: "11a", value: 420 },
      { hour: "12p", value: 860 },
      { hour: "1p", value: 720 },
      { hour: "5p", value: 540 },
      { hour: "6p", value: 1100 },
      { hour: "7p", value: 1340 },
      { hour: "8p", value: 980 },
      { hour: "9p", value: 510 },
    ],
  },
  "capital-on-way": {
    headline: { salesToday: 2148, ordersToday: 38, avgTicket: 56.5, rating: 4.9, satRate: 98 },
    weeklyTrend: gen(2200, 0.1),
    orders: [
      { id: "GD-20912", time: "1:02 PM", customer: "Haruto N.", items: 2, total: 112.0, status: "Out for delivery", driver: "Jenna R." },
      { id: "GD-20908", time: "12:51 PM", customer: "Sophie K.", items: 3, total: 148.5, status: "Preparing" },
      { id: "GD-20903", time: "12:38 PM", customer: "Elliot W.", items: 1, total: 64.0, status: "Delivered", driver: "Jenna R." },
      { id: "GD-20899", time: "12:21 PM", customer: "Yumi T.", items: 4, total: 198.5, status: "Delivered", driver: "Bianca O." },
      { id: "GD-20891", time: "12:04 PM", customer: "Noah B.", items: 2, total: 89.0, status: "Delivered", driver: "Jenna R." },
    ],
    menu: [
      { id: "m1", category: "Nigiri", name: "Bluefin Tuna", price: 12, orders30d: 520, available: true },
      { id: "m2", category: "Nigiri", name: "Uni", price: 16, orders30d: 210, available: true },
      { id: "m3", category: "Rolls", name: "Dragon Roll", price: 22, orders30d: 640, available: true },
      { id: "m4", category: "Rolls", name: "Spicy Tuna Roll", price: 14, orders30d: 820, available: true },
      { id: "m5", category: "Omakase", name: "Chef's Omakase (12 pc)", price: 85, orders30d: 96, available: true },
    ],
    payouts: [
      { id: "po-5523", date: "Apr 9", gross: 14820, fees: 1482, net: 13338, status: "Paid" },
      { id: "po-5522", date: "Apr 8", gross: 12110, fees: 1211, net: 10899, status: "Paid" },
      { id: "po-5521", date: "Apr 7", gross: 15240, fees: 1524, net: 13716, status: "Paid" },
      { id: "po-5520", date: "Apr 6", gross: 11090, fees: 1109, net: 9981, status: "Paid" },
    ],
    topItems: [
      { name: "Spicy Tuna Roll", count: 820, revenue: 11480 },
      { name: "Dragon Roll", count: 640, revenue: 14080 },
      { name: "Bluefin Tuna Nigiri", count: 520, revenue: 6240 },
    ],
    salesByDaypart: [
      { hour: "11a", value: 210 },
      { hour: "12p", value: 480 },
      { hour: "1p", value: 620 },
      { hour: "5p", value: 860 },
      { hour: "6p", value: 1640 },
      { hour: "7p", value: 2120 },
      { hour: "8p", value: 1720 },
      { hour: "9p", value: 840 },
    ],
  },
  "outstanding": {
    headline: { salesToday: 1612, ordersToday: 72, avgTicket: 22.4, rating: 4.7, satRate: 96 },
    weeklyTrend: gen(1600, 0.12),
    orders: [
      { id: "GD-33812", time: "1:04 PM", customer: "Aaliyah J.", items: 2, total: 24.0, status: "Preparing" },
      { id: "GD-33810", time: "12:57 PM", customer: "Brian C.", items: 1, total: 14.5, status: "New" },
      { id: "GD-33805", time: "12:44 PM", customer: "Sienna R.", items: 3, total: 39.25, status: "Out for delivery", driver: "Nate F." },
      { id: "GD-33798", time: "12:27 PM", customer: "Marcus P.", items: 2, total: 28.0, status: "Delivered", driver: "Nate F." },
      { id: "GD-33790", time: "12:11 PM", customer: "Layla E.", items: 4, total: 48.5, status: "Delivered", driver: "Kira S." },
    ],
    menu: [
      { id: "m1", category: "Bowls", name: "Harvest Bowl", price: 13, orders30d: 910, available: true },
      { id: "m2", category: "Bowls", name: "Thai Peanut Bowl", price: 14, orders30d: 820, available: true },
      { id: "m3", category: "Bowls", name: "Mediterranean Bowl", price: 13, orders30d: 760, available: true },
      { id: "m4", category: "Sides", name: "Miso Soup", price: 4, orders30d: 520, available: true },
      { id: "m5", category: "Drinks", name: "Kombucha", price: 5, orders30d: 340, available: false },
    ],
    payouts: [
      { id: "po-7712", date: "Apr 9", gross: 11210, fees: 1121, net: 9089, status: "Paid" },
      { id: "po-7711", date: "Apr 8", gross: 10842, fees: 1084, net: 8758, status: "Paid" },
      { id: "po-7710", date: "Apr 7", gross: 11950, fees: 1195, net: 9755, status: "Paid" },
      { id: "po-7709", date: "Apr 6", gross: 10120, fees: 1012, net: 8108, status: "Paid" },
    ],
    topItems: [
      { name: "Harvest Bowl", count: 910, revenue: 11830 },
      { name: "Thai Peanut Bowl", count: 820, revenue: 11480 },
      { name: "Mediterranean Bowl", count: 760, revenue: 9880 },
    ],
    salesByDaypart: [
      { hour: "11a", value: 380 },
      { hour: "12p", value: 1240 },
      { hour: "1p", value: 980 },
      { hour: "5p", value: 640 },
      { hour: "6p", value: 1320 },
      { hour: "7p", value: 1560 },
      { hour: "8p", value: 1080 },
      { hour: "9p", value: 420 },
    ],
  },
};

export function useOps(persona: PersonaKey): PersonaOperations {
  return OPS[persona];
}
