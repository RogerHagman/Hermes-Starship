// Friendly names for the generated fixture types.
import type { EngineeringFile, NasFile, OpsFile, OrdersFile, QuartersFile, RailLogFile, RailsFile, ScienceFile, SensorsFile, ShipFile, ShipLogFile, StationsFile } from './fixtures';

export type { EngineeringFile, NasFile, OpsFile, OrdersFile, QuartersFile, RailLogFile, RailsFile, ScienceFile, SensorsFile, ShipFile, ShipLogFile, StationsFile };
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
export type Patch = EngineeringFile['patches'][number];
export type PatchStage = Patch['stage'];
export type Model = ScienceFile['models'][number];
export type Eval = ScienceFile['evals'][number];
export type Run = ScienceFile['runs'][number];
export type Serve = ScienceFile['serving'][number];
export type Dataset = ScienceFile['datasets'][number];
export type StudyTrack = ScienceFile['study'][number];
export type Host = OpsFile['hosts'][number];
export type Container = OpsFile['containers'][number];
export type Disk = OpsFile['disks'][number];
export type Job = OpsFile['jobs'][number];
export type Backup = OpsFile['backups'][number];
export type Health = Host['state'];

/** Everything the boards read, one object per fixture file. */
export interface Fixtures {
  ship: ShipFile;
  stations: StationsFile;
  rails: RailsFile;
  orders: OrdersFile;
  shiplog: ShipLogFile;
  quarters: QuartersFile;
  sensors: SensorsFile;
  engineering: EngineeringFile;
  science: ScienceFile;
  ops: OpsFile;
  /** live/rail-log.json from the rails probe, when there is one. Its duty lines replace the samples. */
  raillog?: RailLogFile;
  /** live/nas.json from the Ops probe, when there is one. Its NAS and disks replace the sample ones in ops. */
  nas?: NasFile;
  /** live/records.json from the ship probe, when there is one: every order on file, any state. The core terminal reads it. */
  records?: OrdersFile;
}
