export class User {
  userId: number;
  restId: number;
  token: string;
  username: string;
  name: string;
  avatar: string;
  roleId: string;

  constructor( 
    userId: number,
    restId: number, 
    token:string,
    username: string, 
    name:string, 
    avatar: string, 
    roleId: string) {
    this.userId = userId;
    this.token = token;
    this.username = username;
    this.name = name;
    this.avatar = avatar;
    this.roleId = roleId;
    this.restId = restId;
  }

  setValue(value , name): void {
    this[name] = value;
  }

}
