export const getMainRoute = () => {
  return [
    {
      label: "Dashboard",
      path: `/app/dashboard`,
      isDisabled: false,
    },
    {
      label: "Documents",
      path: `/app/documents`,
      isDisabled: false,
    },
    {
      label: "Jobs",
      path: `/app/jobs`,
      isDisabled: false,
    },
    {
      label: "Interview Copilot",
      path: `/app/interview`,
      isDisabled: false,
    },
  ];
};
