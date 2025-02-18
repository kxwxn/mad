export default function CartModal({ isOpen, onClose, cartItems }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">CART ({cartItems.length})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            [X CLOSE]
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover"
            />
            <div className="flex-1">
              <div className="font-medium">{item.brand}</div>
              <div className="text-sm">{item.name}</div>
              <div className="text-sm">₩{item.price.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="flex justify-between mb-4">
          <span>TOTAL</span>
          <span>
            ₩
            {cartItems
              .reduce((sum, item) => sum + item.price, 0)
              .toLocaleString()}
          </span>
        </div>
        <button className="w-full bg-black text-white py-3 hover:bg-gray-800">
          CHECKOUT
        </button>
      </div>
    </div>
  );
}
