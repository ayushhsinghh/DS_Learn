export function sectionScrollBehavior(keyboardActivated: boolean, reduceMotion: boolean): ScrollBehavior {
  return keyboardActivated || reduceMotion ? 'instant' : 'smooth'
}

export type DrawerActivation = 'pointer' | 'keyboard' | 'escape' | 'section' | 'desktop'

export function drawerMotionPolicy(activation: DrawerActivation, reduceMotion: boolean, opening: boolean) {
  if (activation !== 'pointer') return { mode: 'instant' as const, duration: 0 }
  return { mode: 'pointer' as const, duration: reduceMotion ? 120 : opening ? 220 : 160 }
}
