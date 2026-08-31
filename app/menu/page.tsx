import Menu from "../components/Menu";
import FeaturedGallery from "../components/FeaturedGallery";
import { getMenu } from "../lib/getMenu";

export const metadata = {
  title: "Menu — Farm2Pot And Grill",
};

// Revalidate every 60 seconds so menu/price updates in Supabase show up
// without needing a full redeploy.
export const revalidate = 60;

export default async function MenuPage() {
  const data = await getMenu();

  return (
    <main>
      <FeaturedGallery data={data} />
      <Menu data={data} />
    </main>
  );
}
