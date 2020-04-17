import http from 'k6/http';
import { check, sleep } from 'k6';
export let options = {
    stages: [
        { duration: '10s', target: 300 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
        { duration: '10s', target: 300 },
        { duration: '10s', target: 0 }, // ramp-down to 0 users
    ],
    // thresholds: {
    //   'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    //   'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    // }
};

function makeid(length=50) {
    var result = '';
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export default function () {
    const uid = makeid()
    var url = 'http://rasa.botfront.local/webhooks/rest/webhook';
    var payload = JSON.stringify({
        sender: uid,
        message: 'hello',
    });

    var params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    for (var id = 1; id <= 9; id++) {
        let res = http.post(url, payload, params);
        // console.log(JSON.stringify(res))
        check(res, {
            'response ok': (r) => {
                return JSON.parse(r.body)[0].text === `${id}`;
            },
            // "response ok": r => console.log(r.body)
        });
        sleep(1);
    }
}
