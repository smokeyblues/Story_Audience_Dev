// src/lib/types.ts

// Type combining team membership role and the joined team details
export type TeamMembershipWithTeamDetails = {
  role: string
  // The 'teams' property comes from the join query:
  // .select(` role, teams ( id, name, owner_user_id ) `)
  teams: {
    id: string
    name: string
    owner_user_id: string | null
  } | null // Allow null in case of OUTER JOIN or unexpected results, though INNER is default
}

// You can add other shared application types here later
export type Project = {
  id: string
  name: string
  created_at: string // Or Date if you consistently parse timestamps
  updated_at: string // Or Date
  owner_team_id: string // Foreign key ID

  // Optional: Include nested team details if commonly fetched together
  teams?: {
    id: string
    name: string
  } | null
}

export type DashboardProject = {
  id: string
  name: string
  teams: {
    id: string
    name: string
  } | null
}
