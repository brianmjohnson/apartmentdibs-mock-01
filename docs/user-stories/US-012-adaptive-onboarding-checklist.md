# US-012: Adaptive Onboarding Checklist (Smart Progress Tracking) [P1]

**Status**: Approved
**Priority**: P1 (High - Improves profile completion rate)
**Sprint**: Sprint 2

---

## User Story

**As a** prospective tenant (Maya)
**I want to** see a personalized checklist that adapts to my situation
**So that** I know exactly what documents I need and how long it will take to complete my profile

---

## Context & Background

### Problem Statement

Generic onboarding flows frustrate users by asking for irrelevant documents (e.g., tax returns from salaried employees) or missing necessary documents (e.g., guarantor info for students). This leads to high abandonment rates and incomplete profiles.

### Business Rationale

- **Completion Rate**: Adaptive checklists improve completion by 30%
- **Time to Complete**: Reduced friction speeds up profile creation
- **User Experience**: Personalized flow builds trust

### User Pain Point

"I'm a salaried employee but the form keeps asking for my tax returns. Do I need them or not?"

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 tenants per month
- **Impact**: 2 (High - conversion improvement)
- **Confidence**: 80%
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 2 x 0.8) / 2 = **800**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Initial Assessment Questions

**Given** a tenant starts profile creation
**When** they begin onboarding
**Then** they answer 3-5 adaptive questions:

- Employment type: W-2, Self-employed, Student, Retired
- Pet ownership: Yes/No
- Co-applicants: Solo or group
- Recent relocation: Yes/No

**Verification**:

- [ ] Questions determine required documents
- [ ] Irrelevant steps are skipped
- [ ] Additional steps added when needed

### AC-2: Personalized Checklist

**Given** assessment is complete
**When** checklist is generated
**Then** it shows only relevant steps:

**W-2 Employee**: Pay stubs, employment verification
**Self-Employed**: Tax returns, bank statements, 1099s
**Student**: Financial aid letter, guarantor info
**Pet Owner**: Vaccination records, pet resume

**Verification**:

- [ ] Checklist matches user type
- [ ] No irrelevant items shown
- [ ] Time estimates accurate

### AC-3: Progress Visualization

**Given** tenant is completing profile
**When** they view checklist
**Then** they see:

- Progress bar: "6 of 10 steps complete"
- Time estimates: "5 minutes remaining"
- Completion percentage

**Verification**:

- [ ] Progress updates in real-time
- [ ] Estimates based on average completion times
- [ ] Encouraging messages at milestones

### AC-4: Smart Skip and Add

**Given** tenant's situation changes
**When** they update answers
**Then** checklist dynamically adjusts:

- Add: "You mentioned you have a pet. Please add vaccination records."
- Skip: "You're not self-employed. Tax returns not required."

**Verification**:

- [ ] New items appear correctly
- [ ] Skipped items removed
- [ ] Progress recalculated

### AC-5: Help Resources

**Given** tenant is stuck on a step
**When** they click for help
**Then** they see:

- "What if I don't have pay stubs?"
- "How to use Plaid for income verification"
- Video tutorials for complex steps

**Verification**:

- [ ] Contextual help available per step
- [ ] Videos embedded where helpful
- [ ] Chat support link visible

---

## Technical Implementation Notes

### Backend Specification

**Checklist Engine**: Rules engine determines required steps based on user type

**Data Model**:

```sql
CREATE TABLE onboarding_checklists (
  id UUID PRIMARY KEY,
  user_id UUID,
  user_type VARCHAR(50),
  required_steps JSONB,
  completed_steps JSONB,
  created_at TIMESTAMPTZ
);
```

### Frontend Specification

**Components**:

```
components/
  onboarding/
    AssessmentQuiz.tsx       - Initial questions
    ChecklistProgress.tsx    - Visual progress
    AdaptiveStep.tsx         - Individual step UI
    HelpDrawer.tsx           - Contextual help
```

---

## Analytics Tracking

| Event Name             | When Triggered            | Properties                     |
| ---------------------- | ------------------------- | ------------------------------ |
| `assessment_completed` | User answers questions    | `{userId, userType}`           |
| `checklist_generated`  | Personalized list created | `{userId, stepCount}`          |
| `step_completed`       | User finishes step        | `{userId, stepType, duration}` |
| `profile_completed`    | All steps done            | `{userId, totalTime}`          |

**Success Metrics**:

- 70%+ profile completion rate (up from 40%)
- Median completion time <60 minutes
- <5% support tickets related to onboarding

---

## Dependencies

### Blocks

- US-010: Reusable Profile

### Related Stories

- US-008: Automated Document Collection Reminders

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Backend Developer
