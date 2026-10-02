import Menu from "../components/Menu";
import { getMenu } from "../lib/getMenu";

export const metadata = {
  title: "Menu",
  description:
    "Browse Farm2Pot And Grill's full menu of Nigerian soups, rice, grills, pepper soups, fresh juices and cocktails. Order online for pickup or delivery in Ajah, Lagos.",
};

// Revalidate every 60 seconds so menu/price updates in Supabase show up
// without needing a full redeploy.
export const revalidate = 60;

export default async function MenuPage() {
  const data = await getMenu();

  return (
    <main>
      <Menu data={data} />
    </main>
  );
}