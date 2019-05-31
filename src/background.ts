import { browser } from 'webextension-polyfill-ts';
import PollItem from './pollItem';
import PollData from './pollData';
import MessageType from './messageType';
import PollHandler from './pollHandlers/pollHandler';
import StrawpollMeHandler from './pollHandlers/strawpollMeHandler';
import StrawpollComHandler from './pollHandlers/strawpollComHandler';

browser.contextMenus.create({
    id: 'strawpollviewer',
    contexts: ['link'],
    targetUrlPatterns: ['*://*.strawpoll.me/*', '*://*.strawpoll.com/*'],
    title: 'View poll result',
    onclick: displayPollResult
});

let tabsInjected = new Array<number>();

async function displayPollResult(info: browser.menus.OnClickData, tab: browser.tabs.Tab) {
    if (!info.linkUrl || !tab.id) return;

    let pollHandler: PollHandler;
    if (info.linkUrl.includes('.me')) pollHandler = new StrawpollMeHandler();
    else if (info.linkUrl.includes('.com')) pollHandler = new StrawpollComHandler();
    else return;

    let pollDataPromise = pollHandler.getPollData(info.linkUrl);
    pollDataPromise.catch(() => {}); // swallow error here, error handling is done in try catch await pollDataPromise later

    if (tabsInjected.indexOf(tab.id) == -1) {
        let injected = await injectScriptAndCSS(tab.id);
        if (!injected) return;
    }

    // if the page is reloaded, onMessage event handler in content script display.js is removed but in background.js array of tab still contains the id
    // so we first try to send the message and if it fails because no event handler is attached, we reattached it and resend the message
    // hacky, a better way to do would be to check if the tab is reloaded and update the array but it seems there's apparently no way of doing that
    try {
        await browser.tabs.sendMessage(tab.id, { type: MessageType.LOADING });
    } catch {
        let injected = await injectScriptAndCSS(tab.id);
        if (!injected) return;
        await browser.tabs.sendMessage(tab.id, { type: MessageType.LOADING });
    }

    let pollData: PollData;
    let pollItems: PollItem[];
    try {
        pollData = await pollDataPromise;
        pollItems = pollHandler.toPollItems(pollData);
    } catch (error) {
        console.error(`${error.message}`);
        await browser.tabs.sendMessage(tab.id, { type: MessageType.ERROR, pollLink: info.linkUrl });
        return;
    }

    await browser.tabs.sendMessage(tab.id, {
        type: MessageType.POPULATE,
        title: pollData.title,
        serializedItems: JSON.stringify(pollItems)
    });
}

async function injectScriptAndCSS(tabId: number): Promise<boolean> {
    let injected = false;

    try {
        await browser.tabs.insertCSS(tabId, { file: '/display/iziToast/iziToast.min.css' });
        await browser.tabs.executeScript(tabId, { file: '/display/iziToast/display.js' });

        if (tabsInjected.indexOf(tabId) == -1) tabsInjected.push(tabId);

        injected = true;
    } catch (error) {
        console.log(`${error.message}`);
    }

    return injected;
}
