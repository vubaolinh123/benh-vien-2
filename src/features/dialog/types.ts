export type DialogAction =
  | { type: 'booking'; specialty?: string }
  | { type: 'search' }
  | { type: 'feedback' }
  | { type: 'video'; index: number }
  | { type: 'gallery'; index: number };
