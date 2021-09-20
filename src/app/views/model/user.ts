export class User {
  userId: number;
  token: string;
  username: string;
  name: string;
  avatar: string;
  roleId: string;

  constructor( userId: number, token:string,username: string, name:string, avatar: string, roleId: string) {
    this.userId = userId;
    this.token = token;
    this.username = username;
    this.name = name;
    this.avatar = avatar;
    this.roleId = roleId;
  }

  setValue(value , name): void {
    this[name] = value;
  }

}
