export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private tokenExpirationDate: Date) { }

    // we can publicly acccess this for the _token attribute
    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }

        return this._token;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }
}