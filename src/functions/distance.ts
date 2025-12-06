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
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzY0OTkxNzE2IiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6IjQ5ODJlZjM1ODVkMTQwMmFhOTVjMGVmN2Y4OWUzNjA0In0.ucTWbMCdLHr25wmO63RBd-wfVj7vF-O1c0LdNTDH3nY",
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

    console.log(data.route.car);

    return {
      distance: data.route.car.distance.toFixed(1),
      duration: Math.round(data.route.car.duration / 60),
    };
  } catch (err) {
    console.error("Erro no calculo de distancia:", err);
  }
}
