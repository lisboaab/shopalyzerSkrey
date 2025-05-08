export default interface Store {
  _id: string,
  name: string
  APIKey: string
  APIToken: string
  createdBy: [
    name: string,
    email: string
  ]
  lastModifiedBy: [
    name: string,
    email: string
  ]
  createdAt: Date
}
