import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const PHONES = new SharedArray("phones", function () {
  return Array.from({ length: 100 }, (_, i) =>
    `071${String(i).padStart(4, "0")}000`,
  );
});

export const options = {
  stages: [
    { duration: "30s", target: 500 },
    { duration: "30s", target: 1000 },
    { duration: "30s", target: 2000 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  const phone = PHONES[Math.floor(Math.random() * PHONES.length)];
  const amount = [500, 1000, 2500, 5000, 10000][
    Math.floor(Math.random() * 5)
  ];

  const payload = JSON.stringify({
    amount,
    phone,
    donor_name: "Load Test Donor",
    message: "Test gift",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    `${__ENV.BASE_URL || "http://localhost:3000"}/api/mpesa/stkpush`,
    payload,
    params,
  );

  check(res, {
    "status is 200 or 429": (r) => r.status === 200 || r.status === 429,
    "response has success field": (r) => r.json().success !== undefined,
  });

  sleep(0.5);
}
