# 🧺 ChoreChain Backend

ChoreChain is a RESTful API designed to help households collaboratively manage chores.  
It supports recurring tasks, rotating assignments, completion tracking, and role-based access for household members.  
The system promotes accountability and shared responsibility through reminders, streaks, and chore analytics.

---

## 🚀 Features

- **Authentication & Authorization**
  - User registration with email verification
  - Secure login/logout with JWT tokens
  - Role-based access control (Admin, Member, Guest)

- **Household Management**
  - Create and manage households
  - Invite/remove members
  - Assign/update roles

- **Chore Management**
  - Create chores with frequency & due time
  - Assign chores to members
  - Rotation logic (e.g., alternate weekly)
  - Completion tracking & streaks

- **Notifications**
  - Email/push reminders
  - Alerts for missed chores
  - Streak progress updates

- **Analytics**
  - Member stats (completion rate, streaks)
  - Household overview dashboard



## 📂 API Endpoints

### Auth (`/api/v1/auth/`)
- `POST /register` — Register user  
- `POST /login` — Login  
- `POST /logout` — Logout  
- `GET /current-user` — Get current user  
- `POST /change-password` — Change password  
- `POST /refresh-token` — Refresh JWT  
- `GET /verify-email/:token` — Verify email  
- `POST /forgot-password` — Request reset  
- `POST /reset-password/:token` — Reset password  
- `POST /resend-verification` — Resend verification email  

### Households (`/api/v1/households/`)
- `POST /` — Create household  
- `GET /` — List user households  
- `GET /:householdId` — Get household details  
- `PUT /:householdId` — Update household (Admin only)  
- `DELETE /:householdId` — Delete household (Admin only)  
- `POST /:householdId/invite` — Invite member  
- `GET /:householdId/members` — List members  
- `PUT /:householdId/members/:userId` — Update role  
- `DELETE /:householdId/members/:userId` — Remove member  

### Chores (`/api/v1/chores/`)
- `POST /:householdId` — Create chore  
- `GET /:householdId` — List chores  
- `GET /:householdId/c/:choreId` — Get chore details  
- `PUT /:householdId/c/:choreId` — Update chore  
- `DELETE /:householdId/c/:choreId` — Delete chore  
- `POST /:householdId/c/:choreId/complete` — Mark complete  
- `GET /:householdId/c/:choreId/history` — View completion history  

### Stats (`/api/v1/stats/`)
- `GET /:householdId/members/:userId` — Member stats  
- `GET /:householdId/overview` — Household overview  

---

## 🔐 Roles & Permissions

| Feature                    | Admin | Member | Guest |
|----------------------------|-------|--------|-------|
| Create Household           | ✓     | ✗      | ✗     |
| Invite/Remove Members      | ✓     | ✗      | ✗     |
| Create/Update/Delete Chores| ✓     | ✗      | ✗     |
| View Chores                | ✓     | ✓      | ✓     |
| Mark Chore Complete        | ✓     | ✓      | ✓     |
| View Stats                 | ✓     | ✓      | ✗     |
| Rotate Chores              | ✓     | ✗      | ✗     |

---

## 🛠️ Tech Stack

- **Node.js / Express** — API framework  
- **MongoDB** — Data persistence  
- **JWT** — Authentication  
- **Multer** — File uploads (optional)  
- **Brevo** — Email notifications  

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/your-username/chorechain-backend.git
cd chorechain-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with DB_URI, JWT_SECRET, SMTP settings, etc.

# Run development server
npm run dev
