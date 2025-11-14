interface waypoint {
  lat1: string;
  lng1: string;
  lat2: string;
  lng2: string;
}

export default async function calculateDistance({
  lat1,
  lng1,
  lat2,
  lng2,
}: waypoint) {
  try {
    const response = await fetch(
      "https://api.distance.tools/api/v2/distance/route?car=true",
      {
        method: "POST",
        headers: {
          "X-Billing-Token":
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzYzMTQxMjYxIiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6ImM1ZTQ0NWQ2NjkwNzQzZTViYmZlMDQ4MjE3NGQ0NGY1In0.daex-4lsZiPSYe4lii7fBceA3oP08W9PS32f1C0yS2E",
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
      }
    );
    const data = await response.json();

    console.log(data);

    return {
      distance: data.route.car.distance.toFixed(1),
      duration: Math.round(data.route.car.duration / 60),
    };
  } catch (err) {
    console.error("Erro no calculo de distancia:", err);
  }
}
