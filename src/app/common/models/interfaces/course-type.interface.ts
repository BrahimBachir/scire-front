export interface ICourseType {
  id: number; 
  code: string; 
  description: string; 
}

// Based on the given string, a function that ruturns the appropriate course type
export function getDefaultCourseType(roleCode: string): string {

  if (roleCode === 'SUPER')
    return 'PROP'
  else if (roleCode === 'USER' || roleCode === 'STUDENT')
    return 'COM'
  else if (roleCode === 'INSTRUCTOR')
    return 'TUT'
  else if (roleCode === 'ADMIN')
    return 'ORG'

  return 'PROP'
}

// Mirrors the backend rules in scire-api/src/modules/learning/course/course-permissions.helper.ts
export function canCreateCourseType(typeCode: string | undefined, userRoleCode: string | undefined): boolean {
  if (userRoleCode === 'SUPER') return true;

  switch (typeCode) {
    case 'PROP':
      return false;
    case 'COM':
      return true;
    case 'ORG':
      return userRoleCode === 'ADMIN';
    case 'TUT':
      return userRoleCode === 'INSTRUCTOR';
    default:
      return false;
  }
}

// organizationId is the course's own org; userOrganizationId is the caller's
// — an ADMIN may only touch ORG courses in their own org, not any such
// course platform-wide. TUT courses belong to the Instructor who created
// them (they need not belong to an org at all), so they're creator-scoped
// instead, like COM. UX only, the backend is the real boundary.
export function canEditCourse(
  typeCode: string | undefined,
  creatorId: number | undefined,
  userRoleCode: string | undefined,
  userId: number | undefined,
  organizationId?: number,
  userOrganizationId?: number,
): boolean {
  if (userRoleCode === 'SUPER') return true;

  switch (typeCode) {
    case 'PROP':
      return false;
    case 'COM':
      return true;
    case 'ORG':
      return userRoleCode === 'ADMIN' && !!organizationId && organizationId === userOrganizationId;
    case 'TUT':
      return userRoleCode === 'INSTRUCTOR' && creatorId !== undefined && creatorId === userId;
    default:
      return false;
  }
}

export function canDeleteCourse(
  typeCode: string | undefined,
  creatorId: number | undefined,
  userRoleCode: string | undefined,
  userId: number | undefined,
  organizationId?: number,
  userOrganizationId?: number,
): boolean {
  if (userRoleCode === 'SUPER') return true;

  switch (typeCode) {
    case 'PROP':
      return false;
    case 'COM':
      return creatorId !== undefined && creatorId === userId;
    case 'ORG':
      return userRoleCode === 'ADMIN' && !!organizationId && organizationId === userOrganizationId;
    case 'TUT':
      return userRoleCode === 'INSTRUCTOR' && creatorId !== undefined && creatorId === userId;
    default:
      return false;
  }
}