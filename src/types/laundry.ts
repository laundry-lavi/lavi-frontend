export interface Laundry {
  id: number;
  name: string;
  type: "doméstica" | "industrial";
  grade: number;
  img: string;
  distance: number;
}

export const laundrys: Laundry[] = [
  {
    id: 1,
    name: "Lavanderia Lava-Rápido",
    type: "doméstica",
    grade: 4.5,
    img: "#4A90E2",
    distance: 8,
  },
  {
    id: 2,
    name: "Industrial Clean",
    type: "industrial",
    grade: 4.8,
    img: "#F5A623",
    distance: 22,
  },
  {
    id: 3,
    name: "Lava & Leva Perto de Casa",
    type: "doméstica",
    grade: 4.2,
    img: "#50E3C2",
    distance: 5,
  },
  {
    id: 4,
    name: "Mega Lavagem Industrial",
    type: "industrial",
    grade: 4.9,
    img: "#D0021B",
    distance: 18,
  },
  {
    id: 5,
    name: "Sua Roupa Limpa",
    type: "doméstica",
    grade: 4.0,
    img: "#BD10E0",
    distance: 12,
  },
];
