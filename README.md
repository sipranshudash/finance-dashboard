# 💰 FinDash — Finance Management Dashboard

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.x-092E20?style=for-the-badge&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/Django_REST_Framework-red?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A powerful, full-stack finance management system with role-based access control, smart analytics, and real-time insights.**

[🚀 Getting Started](#-getting-started) &nbsp;•&nbsp; [✨ Features](#-features) &nbsp;•&nbsp; [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) &nbsp;•&nbsp; [📡 API Reference](#-api-reference) &nbsp;•&nbsp; [📸 Screenshots](#-screenshots)

</div>

---

## 📌 About The Project

**FinDash** is a full-stack finance management web application that helps individuals and teams track income, expenses, and financial health — all in one place.

It features a clean, role-based system where **Admins** manage financial data, **Analysts** explore insights and trends, and **Viewers** monitor the dashboard in read-only mode. Built with a Django REST API backend and a React + Redux frontend, FinDash is designed to be secure, scalable, and easy to use.

### Why FinDash?
- 📊 Get a clear picture of your finances at a glance
- 🔐 Control who can view, analyze, or modify financial data
- 📈 Spot trends before they become problems
- 🗂️ Organize transactions by category, type, and date
- 💡 Built with clean architecture and maintainable code

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based login with automatic access token refresh
- Secure password hashing via Django's auth system
- Protected API endpoints — every route is role-guarded
- Token stored securely with auto-logout on expiry

### 👥 User & Role Management
- Three distinct roles: **Viewer**, **Analyst**, **Admin**
- Admins can create, update, and deactivate users
- Role-based UI — sidebar and pages adapt to the logged-in role
- Active / Inactive user status control

### 💳 Financial Records
- Create, view, update, and soft-delete transactions
- Each transaction tracks: amount, type, category, date, and notes
- Soft delete — records are hidden but never permanently lost
- Filter by type, category, date range, and amount range
- Search transactions by notes or keywords
- Sort by date, amount, or creation time

### 📊 Dashboard & Analytics
- Real-time summary: total income, expenses, and net balance
- Interactive bar chart — monthly income vs expense comparison
- Line chart — financial trends over the last 6 months
- Pie chart — expense breakdown by category
- Recent activity feed — last 10 transactions at a glance
- Full dashboard data served in a single optimized API call

### 🎨 Frontend Experience
- Responsive, modern UI with Tailwind CSS
- Redux Toolkit for predictable global state management
- Role-aware navigation — users only see what they can access
- Empty states, loading indicators, and toast notifications
- Net total footer on transaction table
- Clean form validation with helpful error messages

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.10+** | Core language |
| **Django 4.x** | Web framework |
| **Django REST Framework** | API layer |
| **SimpleJWT** | JWT authentication |
| **django-filter** | Query filtering |
| **drf-spectacular** | Swagger API docs |
| **django-cors-headers** | Cross-origin requests |
| **SQLite** | Database |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + Vite** | UI framework |
| **Redux Toolkit** | State management |
| **React Router DOM v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualization |
| **React Icons** | Icon library |

---

## 📁 Project Structure

```
findash/
│
├── backend/                        # Django REST API
│   ├── core/                       # Project config
│   │   ├── settings.py             # App settings, JWT, CORS, DRF config
│   │   ├── urls.py                 # Root URL routing
│   │   └── wsgi.py
│   │
│   ├── users/                      # Auth & user management
│   │   ├── models.py               # CustomUser with role field
│   │   ├── serializers.py          # Register & User serializers
│   │   ├── views.py                # Register, login, me, CRUD
│   │   ├── permissions.py          # IsAdmin, IsAnalyst, IsViewer
│   │   └── urls.py
│   │
│   ├── finance/                    # Transaction management
│   │   ├── models.py               # Transaction model with soft delete
│   │   ├── serializers.py          # Validation logic
│   │   ├── views.py                # CRUD + role-based access
│   │   ├── filters.py              # Date, amount, type, category filters
│   │   └── urls.py
│   │
│   ├── dashboard/                  # Analytics & summary
│   │   ├── views.py                # Summary, trends, categories, recent
│   │   └── urls.py
│   │
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                       # React + Redux SPA
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js    # Base Axios with JWT interceptor
    │   │   ├── auth.js             # Login, register, me
    │   │   ├── finance.js          # Transaction API calls
    │   │   └── dashboard.js        # Dashboard API calls
    │   │
    │   ├── store/
    │   │   ├── store.js            # Redux store config
    │   │   └── slices/
    │   │       ├── authSlice.js    # Auth state, login, logout
    │   │       ├── transactionSlice.js
    │   │       ├── dashboardSlice.js
    │   │       └── userSlice.js
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx         # Role-aware navigation
    │   │   └── ProtectedRoute.jsx  # Route guard by role
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx       # Summary cards + charts
    │   │   ├── Transactions.jsx    # Full CRUD table
    │   │   ├── Analytics.jsx       # Deep dive charts
    │   │   └── Users.jsx           # Admin user management
    │   │
    │   ├── App.jsx                 # Routes setup
    │   └── main.jsx                # Redux Provider entry
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/findash.git
cd findash
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create your admin user
python manage.py createsuperuser
```

**Set the admin role** (required after createsuperuser):

```bash
python manage.py shell
```

```python
from users.models import CustomUser
user = CustomUser.objects.get(username='your_username')
user.role = 'admin'
user.save()
exit()
```

**Seed sample data** (optional but recommended):

```bash
python manage.py shell
```

```python
from users.models import CustomUser
from finance.models import Transaction
from datetime import date

user = CustomUser.objects.get(username='your_username')

Transaction.objects.bulk_create([
    Transaction(amount=50000, type='income',  category='salary',        date=date(2026, 2, 1),  notes='February salary',    created_by=user),
    Transaction(amount=12000, type='expense', category='rent',          date=date(2026, 2, 2),  notes='February rent',      created_by=user),
    Transaction(amount=4500,  type='expense', category='food',          date=date(2026, 2, 10), notes='Monthly groceries',  created_by=user),
    Transaction(amount=2000,  type='expense', category='transport',     date=date(2026, 2, 14), notes='Fuel & cab',         created_by=user),
    Transaction(amount=15000, type='income',  category='other',         date=date(2026, 2, 20), notes='Freelance project',  created_by=user),
    Transaction(amount=50000, type='income',  category='salary',        date=date(2026, 3, 1),  notes='March salary',       created_by=user),
    Transaction(amount=12000, type='expense', category='rent',          date=date(2026, 3, 2),  notes='March rent',         created_by=user),
    Transaction(amount=3500,  type='expense', category='food',          date=date(2026, 3, 8),  notes='Groceries',          created_by=user),
    Transaction(amount=1500,  type='expense', category='entertainment', date=date(2026, 3, 15), notes='OTT subscriptions',  created_by=user),
    Transaction(amount=5000,  type='expense', category='healthcare',    date=date(2026, 3, 18), notes='Medical checkup',    created_by=user),
    Transaction(amount=50000, type='income',  category='salary',        date=date(2026, 4, 1),  notes='April salary',       created_by=user),
    Transaction(amount=12000, type='expense', category='rent',          date=date(2026, 4, 2),  notes='April rent',         created_by=user),
    Transaction(amount=5000,  type='expense', category='utilities',     date=date(2026, 4, 3),  notes='Electricity & wifi', created_by=user),
    Transaction(amount=3000,  type='expense', category='food',          date=date(2026, 4, 4),  notes='Dining out',         created_by=user),
    Transaction(amount=20000, type='income',  category='other',         date=date(2026, 4, 5),  notes='Consulting payment', created_by=user),
])

print(f'✅ {Transaction.objects.count()} transactions added!')
exit()
```

**Start the backend server:**

```bash
python manage.py runserver
```

| Service | URL |
|---|---|
| 🔗 REST API | `http://127.0.0.1:8000/api/` |
| 📄 Swagger Docs | `http://127.0.0.1:8000/api/docs/` |
| ⚙️ Django Admin | `http://127.0.0.1:8000/admin/` |

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

| Service | URL |
|---|---|
| 🌐 App | `http://localhost:5173` |
| 🔑 Login | `http://localhost:5173/login` |
| 📝 Register | `http://localhost:5173/register` |

---

## 🔑 Roles & Permissions

FinDash implements a strict three-tier role system enforced at both the API and UI levels.

| Feature | 👁️ Viewer | 🔍 Analyst | ⚡ Admin |
|---|:---:|:---:|:---:|
| View transactions | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View dashboard summary | ❌ | ✅ | ✅ |
| View analytics & charts | ❌ | ✅ | ✅ |
| View category breakdown | ❌ | ✅ | ✅ |
| Create transactions | ❌ | ❌ | ✅ |
| Update transactions | ❌ | ❌ | ✅ |
| Delete transactions | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 📡 API Reference

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Create a new account | Public |
| `POST` | `/api/auth/login/` | Login and get JWT tokens | Public |
| `POST` | `/api/auth/token/refresh/` | Refresh your access token | Public |
| `GET` | `/api/auth/me/` | Get current user profile | ✅ Required |

### 👥 Users *(Admin only)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/` | List all users |
| `PATCH` | `/api/auth/<id>/` | Update user role or status |
| `DELETE` | `/api/auth/<id>/` | Remove a user |

### 💳 Transactions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/transactions/` | List transactions | All roles |
| `POST` | `/api/transactions/` | Create transaction | Admin |
| `GET` | `/api/transactions/<id>/` | Get single transaction | All roles |
| `PATCH` | `/api/transactions/<id>/` | Edit transaction | Admin |
| `DELETE` | `/api/transactions/<id>/` | Soft delete transaction | Admin |

#### Query Parameters for Filtering

| Parameter | Type | Example | Description |
|---|---|---|---|
| `type` | string | `income` | Filter by income or expense |
| `category` | string | `salary` | Filter by category |
| `date_from` | date | `2026-01-01` | Transactions from this date |
| `date_to` | date | `2026-04-05` | Transactions up to this date |
| `amount_min` | number | `1000` | Minimum amount |
| `amount_max` | number | `50000` | Maximum amount |
| `search` | string | `rent` | Search in notes |
| `ordering` | string | `-amount` | Sort field (prefix `-` for desc) |

### 📊 Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/summary/` | Income, expense & net balance | Analyst+ |
| `GET` | `/api/dashboard/categories/` | Totals grouped by category | Analyst+ |
| `GET` | `/api/dashboard/trends/monthly/` | Last 6 months trend data | Analyst+ |
| `GET` | `/api/dashboard/trends/weekly/` | Last 8 weeks trend data | Analyst+ |
| `GET` | `/api/dashboard/recent/` | Last 10 transactions | All roles |
| `GET` | `/api/dashboard/full/` | Everything in one call | Analyst+ |

---

## 🗄️ Data Models

### CustomUser
| Field | Type | Notes |
|---|---|---|
| `id` | Auto | Primary key |
| `username` | String | Unique |
| `email` | String | Optional |
| `password` | String | Hashed |
| `role` | Choice | `viewer` / `analyst` / `admin` |
| `is_active` | Boolean | Default: `True` |
| `date_joined` | DateTime | Auto |

### Transaction
| Field | Type | Notes |
|---|---|---|
| `id` | Auto | Primary key |
| `amount` | Decimal | Must be > 0 |
| `type` | Choice | `income` / `expense` |
| `category` | Choice | salary, food, rent, transport, healthcare, entertainment, utilities, other |
| `date` | Date | No future dates allowed |
| `notes` | Text | Optional |
| `created_by` | FK | References CustomUser |
| `created_at` | DateTime | Auto |
| `updated_at` | DateTime | Auto |
| `is_deleted` | Boolean | Soft delete flag |

---

## ⚙️ Environment & Configuration

All configuration is in `backend/core/settings.py`. Key settings:

```python
# JWT Token lifetimes
ACCESS_TOKEN_LIFETIME  = 1 day
REFRESH_TOKEN_LIFETIME = 7 days

# Database
DATABASE = SQLite (db.sqlite3)

# CORS
CORS_ALLOW_ALL_ORIGINS = True  # restrict in production
```

---

## 📦 Dependencies

### Backend (`requirements.txt`)
```
django
djangorestframework
djangorestframework-simplejwt
django-filter
drf-spectacular
django-cors-headers
```

### Frontend (`package.json`)
```
react
vite
@reduxjs/toolkit
react-redux
axios
react-router-dom
tailwindcss
recharts
react-icons
```

---




## 👨‍💻 Author

<div align="center">

**Sipranshu Dash**

B.Tech — NIT Andhra Pradesh

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sipranshudash)
[![LinkedIn](https://www.linkedin.com/in/sipranshu-dash-b400972b2/)]

</div>

---

