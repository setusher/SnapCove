# 📸 SnapCove

SnapCove is a role-based, AI-powered event photo management platform for colleges, fests and universities.
It securely handles uploads, approvals, AI metadata extraction, watermarking, and public distribution of event photos.
Built for scale, moderation, and real campus workflows.

## 🚀 What SnapCove Solves

College events generate thousands of photos:
- No structure
- No moderation
- No attribution
- No metadata
- No security

**SnapCove fixes that.**

| Traditional Way | SnapCove |
|----------------|----------|
| WhatsApp drives | Centralized albums |
| No moderation | Admin approval workflow |
| No metadata | AI + EXIF extraction |
| No watermark | Automatic SnapCove watermark |
| No access control | Role-based upload & view |
| No AI | Smart tagging & classification |

## ✨ Core Features

### 🔐 Role Based System

| Role | Powers |
|------|--------|
| **Admin** | Full control, admin panel, user roles |
| **Coordinator** | Create events & approve photos |
| **Photographer** | Upload & manage photos |
| **Student** | View public approved photos |

### 🖼 Smart Upload Pipeline

- Bulk & single uploads
- Automatic background processing (Celery)
- EXIF metadata extraction
- AI content tagging
- Auto watermarking
- Approval workflow

### 🧠 AI Metadata Engine

Each photo automatically gets:

| Field | Extracted |
|-------|-----------|
| Camera model | From EXIF |
| Capture time | From EXIF |
| GPS location | From EXIF |
| Resolution | From EXIF |
| Content category | AI |
| Event type tags | AI |
| Watermark | Auto applied |

### 🧾 Moderation Workflow

| Stage | Description |
|-------|-------------|
| **Upload** | Photographer uploads |
| **Processing** | AI pipeline runs |
| **Pending** | Waiting for approval |
| **Approved** | Publicly visible |
| **Rejected** | Hidden |

### 🔔 Real-time Notifications

- Like alerts
- Comment alerts
- Approval alerts

## 🏗 Architecture

```
React Frontend
      ↓
Django REST API
      ↓
Redis + Celery Workers
      ↓
AI + EXIF Pipeline
      ↓
PostgreSQL + Media Store
```

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Tailwind |
| Backend | Django REST Framework |
| Async Workers | Celery + Redis |
| AI Engine | Torch / Vision Models |
| Storage | PostgreSQL + MediaFS |
| Auth | JWT + OTP |
| Admin | Django Admin |

## 📂 Folder Structure

```
snapcove_backend/
 ├ accounts/
 ├ events/
 ├ photos/
 ├ notifications/
 ├ snapcove_backend/

snapcove-ui/
 ├ src/
 │  ├ api/
 │  ├ auth/
 │  ├ components/
 │  ├ pages/
 │  └ utils/
```

## 🔧 Setup

### Backend

```bash
git clone https://github.com/yourname/snapcove
cd snapcove_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
redis-server
celery -A snapcove_backend worker -l info
python manage.py runserver
```

### Frontend

```bash
cd snapcove-ui
npm install
npm run dev
```

## 👑 Admin Access

```bash
python manage.py createsuperuser
```

Login at: `http://localhost:8000/admin`

## 📝 Environment Variables

Create a `.env` file in `snapcove_backend/` with:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/snapcove_db
REDIS_URL=redis://localhost:6379/0
```

## 🚦 Running the Application

1. **Start Redis** (required for Celery):
   ```bash
   redis-server
   ```

2. **Start Celery Worker** (for background tasks):
   ```bash
   celery -A snapcove_backend worker -l info
   ```

3. **Start Django Server**:
   ```bash
   python manage.py runserver
   ```

4. **Start Frontend**:
   ```bash
   cd snapcove-ui
   npm run dev
   ```

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add contact information here]

