import { v4 as uuid } from "uuid";

export const bookingStages = [
  "Booking Submitted - Awaiting Admin Verification",
  "Admin Verification In Progress",
  "Admin Verified - Terms Review",
  "Terms Negotiation",
  "Contract Finalized",
  "Escrow Secured",
  "Approved - Disclosure Workspace Open",
];

export const APPROVAL_STAGE = "Approved - Disclosure Workspace Open";

export function createAdminFollowUpTask(db, booking, adminId = "u3") {
  const existing = db.followUpTasks.find((task) => task.bookingId === booking.id && task.type === "admin_verification");
  if (existing) return existing;

  const task = {
    id: uuid(),
    bookingId: booking.id,
    type: "admin_verification",
    title: `Verify booking details for ${booking.celebrityName}`,
    status: "open",
    priority: "high",
    assignedAdminId: adminId,
    requiredBeforeApproval: true,
    checklist: [
      { id: uuid(), label: "Confirm client identity and contact details", done: false },
      { id: uuid(), label: "Validate requested date, city, and event type", done: false },
      { id: uuid(), label: "Review security tier, NDA, and rider requirements", done: false },
      { id: uuid(), label: "Confirm quote and escrow terms", done: false },
    ],
    createdAt: new Date().toISOString(),
  };

  db.followUpTasks.push(task);
  return task;
}

export function closeAdminVerificationTask(db, bookingId, actorEmail) {
  const task = db.followUpTasks.find((entry) => entry.bookingId === bookingId && entry.type === "admin_verification");
  if (!task) return null;

  task.status = "completed";
  task.completedAt = new Date().toISOString();
  task.completedBy = actorEmail;
  task.checklist = task.checklist.map((item) => ({ ...item, done: true }));
  return task;
}

export function createDisclosureWorkspace(db, booking, actorEmail) {
  const existing = db.disclosureWorkspaces.find((workspace) => workspace.bookingId === booking.id);
  if (existing) return existing;

  const assignedAdminId = booking.assignedAdminId || "u3";
  const workspace = {
    id: `PDW-${uuid().slice(0, 8).toUpperCase()}`,
    bookingId: booking.id,
    status: "active",
    isolatedFromBookingForm: true,
    createdAt: new Date().toISOString(),
    createdBy: actorEmail,
    access: {
      adminIds: [assignedAdminId],
      clientUserIds: [booking.userId],
      managementTeam: [`${booking.celebrityName} management`],
    },
    modules: {
      contracts: [{ id: booking.contractId, title: `${booking.celebrityName} Professional Disclosure Agreement`, status: "draft" }],
      privateMessages: [],
      logistics: [{ id: uuid(), label: "Secure arrival, accommodation, and green-room logistics", status: "pending" }],
      disclosures: [{ id: uuid(), label: "Representation disclosures and private rider details", status: "restricted" }],
      documents: [],
    },
  };

  db.disclosureWorkspaces.push(workspace);
  booking.disclosureWorkspaceId = workspace.id;
  return workspace;
}
