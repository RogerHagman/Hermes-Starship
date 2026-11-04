// Friendly names for the generated fixture types.
import type { OrdersFile, RailsFile, ShipFile, ShipLogFile, StationsFile } from './fixtures';

export type { OrdersFile, RailsFile, ShipFile, ShipLogFile, StationsFile };
export type Station = StationsFile['stations'][number];
export type Rail = RailsFile['rails'][number];
export type RailId = Rail['id'];
export type Order = OrdersFile['orders'][number];
export type LogEntry = ShipLogFile['entries'][number];
export type RailColour = Station['rail'];

/** Everything the bridge reads, one object per fixture file. */
export interface Fixtures {
  ship: ShipFile;
  stations: StationsFile;
  rails: RailsFile;
  orders: OrdersFile;
  shiplog: ShipLogFile;
}
