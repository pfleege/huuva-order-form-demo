import Searchbar from "@/components/Searchbar";
import ActiveOrders from "@/components/OrderSearch";
import NewOrder from "@/components/NewOrder";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="font-Raleway text-4xl text-center">
      <h2>Home</h2>
      <p className="font-Geist text-base italic">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus quia
        ducimus illo eum neque voluptas error architecto libero, facere tempore!
      </p>
      <Dashboard />
      <NewOrder />
      <Searchbar />
      <ActiveOrders />
    </div>
  );
}
