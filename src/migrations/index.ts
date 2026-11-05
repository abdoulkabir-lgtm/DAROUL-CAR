import * as migration_20261103_020845_initial from './20261103_020845_initial';
import * as migration_20261103_024330 from './20261103_024330';
import * as migration_20261105_172000_fiches from './20261105_172000_fiches';
import * as migration_20261105_171747_disponibilite from './20261105_171747_disponibilite';

export const migrations = [
  {
    up: migration_20261103_020845_initial.up,
    down: migration_20261103_020845_initial.down,
    name: '20261103_020845_initial',
  },
  {
    up: migration_20261103_024330.up,
    down: migration_20261103_024330.down,
    name: '20261103_024330',
  },
  {
    up: migration_20261105_171747_disponibilite.up,
    down: migration_20261105_171747_disponibilite.down,
    name: '20261105_171747_disponibilite',
  },
  {
    up: migration_20261105_172000_fiches.up,
    down: migration_20261105_172000_fiches.down,
    name: '20261105_172000_fiches',
  },
];
