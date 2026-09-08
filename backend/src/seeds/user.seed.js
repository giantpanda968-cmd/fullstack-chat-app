import { config } from "dotenv";
import  connectDB  from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    fullName: "Emma Thompson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    fullName: "Olivia Miller",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    fullName: "Sophia Davis",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    fullName: "Ava Wilson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.moore@example.com",
    fullName: "Isabella Moore",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.taylor@example.com",
    fullName: "Mia Taylor",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.anderson@example.com",
    fullName: "Charlotte Anderson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.thomas@example.com",
    fullName: "Amelia Thomas",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    email: "harper.jackson@example.com",
    fullName: "Harper Jackson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    email: "evelyn.white@example.com",
    fullName: "Evelyn White",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
  },

  // Male Users
  {
    email: "liam.harris@example.com",
    fullName: "Liam Harris",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "noah.martin@example.com",
    fullName: "Noah Martin",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "oliver.thompson@example.com",
    fullName: "Oliver Thompson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "elijah.garcia@example.com",
    fullName: "Elijah Garcia",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "james.martinez@example.com",
    fullName: "James Martinez",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "william.robinson@example.com",
    fullName: "William Robinson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "benjamin.clark@example.com",
    fullName: "Benjamin Clark",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    email: "lucas.rodriguez@example.com",
    fullName: "Lucas Rodriguez",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    email: "henry.lewis@example.com",
    fullName: "Henry Lewis",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    email: "alexander.walker@example.com",
    fullName: "Alexander Walker",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Insert karne se pehle har password hash karo
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      }),
    );

    await User.insertMany(hashedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();