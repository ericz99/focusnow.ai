export const getMainRoute = () => {
  return [
    {
      label: "Dashboard",
      path: `/app`,
      isDisabled: false,
    },
    {
      label: "Documents",
      path: `/app/documents`,
      isDisabled: false,
    },
    {
      label: "Code Copilot",
      path: `/app/coding`,
      isDisabled: false,
    },
    {
      label: "Interview Copilot",
      path: `/app/interview`,
      isDisabled: false,
    },
  ];
};
