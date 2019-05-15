import PollData from "../pollData";
import PollItem from "../pollItem";

export default interface PollHandler {
    getPollData(link: string): Promise<PollData>;
    toPollItems(data: PollData): Array<PollItem>;
}