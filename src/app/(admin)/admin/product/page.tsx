import ProductList from "@/components/shop/ProductList/ProductList";
import AddProductButton from "@/components/admin/AddProductButton/AddProductButton";

export default function ProductAdminPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <AddProductButton />
      <ProductList />
    </div>
  );
}
