export class User {
  userId: number;
  token: string;
  username: string;
  name: string;
  avatar: string;
  roleId: number;

  constructor( userId: number, token:string,username: string, name:string, avatar: string) {
    this.userId = userId;
    this.token = token;
    this.username = username;
    this.name = name;
    this.avatar = avatar;
  }

  setValue(value , name): void {
    this[name] = value;
  }

}
