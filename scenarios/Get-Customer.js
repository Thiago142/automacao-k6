import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter} from "k6/metrics";
import { check, fail } from "k6";

export let GetCustomerDuration = new Trend('get_customer_duration');
export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Trend('get_customer_success_rate');
export let GetCustomerReqs = new Trend('get_customer_reqs');

export default function (){
    let res = http.get('https://localhost:5001/api/Customer/GetCustomer?id=1');

    GetCustomerDuration.add(res.timings.duration);
    GetCustomerReqs.add(1);
    GetCustomerFailRate.add(res.status == 0 || res.status > 399);
    GetCustomerSuccessRate.add(res.status < 399);

    let durationMsg = 'Max Duration ${4000/1000}s';
    if(!check(res, {
        'max duration': (r) =>  r.timings.duration < 4000,
    })){
        fail(durationMsg);
    }

    sleep(1);

}