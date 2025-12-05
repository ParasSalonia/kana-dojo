@echo off
git add -A
git commit -m "perf: optimize audio loading and caching for reduced data transfer

- Replace use-sound with native HTMLAudioElement for lazy loading
- Audio files now only load on first play, not on component mount
- Implement in-memory caching to prevent re-downloading within session
- Add immutable cache headers (1 year) for /sounds/* in next.config.ts
- Respect silentMode preference by skipping audio load entirely
- Reduce click sounds from 4 files loaded to 1 random file on-demand
- Savings: 100% initial load reduction, 75% click sound reduction per component
- Add audio compression script for optional 90% file size reduction
- Add comprehensive audio optimization documentation

BREAKING CHANGE: Removed use-sound dependency, now using native Web Audio API"
