import Metric from "./metric";
import Group from "./group";
import Store from "./store";

export default interface Search {
  _id: string;
  userId: string;
  store: Store[] | string | [name: string] | Store;
  metricsGroup?: Group;
  metrics?: Metric[];
  timePeriod: string;
  name: string;
  isSaved: boolean;
  createdAt: Date
  updatedAt: Date;
}
