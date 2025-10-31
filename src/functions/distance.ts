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
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzYxMTQwMTEwIiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6IjMyZmZjODE0ZDg2YTRlZTk5MWRlMDI4N2IwOWM1NDE4In0.PfPZECjxQs8da-9sJ3gA6PPeYZOcpkAUu-5JPVJ8Suc",
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
    return {
      distance: data.route.car.distance.toFixed(1),
      duration: Math.round(data.route.car.duration / 60),
    };
  } catch (err) {
    console.error("Erro no calculo de distancia:", err);
  }
}
