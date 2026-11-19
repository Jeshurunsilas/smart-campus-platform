import { z } from "zod";

export const serviceRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(15, "Please provide a detailed description (min 15 characters)"),
  departmentId: z.string().min(1, "Please select a responsible department"),
  categoryId: z.string().min(1, "Please select an issue category"),
  locationId: z.string().min(1, "Please specify the campus location"),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  attachments: z.array(z.string()).optional(),
  qrLocationToken: z.string().optional(),
});

export const requestStatusUpdateSchema = z.object({
  newStatus: z.enum([
    "Submitted",
    "Under Review",
    "Assigned",
    "Accepted",
    "In Progress",
    "On Hold",
    "Resolved",
    "Closed",
    "Rejected",
  ]),
  note: z.string().min(3, "Please provide a status update note"),
  isInternalOnly: z.boolean().default(false),
  completionPhotos: z.array(z.string()).optional(),
});

export const requestAssignmentSchema = z.object({
  staffId: z.string().min(1, "Please select a staff member"),
  notes: z.string().optional(),
  priorityOverride: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  priorityOverrideReason: z.string().optional(),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  serviceQualityRating: z.number().min(1).max(5).optional(),
  timelinessRating: z.number().min(1).max(5).optional(),
  staffCourtesyRating: z.number().min(1).max(5).optional(),
});

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;
export type RequestStatusUpdateFormData = z.infer<typeof requestStatusUpdateSchema>;
export type RequestAssignmentFormData = z.infer<typeof requestAssignmentSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
