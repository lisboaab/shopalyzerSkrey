export default interface Store {
  _id: string,
  shopUrl: string
  name: string
  APIKey: string
  APIToken: string
  APISecretKey: string
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
