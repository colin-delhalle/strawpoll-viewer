import { sanitize } from 'dompurify';
import iziToast, { IziToastSettings } from 'izitoast';
import PollItem from '../../pollItem';
import MessageType from '../../messageType';

browser.runtime.onMessage.addListener(messageHandler);

function messageHandler(message: any) {
    switch (message.type) {
        case MessageType.LOADING:
            iziToast.info(toastSettings('Fetching results...', false));
            break;
        case MessageType.POPULATE:
            iziToast.show(toastSettings(`${message.title}<br /><br />${buildResultsString(JSON.parse(message.serializedItems))}`));
            break;
        case MessageType.ERROR:
            iziToast.error(toastSettings(`<a href="${message.pollLink}">Error loading data, click to see the result.</a> `));
            break;
        default:
            break;
    }
}

function toastSettings(message: string, closeable: boolean = true): IziToastSettings {
    const settings: IziToastSettings = {
        id: 'strawpoll-viewer-result',
        close: closeable,
        closeOnClick: closeable,
        closeOnEscape: closeable,
        timeout: false,
        animateInside: false,
        displayMode: 2,
        message: message
    };

    return settings;
}

function buildResultsString(pollItems: Array<PollItem>): string {
    let message = '';
    for (let pi of pollItems) {
        message += sanitize(`${pi.name}: ${pi.votes}`) + '<br />';
    }

    return message;
}
