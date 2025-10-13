interface waypoint {
  lng1: string;
  lat1: string;
  lng2: string;
  lat2: string;
}

export default async function calculateDistance({
  lng1,
  lat1,
  lng2,
  lat2,
}: waypoint) {
  fetch("https://api.distance.tools/api/v2/distance/route?car=true", {
    method: "POST",
    headers: {
      "X-Billing-Token":
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzU4MTA5Mzk3IiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6ImMzYjc0YmFhZTRjYTQ2MGE5N2M2ZTRlN2JlOTI5ZTMzIn0.BC8WTFaw3JDRQMZxHI5yxsUXg9xReSDdTurkAnN2Mi8",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: [
        {
          name: `${lat1},${lng1}`,
        },
        {
          name: `${lat2},${lng2}`,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((body) => {
      console.log(body.route.car);
      console.log(`${body.route.car.distance.toFixed(2)}Km`);
      console.log(`${Math.round(body.route.car.duration / 60)} min`);
    })
    .catch((err) => console.error(err));
}
