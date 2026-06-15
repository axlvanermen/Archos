export function applyTheme(primary: string, secondary: string, accent: string = '#C4943A') {
  const root = document.documentElement
  root.style.setProperty('--color-primary', primary)
  root.style.setProperty('--color-secondary', secondary)
  root.style.setProperty('--color-accent', accent)
}

export function resetTheme() {
  applyTheme('#0F172A', '#334155', '#C4943A')
}
