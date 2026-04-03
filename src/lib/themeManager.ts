export const applyTheme = (theme: any) => {
  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--bg", theme.bg);
  localStorage.setItem("theme", JSON.stringify(theme));
};
