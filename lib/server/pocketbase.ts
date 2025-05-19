
import PocketBase from 'pocketbase';

export const getPocketBase = () => new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export const pb = getPocketBase();

export const initPocketBase = (request?: Request) => {
    const pbInstance = getPocketBase();

   
    if (request) {
        const cookie = request.headers.get('cookie');
        console.log(cookie);
        if (cookie) {
            const test = pbInstance.authStore.loadFromCookie(cookie, 'pb_auth');
            console.log(test)
        }
    }


    return pbInstance;
};