import bcrypt from "bcryptjs";

const users = [
  {
    id: "u1",
    email: "client@aurelux.com",
    name: "Aria Sterling",
    role: "client",
    passwordHash: bcrypt.hashSync("Client@123", 10),
    membershipTier: "Black Card",
  },
  {
    id: "u2",
    email: "manager@aurelux.com",
    name: "Marcus Vale",
    role: "manager",
    passwordHash: bcrypt.hashSync("Manager@123", 10),
    membershipTier: "Sovereign Circle",
  },
  {
    id: "u3",
    email: "admin@aurelux.com",
    name: "Helena Noir",
    role: "admin",
    passwordHash: bcrypt.hashSync("Admin@123", 10),
    membershipTier: "Founders Office",
  },
];

const bookings = [];
const contracts = [];
const payments = [];
const messages = [
  {
    id: "m1",
    from: "Representation Desk",
    toUserId: "u1",
    body: "Your sovereign inquiry is now in review.",
    timestamp: new Date().toISOString(),
  },
];

const auditLogs = [];

export const db = {
  users,
  bookings,
  contracts,
  payments,
  messages,
  auditLogs,
};
