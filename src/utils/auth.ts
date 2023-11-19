import { ROLE_AUTH_MAP } from "@/constants"

/** 判断当前权限是否大于目标权限 */
export const checkAuthLT = (userRole: string, targetRole: string) => {
  return ROLE_AUTH_MAP[userRole] > ROLE_AUTH_MAP[targetRole]
}

/** 判断当前权限是否大于等于目标权限 */
export const checkAuthLE = (userRole: string, targetRole: string) => {
  return ROLE_AUTH_MAP[userRole] >= ROLE_AUTH_MAP[targetRole]
}