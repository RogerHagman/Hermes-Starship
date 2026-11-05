// Friendly names for the generated fixture types.
import type { OrdersFile, QuartersFile, RailLogFile, RailsFile, SensorsFile, ShipFile, ShipLogFile, StationsFile } from './fixtures';

export type { OrdersFile, QuartersFile, RailLogFile, RailsFile, SensorsFile, ShipFile, ShipLogFile, StationsFile };
export type Station = StationsFile['stations'][number];
export type Rail = RailsFile['rails'][number];
export type RailId = Rail['id'];
export type Order = OrdersFile['orders'][number];
export type LogEntry = ShipLogFile['entries'][number];
export type RailColour = Station['rail'];
export type Campaign = QuartersFile['campaigns'][number];
export type Mission = QuartersFile['missions'][number];
export type YeomanItem = QuartersFile['yeoman'][number];
export type Watch = SensorsFile['watches'][number];
export type Finding = SensorsFile['findings'][number];
export type Ask = SensorsFile['asks'][number];

/** Everything the boards read, one object per fixture file. */
export interface Fixtures {
  ship: ShipFile;
  stations: StationsFile;
  rails: RailsFile;
  orders: OrdersFile;
  shiplog: ShipLogFile;
  quarters: QuartersFile;
  sensors: SensorsFile;
  /** live/rail-log.json from the rails probe, when there is one. Its duty lines replace the samples. */
  raillog?: RailLogFile;
}
