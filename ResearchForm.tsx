/**
 * Enterprise Coding System v1.0 — approved in Decision #001.
 * Format: {PREFIX}-{REGION}-{CENTER}-{YEAR}-{SEQUENCE}
 * Example: VIS-SHQ-MQ-2026-000001
 *
 * This module is the SINGLE source of truth for code generation.
 * No feature may build its own code strings — import EntityPrefix
 * and generateEnterpriseCode from here (Rule: Never Duplicate Logic).
 */

export const CURRENT_REGION_CODE = "SHQ"; // محافظة الشرقية
export const CURRENT_CENTER_CODE = "MQ"; // منيا القمح
export const SEQUENCE_PAD_LENGTH = 6;

export enum EntityPrefix {
  Family = "FAM",
  Case = "CAS",
  Visit = "VIS",
  SocialResearch = "RES",
  Donation = "DON",
  Campaign = "CMP",
  Receipt = "RCP",
  Volunteer = "VOL",
  User = "USR",
  Document = "DOC",
  Task = "TSK",
}

export function generateEnterpriseCode(
  prefix: EntityPrefix,
  sequence: number,
  year: number = new Date().getFullYear()
): string {
  const paddedSequence = String(sequence).padStart(SEQUENCE_PAD_LENGTH, "0");
  return `${prefix}-${CURRENT_REGION_CODE}-${CURRENT_CENTER_CODE}-${year}-${paddedSequence}`;
}
