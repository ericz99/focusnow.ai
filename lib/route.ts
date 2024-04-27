export const getMainRoute = (teamId: string) => {
  return [
    {
      label: "Home",
      path: `/app/${teamId}`,
      isDisabled: false,
    },
    {
      label: "Usage",
      path: `/app/${teamId}/usage`,
      isDisabled: false,
    },
    {
      label: "Plans",
      path: `/app/${teamId}/plans`,
      isDisabled: false,
    },
    {
      label: "Members",
      path: `/app/${teamId}/members`,
      isDisabled: false,
    },
    {
      label: "Settings",
      path: `/app/${teamId}/settings`,
      isDisabled: false,
    },
  ];
};

export const getAssistantRoute = (teamId: string, assistantId: string) => {
  return [
    {
      label: "Document",
      path: `/app/${teamId}/${assistantId}/document`,
      isDisabled: false,
    },
    {
      label: "Playground",
      path: `/app/${teamId}/${assistantId}/playground`,
      isDisabled: false,
    },
    {
      label: "Settings",
      path: `/app/${teamId}/${assistantId}/settings`,
      isDisabled: false,
    },
  ];
};
