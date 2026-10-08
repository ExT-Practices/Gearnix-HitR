import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state;


  if (!order) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center">

        <h1 className="text-2xl font-bold mb-4">
          Order information not found
        </h1>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>
    );

  }


  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="bg-white rounded-xl shadow-sm p-10 text-center max-w-md w-full">

        <div className="text-5xl mb-5">
          ✅
        </div>


        <h1 className="text-3xl font-bold mb-3">
          Order Placed!
        </h1>


        <p className="text-gray-500 mb-6">
          Thank you for your purchase.
        </p>


        <div className="bg-gray-50 rounded-lg p-4 mb-6">

          <p className="text-sm text-gray-500">
            Order Number
          </p>

          <p className="font-bold text-lg">
            {order.order_number}
          </p>


          <p className="text-sm text-gray-500 mt-3">
            Total Amount
          </p>

          <p className="font-bold text-lg">
            ₹{Number(order.total_amount).toFixed(2)}
          </p>

        </div>


        <button
          onClick={() => navigate("/products")}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>

    </div>

  );

};

export default OrderSuccess;