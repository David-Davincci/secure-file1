# Secure Cloud - Encrypted File Storage

A production-ready encrypted file storage system built with Node.js, Express, and Supabase. Features military-grade AES-256-GCM encryption wrapped with RSA-2048 keys.

## Features

- 🔒 **End-to-End Encryption**: Files are encrypted with AES-256-GCM.
- 🔑 **RSA Key Wrapping**: AES keys are protected using RSA-2048.
- ☁️ **Secure Storage**: Encrypted files stored in Supabase Storage.
- 👤 **Custom Authentication**: Email/Password auth with verification and reset flows.
- 🎨 **Premium UI**: Modern glassmorphism design with dark mode.
- 🚀 **Vercel Ready**: Configured for serverless deployment.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Frontend**: Vanilla HTML/CSS/JS (Premium UI)
- **Security**: `crypto` (Node.js), `bcryptjs`, `jsonwebtoken`
- **Email**: Nodemailer (Gmail SMTP)

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repo-url>
cd secure-file
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

### 3. Generate RSA Keys
Run the helper script to generate your RSA key pair:
```bash
node scripts/generate-rsa-keys.js
```
Copy the output into your `.env` file.

### 4. Database Setup
Run the SQL script in `supabase/schema.sql` in your Supabase SQL Editor to create the tables.

### 5. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000`

## Deployment (Vercel)

1. Push code to GitHub.
2. Import project into Vercel.
3. Add all environment variables from `.env` to Vercel Project Settings.
4. Deploy!

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify?token=...`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Files
- `POST /api/files/upload` (Multipart form-data)
- `GET /api/files/list`
- `GET /api/files/preview/:id`
- `GET /api/files/download/:id`
- `DELETE /api/files/delete/:id`
