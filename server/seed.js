const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");

dotenv.config();

const users = [
  ["Aarav Mehta", "aarav@gmail.com"],
  ["Priya Verma", "priya@gmail.com"],
  ["Rohan Kapoor", "rohan@gmail.com"],
  ["Sneha Patel", "sneha@gmail.com"],
  ["Arjun Singh", "arjun@gmail.com"],
  ["Kavya Nair", "kavya@gmail.com"],
  ["Aditya Joshi", "aditya@gmail.com"],
  ["Neha Gupta", "neha@gmail.com"],
  ["Ishaan Malhotra", "ishaan@gmail.com"],
  ["Meera Iyer", "meera@gmail.com"],
  ["Vikram Rao", "vikram@gmail.com"],
  ["Ananya Desai", "ananya@gmail.com"],
].map(([name, email]) => ({
  name,
  email,
  password: "User@123#",
  role: "user",
}));

const events = [
  {
    title: "React & Node.js Developer Retreat",
    description:
      "Join experienced builders for a three-day deep dive into modern full-stack development, practical architecture, testing strategies, and product thinking.",
    date: new Date("2026-11-07"),
    location: "Bengaluru, Karnataka",
    category: "Technology",
    totalSeats: 30,
    ticketPrice: 0,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Neon Nights EDM Festival",
    description:
      "Experience an unforgettable night of electronic music, powerful live sets, immersive light installations, and a dance floor filled with new friends.",
    date: new Date("2026-11-14"),
    location: "Mumbai, Maharashtra",
    category: "Music",
    totalSeats: 30,
    ticketPrice: 1500,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Global Leaders Business Summit",
    description:
      "Listen to CEOs, founders, and investors discuss global commerce, responsible technology, artificial intelligence, and the decisions shaping tomorrow’s businesses.",
    date: new Date("2026-11-21"),
    location: "New Delhi, Delhi",
    category: "Business",
    totalSeats: 24,
    ticketPrice: 5000,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Modern Art Expo",
    description:
      "Discover bold contemporary work from emerging and established artists, with gallery walks, artist conversations, and unexpected perspectives throughout the weekend.",
    date: new Date("2026-11-28"),
    location: "Jaipur, Rajasthan",
    category: "Art",
    totalSeats: 28,
    ticketPrice: 200,
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Startup Pitch Night",
    description:
      "Watch promising startups pitch ambitious ideas to investors while entrepreneurs exchange honest feedback, useful connections, and lessons from building companies.",
    date: new Date("2026-12-05"),
    location: "Hyderabad, Telangana",
    category: "Business",
    totalSeats: 30,
    ticketPrice: 100,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Cloud Architecture Seminar",
    description:
      "Explore scalable cloud systems through practical examples covering multi-region routing, reliability, cost decisions, observability, and serverless application design.",
    date: new Date("2026-12-12"),
    location: "Pune, Maharashtra",
    category: "Technology",
    totalSeats: 20,
    ticketPrice: 600,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "India Food & Culture Festival",
    description:
      "Celebrate the country’s regional food, traditions, music, and cultural stories through local kitchens, live performances, workshops, and shared tables.",
    date: new Date("2026-12-19"),
    location: "Kochi, Kerala",
    category: "Food & Culture",
    totalSeats: 30,
    ticketPrice: 300,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "City Marathon 2026",
    description:
      "Take part in an energetic city marathon bringing together professional runners, fitness enthusiasts, families, and first-time participants from across India.",
    date: new Date("2026-12-20"),
    location: "Ahmedabad, Gujarat",
    category: "Sports",
    totalSeats: 30,
    ticketPrice: 800,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Indie Film Showcase",
    description:
      "Experience a thoughtful selection of independent films from emerging Indian filmmakers, followed by conversations about craft, identity, and storytelling.",
    date: new Date("2026-12-26"),
    location: "Kolkata, West Bengal",
    category: "Entertainment",
    totalSeats: 24,
    ticketPrice: 450,
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Photography & Visual Arts Workshop",
    description:
      "Learn professional photography techniques, composition, lighting, editing, and visual storytelling from experienced photographers during an intimate practical workshop.",
    date: new Date("2026-12-27"),
    location: "Chandigarh, Punjab",
    category: "Workshop",
    totalSeats: 20,
    ticketPrice: 750,
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mindful Living Weekend",
    description:
      "Slow down with guided meditation, mindful movement, thoughtful conversations, and practical habits designed to bring more balance into everyday life.",
    date: new Date("2027-01-09"),
    location: "Rishikesh, Uttarakhand",
    category: "Wellness",
    totalSeats: 24,
    ticketPrice: 900,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Indie Makers Craft Fair",
    description:
      "Meet independent makers, discover handmade goods, hear the stories behind their work, and spend an afternoon supporting local creative businesses.",
    date: new Date("2027-01-16"),
    location: "Goa",
    category: "Lifestyle",
    totalSeats: 28,
    ticketPrice: 150,
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Women in Product Forum",
    description:
      "A candid forum for product leaders sharing practical lessons about research, strategy, leadership, collaboration, and building a meaningful career.",
    date: new Date("2027-01-23"),
    location: "Gurugram, Haryana",
    category: "Community",
    totalSeats: 30,
    ticketPrice: 400,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Theatre Under the Stars",
    description:
      "Enjoy an open-air evening of live theatre, poetry, and music performed by a new generation of artists in a relaxed outdoor setting.",
    date: new Date("2027-01-30"),
    location: "Bhopal, Madhya Pradesh",
    category: "Theatre",
    totalSeats: 24,
    ticketPrice: 350,
    image:
      "https://images.unsplash.com/photo-1623253489858-dd919b5bea9e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Future of AI Conference",
    description:
      "Explore the real-world impact of artificial intelligence through accessible talks, live demonstrations, ethical debates, and expert panel discussions.",
    date: new Date("2027-02-06"),
    location: "Chennai, Tamil Nadu",
    category: "Technology",
    totalSeats: 30,
    ticketPrice: 1200,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Street Food Stories",
    description:
      "Taste the city through favourite street kitchens, regional recipes, family traditions, and the personal stories of the people behind each dish.",
    date: new Date("2027-02-13"),
    location: "Lucknow, Uttar Pradesh",
    category: "Food & Culture",
    totalSeats: 28,
    ticketPrice: 500,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Acoustic Evenings",
    description:
      "Spend an intimate evening with independent singer-songwriters sharing stripped-back performances, honest stories, and songs in a welcoming setting.",
    date: new Date("2027-02-20"),
    location: "Indore, Madhya Pradesh",
    category: "Music",
    totalSeats: 20,
    ticketPrice: 700,
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Designing Better Cities",
    description:
      "Architects, planners, and citizens imagine more inclusive, walkable, sustainable, and joyful urban spaces through talks and collaborative discussions.",
    date: new Date("2027-02-27"),
    location: "Mysuru, Karnataka",
    category: "Design",
    totalSeats: 24,
    ticketPrice: 650,
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/eventmanch",
    );

    await Promise.all([
      User.deleteMany(),
      Event.deleteMany(),
      Booking.deleteMany(),
    ]);

    const salt = await bcrypt.genSalt(10);
    const hashedUsers = users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, salt),
      isVerified: true,
    }));
    const createdUsers = await User.insertMany(hashedUsers);

    // Seed 40% confirmed occupancy for every event, safely above 25%.
    const eventsWithSeats = events.map((event) => {
      const soldSeats = Math.ceil(event.totalSeats * 0.4);
      return {
        ...event,
        availableSeats: event.totalSeats - soldSeats,
      };
    });
    const createdEvents = await Event.insertMany(eventsWithSeats);

    const bookingsData = [];
    createdEvents.forEach((event, eventIndex) => {
      const soldSeats = event.totalSeats - event.availableSeats;
      for (let seatIndex = 0; seatIndex < soldSeats; seatIndex += 1) {
        const user =
          createdUsers[(eventIndex + seatIndex) % createdUsers.length];
        bookingsData.push({
          userId: user._id,
          eventId: event._id,
          status: "confirmed",
          paymentStatus: "paid",
          amount: event.ticketPrice,
        });
      }
    });

    await Booking.insertMany(bookingsData);
    console.log(
      `Seeded ${createdUsers.length} users, ${createdEvents.length} events, and ${bookingsData.length} confirmed bookings.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
