import ShopContainer from "@/components/shop/ShopContainer/ShopContainer";
import ShopNav from '@/components/ShopNav';

export default function Shop() {
  return (
    <>
      <ShopNav />
      <main className="container mx-auto px-4 py-8">
        <ShopContainer />
      </main>
    </>
  );
}
