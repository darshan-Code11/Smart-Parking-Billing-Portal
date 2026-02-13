const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DB_FILE = path.join(__dirname, "db.json");

// ===================== DB FUNCTIONS =====================
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function generateTicketId() {
  return "VEGA-" + Math.floor(100000 + Math.random() * 900000);
}

function calculateFare(hours) {
  return hours * 20;
}

// ===================== EMPLOYEE LOGIN =====================
const EMPLOYEE_USER = "Adminvega";
const EMPLOYEE_PASS = "Vega#2005";
const EMPLOYEE_TOKEN = "VEGA_EMPLOYEE_AUTH_TOKEN_2026";

function employeeAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token !== EMPLOYEE_TOKEN) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }

  next();
}

app.post("/api/employee/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required." });
  }

  if (username === EMPLOYEE_USER && password === EMPLOYEE_PASS) {
    return res.json({
      message: "Login successful",
      token: EMPLOYEE_TOKEN
    });
  }

  return res.status(401).json({ message: "Invalid username or password." });
});

// ===================== CHECKIN =====================
app.post("/api/tickets/checkin", employeeAuth, (req, res) => {
  const { ownerName, vehicleNumber, vehicleType } = req.body;

  if (!ownerName || !vehicleNumber || !vehicleType) {
    return res.status(400).json({ message: "All fields are required." });
  }

  let db = readDB();

  // Prevent duplicate active ticket for same vehicle
  const existingActive = db.find(
    t => t.vehicleNumber === vehicleNumber.toUpperCase() && !t.checkOutTime
  );

  if (existingActive) {
    return res.status(400).json({ message: "This vehicle is already checked in." });
  }

  const ticket = {
    id: generateTicketId(),
    ownerName,
    vehicleNumber: vehicleNumber.toUpperCase(),
    vehicleType,
    checkInTime: new Date().toISOString(),
    checkOutTime: null,
    totalHours: null,
    amount: null,
    paymentStatus: "UNPAID",
    paymentMethod: null
  };

  db.push(ticket);
  writeDB(db);

  res.json({ message: "Ticket generated successfully", ticket });
});

// ===================== CHECKOUT BILL GENERATE =====================
app.post("/api/tickets/checkout/:id", employeeAuth, (req, res) => {
  const ticketId = req.params.id.toUpperCase();

  let db = readDB();
  let ticket = db.find(t => t.id === ticketId);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found." });
  }

  if (ticket.checkOutTime) {
    return res.status(400).json({ message: "Already checked out." });
  }

  const checkIn = new Date(ticket.checkInTime);
  const checkOut = new Date();

  let diffMs = checkOut - checkIn;
  let hours = Math.ceil(diffMs / (1000 * 60 * 60));
  if (hours < 1) hours = 1;

  ticket.checkOutTime = checkOut.toISOString();
  ticket.totalHours = hours;
  ticket.amount = calculateFare(hours);

  writeDB(db);

  res.json({ message: "Bill generated successfully", ticket });
});

// ===================== CLIENT AUTO BILL GENERATE =====================
app.post("/api/tickets/autobill/:vehicleNo", (req, res) => {
  const vehicleNo = req.params.vehicleNo.toUpperCase();

  let db = readDB();
  let ticket = db.find(t => t.vehicleNumber === vehicleNo);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found for this vehicle number." });
  }

  // If already bill generated
  if (ticket.checkOutTime && ticket.amount) {
    return res.json({ message: "Bill already generated.", ticket });
  }

  const checkIn = new Date(ticket.checkInTime);
  const checkOut = new Date();

  let diffMs = checkOut - checkIn;
  let hours = Math.ceil(diffMs / (1000 * 60 * 60));
  if (hours < 1) hours = 1;

  ticket.checkOutTime = checkOut.toISOString();
  ticket.totalHours = hours;
  ticket.amount = calculateFare(hours);

  writeDB(db);

  res.json({ message: "Bill generated automatically.", ticket });
});

// ===================== PAYMENT =====================
app.post("/api/tickets/pay/:id", (req, res) => {
  const ticketId = req.params.id.toUpperCase();
  const { method, upiApp } = req.body;

  let db = readDB();
  let ticket = db.find(t => t.id === ticketId);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found." });
  }

  if (!ticket.amount) {
    return res.status(400).json({ message: "Bill not generated yet." });
  }

  if (ticket.paymentStatus === "PAID") {
    return res.status(400).json({ message: "Payment already completed." });
  }

  if (!method) {
    return res.status(400).json({ message: "Payment method required." });
  }

  let finalMethod = method;

  if (method === "UPI") {
    if (!upiApp) {
      return res.status(400).json({ message: "UPI App required." });
    }
    finalMethod = `UPI (${upiApp})`;
  }

  ticket.paymentStatus = "PAID";
  ticket.paymentMethod = finalMethod;

  writeDB(db);

  res.json({ message: "Payment successful", ticket });
});

// ===================== GET ALL TICKETS =====================
app.get("/api/tickets", (req, res) => {
  const db = readDB();
  res.json({ tickets: db });
});

// ===================== HOME PAGE =====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
