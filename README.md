🚗 Vega City Mall Parking Portal

A Smart Parking Billing Portal built using Node.js, Express, HTML, CSS, and JavaScript.
This project allows employees to generate parking tickets and bills, and allows clients to search their vehicle number and pay their parking charges online.

📌 Features
✅ Client Portal

Search ticket using Vehicle Number

View ticket details instantly

Payment options available:

UPI (Paytm, PhonePe, Google Pay, BHIM, Other)

Credit Card

Debit Card

Fake QR Scanner payment system

30 seconds payment timer

Automatically updates payment status in database after payment success

Works smoothly on Mobile + Desktop

✅ Employee Portal

Secure employee login system

Username and password authentication

Vehicle Check-In (Ticket Generation)

Bill Generation (Checkout)

Employee payment options:

UPI

Credit Card

Debit Card

Fake UPI QR Scanner

Print Ticket Slip

Print Bill Receipt (Only after payment success)

View all parking records in table format

🔐 Employee Login Credentials
Role	Username	Password
Employee/Admin	Adminvega	Vega#2005
💰 Parking Charges

₹20 per hour

Minimum charge = ₹20

Hours calculated using Math.ceil() (round-up method)

🛠️ Tech Stack
Frontend

HTML

CSS

JavaScript

Backend

Node.js

Express.js

Database

JSON file storage (db.json)

📂 Project Folder Structure
parking system/
│
├── server.js
├── db.json
├── package.json
│
└── public/
    └── index.html

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/vega-parking-portal.git

2️⃣ Go to Project Folder
cd vega-parking-portal

3️⃣ Install Dependencies
npm install

4️⃣ Run the Server
node server.js

🌐 Open in Browser

After starting the server, open:

👉 http://localhost:5000

📌 How It Works
🚘 Employee Flow

Employee logs in

Generates ticket for vehicle check-in

Prints ticket slip

Generates bill during checkout

Takes payment and prints final receipt

👤 Client Flow

Client enters vehicle number

System fetches ticket details

Client selects payment method

Fake QR scanner appears (30 sec timer)

Payment is marked as PAID

Database updates automatically

🖨️ Printing Feature

Ticket Slip printing available after check-in

Bill Receipt printing available only after successful payment

📌 API Endpoints
Employee Login

POST /api/employee/login

Generate Ticket

POST /api/tickets/checkin

Generate Bill (Checkout)

POST /api/tickets/checkout/:id

Auto Bill Generation (Client Side)

POST /api/tickets/autobill/:vehicleNo

Payment

POST /api/tickets/pay/:id

Get All Tickets

GET /api/tickets


🚀 Future Enhancements

Add MongoDB database support

Add real QR generation system

Add OTP based payment confirmation

Add admin dashboard analytics

Deploy online using Render / Railway / Vercel

👨‍💻 Developed By

Darshan Gowda 
Final Year Project - Smart Parking System
Project link : https://darshan-code11.github.io/Smart-Parking-Billing-Portal/

📜 License

This project is made for educational and learning purposes.
