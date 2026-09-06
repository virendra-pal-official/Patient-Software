/**
 * MemberNames.tsx
 * Displays the project team members sourced from "Member Name.txt"
 */

/* ── Member data (mirrors content of Member Name.txt) ─────────────────── */
export interface ProjectMember {
  name: string
  role: string
  isLeader?: boolean
  initials: string
}

export const PROJECT_MEMBERS: ProjectMember[] = [
  { name: 'Virendra Pal', role: 'Team Leader', isLeader: true, initials: 'VP' },
  { name: 'Anshu Gangwar', role: 'Team Member', initials: 'AG' },
  { name: 'Akshara Sharma', role: 'Team Member', initials: 'AS' },
  { name: 'Sakshi Gangwar', role: 'Team Member', initials: 'SG' },
  { name: 'Sheetal Gangwar', role: 'Team Member', initials: 'SG' },
  { name: 'Sanjay Gangwar', role: 'Team Member', initials: 'SG' },
]

/* ── Component ─────────────────────────────────────────────────────────── */
export function MemberNames() {
  return (
    <section className="project-members-section" aria-labelledby="project-members-heading">
      <div className="project-members-header">
        <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          {/* Users icon inline SVG to avoid extra import */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          PROJECT TEAM · SIH 2026 · MEMBER NAME.TXT
        </span>
        <h2 id="project-members-heading">Meet the Builders</h2>
        <p>The passionate team of six who designed, developed, and delivered MediKiosk end-to-end for SIH 2026.</p>
      </div>

      <div className="project-members-grid" role="list">
        {PROJECT_MEMBERS.map((member, index) => (
          <div
            key={index}
            className={`project-member-card ${member.isLeader ? 'project-member-leader' : ''}`}
            role="listitem"
          >
            <div className="project-member-avatar" aria-hidden="true">
              {member.initials}
            </div>
            <div className="project-member-info">
              <strong className="project-member-name">{member.name}</strong>
              <span className="project-member-role">
                {member.isLeader ? '⭐ ' : ''}{member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
