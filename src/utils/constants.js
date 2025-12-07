export const UserRolesEnum = {
  ADMIN: "admin",
  MEMBER: "Member",
  GUEST: "Guest",

};
export const AvailableUserRole = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
  PENDING: "pending",
  DONE: "done",
};

export const AvailableTaskStatues = Object.values(TaskStatusEnum);

export const frequencyTypeenum={
ONCE:"once",
DAILY:"daily",
WEEKLY:"Weekly",
MONTHLY:"Monthly",
}
export const AvailableFrequency = Object.values(frequencyTypeenum);