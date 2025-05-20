import Metric from "./metric";
import Group from "./group";

export default interface Search {
  _id: string;
  userId: string;
  store: string;
  metricsGroup?: Group;
  metrics?: Metric[];
  timePeriod: string;
  name: string;
  isSaved: boolean;
  createdAt: Date
  updatedAt: Date;
}
