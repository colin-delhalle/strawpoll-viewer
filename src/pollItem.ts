export default class PollItem {
    private _name: string;
    private _votes: number;

    constructor(name: string, votes: number) {
        this._name = name;
        this._votes = votes;
    }

    get name(): string {
        return this._name;
    }

    get votes(): number {
        return this._votes;
    }

    toJSON(): object {
        return { name: this._name, votes: this._votes };
    }
}
