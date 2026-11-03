import * as migration_20261103_020845_initial from './20261103_020845_initial';
import * as migration_20261103_024330 from './20261103_024330';

export const migrations = [
  {
    up: migration_20261103_020845_initial.up,
    down: migration_20261103_020845_initial.down,
    name: '20261103_020845_initial',
  },
  {
    up: migration_20261103_024330.up,
    down: migration_20261103_024330.down,
    name: '20261103_024330'
  },
];
