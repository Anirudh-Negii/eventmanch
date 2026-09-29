const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");

dotenv.config();

const users = [
  {
    name: "Anirudh Negi",
    email: "anirudh@eventmanch.com",
    password: "admin@567",
    role: "admin",
  },
  {
    name: "Head Admin",
    email: "headadmin@eventmanch.com",
    password: "admin@567",
    role: "admin",
  },
  {
    name: "Aarav Mehta",
    email: "aarav@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Priya Verma",
    email: "priya@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Rohan Kapoor",
    email: "rohan@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Sneha Patel",
    email: "sneha@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Arjun Singh",
    email: "arjun@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Kavya Nair",
    email: "kavya@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Aditya Joshi",
    email: "aditya@eventmanch.com",
    password: "user@789",
    role: "user",
  },
  {
    name: "Neha Gupta",
    email: "neha@eventmanch.com",
    password: "user@789",
    role: "user",
  },
];

const events = [
  {
    title: "React & Node.js Developer Retreat",
    description:
      "Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.",
    date: new Date("2026-11-07"),
    location: "Bengaluru, Karnataka",
    category: "Technology",
    totalSeats: 200,
    ticketPrice: 0,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Neon Nights EDM Festival",
    description:
      "Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from across the country.",
    date: new Date("2026-11-14"),
    location: "Mumbai, Maharashtra",
    category: "Music",
    totalSeats: 500,
    ticketPrice: 1500,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Global Leaders Business Summit",
    description:
      "A premium gathering of CEOs, founders, and investors discussing the future of global commerce, technology, and AI.",
    date: new Date("2026-11-21"),
    location: "New Delhi, Delhi",
    category: "Business",
    totalSeats: 150,
    ticketPrice: 5000,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Modern Art Expo",
    description:
      "Discover breathtaking contemporary and modern art from emerging and established artists across India.",
    date: new Date("2026-11-28"),
    location: "Jaipur, Rajasthan",
    category: "Art",
    totalSeats: 300,
    ticketPrice: 200,
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Startup Pitch & Pitch Competition",
    description:
      "Watch promising startups pitch their ideas to investors while entrepreneurs and founders connect and network.",
    date: new Date("2026-12-05"),
    location: "Hyderabad, Telangana",
    category: "Business",
    totalSeats: 250,
    ticketPrice: 100,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Cloud Computing Architecture Seminar",
    description:
      "A technical breakdown of scalable cloud solutions, multi-region routing, and serverless computing.",
    date: new Date("2026-12-12"),
    location: "Pune, Maharashtra",
    category: "Technology",
    totalSeats: 100,
    ticketPrice: 600,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "India Food & Culture Festival",
    description:
      "Celebrate the diverse food, traditions, music, and cultural heritage of different regions of India.",
    date: new Date("2026-12-19"),
    location: "Kochi, Kerala",
    category: "Food & Culture",
    totalSeats: 800,
    ticketPrice: 300,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "City Marathon 2026",
    description:
      "Take part in an exciting city marathon featuring professional runners, fitness enthusiasts, and participants from across India.",
    date: new Date("2026-12-20"),
    location: "Ahmedabad, Gujarat",
    category: "Sports",
    totalSeats: 2000,
    ticketPrice: 800,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Indie Film Showcase",
    description:
      "Experience a curated selection of independent films from emerging Indian filmmakers followed by discussions and networking.",
    date: new Date("2026-12-26"),
    location: "Kolkata, West Bengal",
    category: "Entertainment",
    totalSeats: 350,
    ticketPrice: 450,
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
  },

  {
    title: "Photography & Visual Arts Workshop",
    description:
      "Learn professional photography techniques, composition, lighting, and visual storytelling from experienced photographers.",
    date: new Date("2026-12-27"),
    location: "Chandigarh, Punjab",
    category: "Workshop",
    totalSeats: 80,
    ticketPrice: 750,
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=800",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/eventmanch",
    );

    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    // Hash user passwords
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = users.map((u) => ({
      ...u,
      password: bcrypt.hashSync(u.password, salt),
      isVerified: true,
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers.find((u) => u.role === "admin");
    const normalUsers = createdUsers.filter((u) => u.role === "user");

    // Link events to admin
    const eventsWithAdmin = events.map((e) => ({
      ...e,
      availableSeats: e.totalSeats,
      createdBy: adminUser._id,
    }));

    const createdEvents = await Event.insertMany(eventsWithAdmin);

    // Generate Bookings Data
    const bookingsData = [];

    for (const event of createdEvents) {
      // Assign 3-6 random users to each event
      const randomCount = Math.floor(Math.random() * 4) + 3;
      // Shuffle and pick random users
      const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, randomCount);

      for (const user of selectedUsers) {
        // Randomize statuses
        const statuses = ["pending", "confirmed", "cancelled"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        let paymentStatus = "not_paid";
        if (status === "confirmed" && event.ticketPrice > 0) {
          // Usually confirmed tickets are marked paid (90% of the time)
          paymentStatus = Math.random() > 0.1 ? "paid" : "not_paid";
        } else if (event.ticketPrice === 0) {
          paymentStatus = "paid";
        }

        bookingsData.push({
          userId: user._id,
          eventId: event._id,
          status: status,
          paymentStatus: paymentStatus,
          amount: event.ticketPrice,
        });

        // Deduct available seats specifically for confirmed tickets!
        if (status === "confirmed") {
          event.availableSeats -= 1;
          await event.save();
        }
      }
    }

    await Booking.insertMany(bookingsData);
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
