export default class JsonFetcher {
    static fetchDataFromUrl(url: string): Promise<any> {

        let promise: Promise<any>;

        try {
            promise = fetch(url).then(response => response.json());
        } catch {
            return Promise.reject(new Error(`Can't fetch data at url ${url}`));
        }

        return promise;
    }
}
