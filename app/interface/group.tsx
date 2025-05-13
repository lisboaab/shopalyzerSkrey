import Metric from "./metric";
export default interface Group {
  _id: string;
  name: string;
  status: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  icon: string;
  metrics?: Metric[];
  createdAt?: string;
  updatedAt?: string;
}
