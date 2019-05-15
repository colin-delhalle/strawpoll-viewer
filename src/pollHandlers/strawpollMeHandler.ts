import PollHandler from './pollHandler';
import JsonFetcher from '../jsonFetcher';
import PollItem from '../pollItem';
import PollData from '../pollData';

export default class StrawpollMeHandler implements PollHandler {
    private _baseUrl = 'https://strawpoll.me/api/v2/polls/';

    getPollData(link: string): Promise<PollData> {
        const matches = new RegExp('.*/(\\d*)').exec(link);

        if (!matches || matches[1] == '') return Promise.reject(new Error(`Invalid link ${link}`));

        const apiUrl = this._baseUrl + matches[1];

        return JsonFetcher.fetchDataFromUrl(apiUrl);
    }

    toPollItems(data: PollData): PollItem[] {
        const options: string[] = data.options;
        const votes: number[] = data.votes;

        const pollResult: PollItem[] = options.map((x, i) => new PollItem(x, votes[i]));
        pollResult.sort((a, b) => b.votes - a.votes);

        return pollResult;
    }
}
