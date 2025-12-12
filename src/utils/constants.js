 const UserRolesEnum = {
  ADMIN: "admin",
  MEMBER: "Member",
  GUEST: "Guest",

};
 const AvailableUserRole = Object.values(UserRolesEnum);

 const TaskStatusEnum = {
  PENDING: "pending",
  DONE: "done",
};

 const AvailableTaskStatues = Object.values(TaskStatusEnum);

 const frequencyTypeenum={
ONCE:"once",
DAILY:"daily",
WEEKLY:"Weekly",
MONTHLY:"Monthly",
}
const AvailableFrequency = Object.values(frequencyTypeenum);

export {
  UserRolesEnum,
  AvailableFrequency,
  AvailableTaskStatues,
  frequencyTypeenum,
  AvailableUserRole,
  TaskStatusEnum
}