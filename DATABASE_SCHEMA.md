# Database Schema Documentation

This document describes the database structure for the Therapy Pathways application using Blink.new's database service.

## Tables Overview

The application uses 6 main tables to store user data:
1. `appointments` - Therapy session scheduling
2. `session_reflections` - Post-session check-ins
3. `goals` - Therapy goals and progress tracking
4. `topics` - Topics to discuss in future sessions
5. `journal_entries` - Free-form journaling
6. `mood_logs` - Daily mood tracking

---

## Table Schemas

### 1. `appointments`

Stores scheduled and completed therapy sessions.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | string | Unique identifier (UUID) | Primary Key |
| `user_id` | string | Reference to authenticated user | Foreign Key, Indexed |
| `date` | string (ISO 8601) | Session date and time | Required |
| `time` | string | Session time (formatted) | Optional |
| `status` | string | Session status | Enum: 'scheduled', 'completed', 'cancelled' |
| `notes` | text | Pre-session or general notes | Optional |
| `created_at` | string (ISO 8601) | Record creation timestamp | Auto-generated |

**Indexes:**
- `user_id` - for filtering by user
- `date` - for chronological sorting
- `status` - for filtering by status

**Sample Record:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_12345",
  "date": "2026-01-25T14:00:00.000Z",
  "time": "2:00 PM",
  "status": "scheduled",
  "notes": "Discuss boundary setting strategies",
  "created_at": "2026-01-22T10:30:00.000Z"
}
```

---

### 2. `session_reflections`

Stores guided reflections completed after therapy sessions.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | string | Unique identifier (UUID) | Primary Key |
| `user_id` | string | Reference to authenticated user | Foreign Key, Indexed |
| `appointment_id` | string | Reference to appointment (or 'manual') | Foreign Key |
| `feeling` | text | How user felt after session | Optional |
| `takeaways` | text | Key insights from session | Optional |
| `topics_discussed` | text | Topics covered in session | Optional |
| `progress` | text | Progress made and next steps | Optional |
| `created_at` | string (ISO 8601) | Record creation timestamp | Auto-generated |

**Indexes:**
- `user_id` - for filtering by user
- `appointment_id` - for linking to appointments
- `created_at` - for chronological sorting

**Sample Record:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "user_12345",
  "appointment_id": "550e8400-e29b-41d4-a716-446655440000",
  "feeling": "Exhausted but hopeful",
  "takeaways": "Learned that my people-pleasing patterns stem from childhood experiences",
  "topics_discussed": "Family dynamics, boundary setting, self-compassion",
  "progress": "Successfully said no to extra work this week. Next: practice boundaries with family",
  "created_at": "2026-01-25T15:30:00.000Z"
}
```

---

### 3. `goals`

Tracks therapy goals and progress metrics.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | string | Unique identifier (UUID) | Primary Key |
| `user_id` | string | Reference to authenticated user | Foreign Key, Indexed |
| `title` | string | Goal description | Required |
| `target_progress` | integer | Total steps to complete goal | Default: 100 |
| `current_progress` | integer | Current progress count | Default: 0 |
| `is_completed` | integer | Completion status (0 or 1) | Default: 0 |
| `created_at` | string (ISO 8601) | Record creation timestamp | Auto-generated |

**Indexes:**
- `user_id` - for filtering by user
- `is_completed` - for filtering active/completed goals
- `created_at` - for chronological sorting

**Sample Record:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "user_12345",
  "title": "Practice setting boundaries at work",
  "target_progress": 10,
  "current_progress": 3,
  "is_completed": 0,
  "created_at": "2026-01-15T09:00:00.000Z"
}
```

---

### 4. `topics`

Stores topics that users want to discuss in future therapy sessions.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | string | Unique identifier (UUID) | Primary Key |
| `user_id` | string | Reference to authenticated user | Foreign Key, Indexed |
| `title` | string | Topic title/summary | Required |
| `description` | text | Detailed topic description | Optional |
| `priority` | string | Topic priority level | Enum: 'low', 'medium', 'high' |
| `is_completed` | string | Whether topic was discussed ("0" or "1") | Default: "0" |
| `created_at` | string (ISO 8601) | Record creation timestamp | Auto-generated |

**Indexes:**
- `user_id` - for filtering by user
- `is_completed` - for filtering discussed/pending topics
- `priority` - for sorting by priority

**Sample Record:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "user_id": "user_12345",
  "title": "Difficulty saying no to family requests",
  "description": "Keep agreeing to help even when overwhelmed. Need strategies.",
  "priority": "high",
  "is_completed": "0",
  "created_at": "2026-01-20T18:45:00.000Z"
}
```

---

### 5. `journal_entries`

Stores free-form journal entries with optional prompts.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | string | Unique identifier (UUID) | Primary Key |
| `user_id` | string | Reference to authenticated user | Foreign Key, Indexed |
| `content` | text | Journal entry content | Required |
| `prompt` | text | Prompt that inspired entry | Optional |
| `created_at` | string (ISO 8601) | Record creation timestamp | Auto-generated |

**Indexes:**
- `user_id` - for filtering by user
- `created_at` - for chronological sorting

**Sample Record:**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "user_id": "user_12345",
  "content": "Today I noticed tension in my shoulders when my manager asked for help. I paused and remembered my boundary-setting practice. I said I could help but not until tomorrow. It felt uncomfortable but empowering.",
  "prompt": "What physical sensations did you notice during a difficult moment today?",
  "created_at": "2026-01-22T20:15:00.000Z"
}
```

---

### 6. `mood_logs`

Tracks daily mood check-ins.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | string | Unique identifier (UUID) | Primary Key |
| `user_id` | string | Reference to authenticated user | Foreign Key, Indexed |
| `mood` | string | Mood rating | Enum: 'great', 'good', 'okay', 'bad', 'terrible' |
| `created_at` | string (ISO 8601) | Record creation timestamp | Auto-generated |

**Indexes:**
- `user_id` - for filtering by user
- `created_at` - for chronological sorting and trend analysis

**Sample Record:**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "user_id": "user_12345",
  "mood": "good",
  "created_at": "2026-01-22T08:30:00.000Z"
}
```

---

## Relationships

```
users (managed by Blink Auth)
  │
  ├──< appointments
  │     └──< session_reflections
  │
  ├──< goals
  │
  ├──< topics
  │
  ├──< journal_entries
  │
  └──< mood_logs
```

---

## Data Access Patterns

### Common Queries

1. **Get upcoming appointments:**
```typescript
await blink.db.appointments.list({
  where: { user_id: user.id, status: 'scheduled' },
  orderBy: { date: 'asc' }
})
```

2. **Get recent reflections:**
```typescript
await blink.db.session_reflections.list({
  where: { user_id: user.id },
  orderBy: { created_at: 'desc' },
  limit: 10
})
```

3. **Get active goals:**
```typescript
await blink.db.goals.list({
  where: { user_id: user.id, is_completed: 0 },
  orderBy: { created_at: 'desc' }
})
```

4. **Get high-priority topics:**
```typescript
await blink.db.topics.list({
  where: { user_id: user.id, is_completed: "0", priority: "high" },
  orderBy: { created_at: 'desc' }
})
```

5. **Get mood trends:**
```typescript
await blink.db.mood_logs.list({
  where: { user_id: user.id },
  orderBy: { created_at: 'desc' },
  limit: 30
})
```

---

## Data Privacy & Security

- All records are scoped to `user_id` from Blink authentication
- Data is encrypted at rest by Blink.new
- Users can only access their own records
- No data is shared between users
- Authentication is required for all database operations

---

## Migration Notes

If you need to modify the schema:

1. Blink.new automatically handles schema migrations
2. Add new columns by updating your code to write the new fields
3. For breaking changes, consider versioning your data structures
4. Always test schema changes in a development environment first

---

## Backup & Recovery

Blink.new provides automatic backups. To export your data:

1. Use the Blink dashboard to export data
2. Implement a custom export feature in your app
3. Consider periodic exports for compliance

---

*Last Updated: 2026-01-22*