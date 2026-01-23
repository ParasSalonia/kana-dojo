import { create } from 'zustand';
import themeSets from '@/features/Preferences/data/themes';
import fonts from '@/features/Preferences/data/fonts';
import { Random } from 'random-js';

// The special theme ID that triggers crazy mode
export const KYOKI_THEME_ID = 'kyoki';

interface CrazyModeState {
  activeThemeId: string | null;
  activeFontName: string | null;
  randomize: () => void;
}

const random = new Random();

const useCrazyModeStore = create<CrazyModeState>()(set => ({
  activeThemeId: null,
  activeFontName: null,

  randomize: () => {
    // Flatten themes to get all available theme IDs, excluding kyoki itself
    const allThemes = themeSets
      .flatMap(group => group.themes)
      .filter(theme => theme.id !== KYOKI_THEME_ID);
    const randomTheme = allThemes[random.integer(0, allThemes.length - 1)];

    const randomFont =
      fonts.length > 0 ? fonts[random.integer(0, fonts.length - 1)] : null;

    set({
      activeThemeId: randomTheme.id,
      activeFontName: randomFont?.name ?? null
    });
  }
}));

export default useCrazyModeStore;
