# SnapCove

SnapCove is a role-based, AI-powered event photo management platform for colleges, fests and universities.
It securely handles uploads, approvals, AI metadata extraction, watermarking, and public distribution of event photos.
Built for scale, moderation, and real campus workflows.

## Core Features

### Role Based System

| Role | Powers |
|------|--------|
| **Admin** | Full control, admin panel, user roles |
| **Coordinator** | Create events & approve photos |
| **Photographer** | Upload & manage photos |
| **Student** | View public approved photos |

### Smart Upload Pipeline

- Bulk & single uploads
- Automatic background processing (Celery)
- EXIF metadata extraction
- AI content tagging
- Auto watermarking
- Approval workflow

### AI Metadata Engine

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

### Moderation Workflow

| Stage | Description |
|-------|-------------|
| **Upload** | Photographer uploads |
| **Processing** | AI pipeline runs |
| **Pending** | Waiting for approval |
| **Approved** | Publicly visible |
| **Rejected** | Hidden |

### Real-time Notifications

- Like alerts
- Comment alerts
- Approval alerts

## Architecture

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

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Tailwind |
| Backend | Django REST Framework |
| Async Workers | Celery + Redis |
| AI Engine | Torch / Vision Models |
| Storage | PostgreSQL + MediaFS |
| Auth | JWT + OTP + OAuth|
| Admin | Django Admin |

## Folder Structure

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
## Running the Application

1. **Start Redis** (required for Celery):
   ```bash
   cd snapcove_backend
   redis-server
   ```

2. **Start Celery Worker** (for background tasks):
   ```bash
   cd snapcove_backend
   celery -A snapcove_backend worker -l info
   ```

3. **Start Django Server**:
   ```bash
   cd snapcove_backend
   python manage.py runserver
   ```

4. **Start Frontend**:
   ```bash
   cd snapcove-ui
   npm run dev
   ```



