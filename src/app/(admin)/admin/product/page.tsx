import ProductList from "@/components/shop/ProductList/ProductList";
import AddProductButton from "@/components/admin/AddProductButton/AddProductButton";

export default function ProductAdminPage() {
  return (
    <div style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
      <AddProductButton />
      <ProductList />
    </div>
  );
}
