import myImage from "../assets/download (53).png";
import myImage2 from "../assets/download (55).png";
import myImage3 from "../assets/download (56).png";
//Homepage is the teacher setCurrentView is map give you website detail and direction , current user to kyc
export default function HomePage({ setCurrentView, currentUser }) {
  return (
    <div
      className="background"
      style={{ backgroundImage: `url("${myImage3}")` }}
    >
      <div className="Canai">
        <div className="Introduction">
          <h2>Welcome to Mr Mamak</h2>
          <p>
            "The Top 50 Most Popular Michelin-Rated Mamak Restaurants In
            Malaysia, <br /> Specially Featured In Tanjung Tokong Penang"
          </p>
          <div className="btn">
            <button id="Order" onClick={() => setCurrentView("menu")}>
              Click To Order
            </button>
          </div>
        </div>
        <div className="Roti-canai">
          <img src={myImage2} alt="Roti Canai" />
        </div>
      </div>
    </div>
  );
}
