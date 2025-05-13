import Metric from "./metric";
import Group from "./group";

export default interface Search {
  store: string;
  metricsGroup?: Group;
  metrics?: Metric[];
  timePeriod: string;
  name: string;
  isSaved: boolean;
}
