import ChampionPage from "@/features/champions/page";
import DashboardPage from "@/features/dashboard/page";
import SettingsPage from "@/features/settings/page";
import { createHashRouter } from "react-router";
import RootLayout from "./layouts/root-layout";

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "champions",
        element: <ChampionPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
