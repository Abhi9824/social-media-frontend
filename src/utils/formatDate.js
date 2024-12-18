export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${date.toLocaleDateString("en-US", {
    month: "short",
  })}, ${date.getFullYear()}`;
};
