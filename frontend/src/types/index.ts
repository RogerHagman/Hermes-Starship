// Friendly names for the generated fixture types.
import type { OrdersFile, QuartersFile, RailsFile, ShipFile, ShipLogFile, StationsFile } from './fixtures';

export type { OrdersFile, QuartersFile, RailsFile, ShipFile, ShipLogFile, StationsFile };
export type Station = StationsFile['stations'][number];
export type Rail = RailsFile['rails'][number];
export type RailId = Rail['id'];
export type Order = OrdersFile['orders'][number];
export type LogEntry = ShipLogFile['entries'][number];
export type RailColour = Station['rail'];
export type Campaign = QuartersFile['campaigns'][number];
export type Mission = QuartersFile['missions'][number];
export type YeomanItem = QuartersFile['yeoman'][number];

/** Everything the boards read, one object per fixture file. */
export interface Fixtures {
  ship: ShipFile;
  stations: StationsFile;
  rails: RailsFile;
  orders: OrdersFile;
  shiplog: ShipLogFile;
  quarters: QuartersFile;
}
