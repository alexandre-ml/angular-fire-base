export class UserFb {
    firstName: string;
    lastName: string;
    email: string;
    passwoard: string;
    id?: string;

    static fromJson(jsonData: any): UserFb{
        return Object.assign(new UserFb(), jsonData);
    }
}
