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

  return 'PROP'
}