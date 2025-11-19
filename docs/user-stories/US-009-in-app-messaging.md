# US-009: In-App Messaging with Applicants [P1]

**Status**: Approved
**Priority**: P1 (High - Eliminates email/phone context switching)
**Sprint**: Sprint 2

---

## User Story

**As an** agent (Jessica)
**I want to** communicate with applicants through the platform instead of switching between email, phone, and text
**So that** all communication is logged in one place and I can respond faster

---

## Context & Background

### Problem Statement

Agents currently communicate with applicants across multiple channels (email, phone, SMS, Facebook Messenger), losing context and spending time switching between apps. Messages are not logged with the application, making it hard to track conversation history.

### Business Rationale

- **Context Switching**: 15-20 minutes lost per day switching between communication tools
- **Audit Trail**: Communication not documented for compliance
- **Response Time**: Scattered messages lead to delayed responses

### User Pain Point

"I have conversations spread across Gmail, my phone, WhatsApp, and Facebook. When a landlord asks about an applicant, I have to dig through 4 different apps."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month
- **Impact**: 2 (High - efficiency improvement)
- **Confidence**: 80%
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 2 x 0.8) / 3 = **266.7**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: In-App Message Thread

**Given** an agent wants to contact an applicant
**When** they click "Message" from the applicant profile
**Then** a message thread opens with:
- Chat-style interface
- Full conversation history
- Typing indicators
- Read receipts

**Verification**:
- [ ] Thread displays all historical messages
- [ ] Real-time message delivery
- [ ] Read receipts show when opened

### AC-2: Multi-Channel Notification

**Given** an agent sends a message
**When** the applicant is not online
**Then** they receive notification via:
- Push notification (if app installed)
- Email with message preview
- SMS for urgent messages (configurable)

**Verification**:
- [ ] Notifications delivered to offline users
- [ ] Email includes message content
- [ ] Applicant can reply from any channel

### AC-3: Quick Responses

**Given** an agent frequently sends similar messages
**When** they compose a message
**Then** they can use:
- Saved templates ("Still interested?", "Please submit documents")
- Quick reply suggestions
- Auto-complete for common phrases

**Verification**:
- [ ] Templates are saveable and editable
- [ ] Quick replies display relevant options
- [ ] Templates support variable interpolation

### AC-4: File Sharing

**Given** agent or applicant needs to share documents
**When** they attach a file
**Then** the platform supports:
- Image upload (photos, screenshots)
- PDF upload (leases, documents)
- Preview within chat
- Download option

**Verification**:
- [ ] File upload works for common formats
- [ ] Inline preview for images
- [ ] PDF viewable without leaving app

### AC-5: Message Search

**Given** an agent needs to find a previous conversation
**When** they use search
**Then** they can search by:
- Applicant name/ID
- Keyword in message content
- Date range

**Verification**:
- [ ] Search returns relevant results
- [ ] Results link to specific message

### AC-6: Conversation Archival

**Given** messages are sent
**When** stored in the system
**Then** they are:
- Retained for 3 years (compliance)
- Accessible in audit reports
- Exportable for legal requests

**Verification**:
- [ ] Messages included in audit trail
- [ ] Retention policy enforced
- [ ] Export functionality works

---

## Technical Implementation Notes

### Backend Specification

**Data Model**:
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  thread_id UUID,
  sender_id UUID,
  sender_type VARCHAR(20), -- 'agent' or 'applicant'
  content TEXT,
  attachments JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_thread ON messages(thread_id, created_at);
```

**Real-Time**: WebSocket for live message delivery

**Notifications**: SendGrid (email), Twilio (SMS), Firebase (push)

### Frontend Specification

**Components**:
```
components/
  messaging/
    ChatThread.tsx           - Message display
    MessageComposer.tsx      - Input with templates
    FileAttachment.tsx       - Upload/preview
    QuickReplies.tsx         - Template suggestions
```

**Routing**:
- `/agent/messages` - All conversations
- `/agent/messages/[threadId]` - Single thread

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `message_sent` | Agent/applicant sends message | `{senderId, threadId, hasAttachment}` |
| `message_read` | Recipient opens message | `{messageId, readDelay}` |
| `template_used` | Agent uses saved template | `{agentId, templateId}` |

**Success Metrics**:
- 50% reduction in response time
- 80%+ of communication via platform (vs external)
- 90%+ message read rate within 24 hours

---

## Dependencies

### Blocked By
- US-005: Unified Applicant Dashboard

### Related Stories
- US-004: Audit Trail (messages logged)
- US-008: Automated Document Reminders

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Backend Developer
