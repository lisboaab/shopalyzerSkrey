export default interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  notification: boolean;
  userType: string;
}
