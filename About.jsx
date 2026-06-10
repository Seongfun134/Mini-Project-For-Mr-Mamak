export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-content">
        <h1 className="about-title">About Mr Mamak</h1>
        <p className="about-subtitle">
          Authentic Malaysian Mamak Cuisine — Tanjung Tokong, Penang
        </p>
        <div className="about-grid">
          <div className="about-card">
            <div className="about-card-icon">
              <img
                src="/images/plate.jpg"
                alt="Our Story"
                style={{ filter: "brightness(0)" }}
              />
            </div>
            <h3>Our Story</h3>
            <p>
              Mr Mamak has been serving authentic Malaysian mamak cuisine in
              Tanjung Tokong, Penang since 1998. Featured among the Top 50 Most
              Popular Michelin-Rated Mamak Restaurants in Malaysia, we pride
              ourselves on delivering the true taste of traditional mamak food.
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">
              <img
                src="/images/location.jpg"
                alt="Location"
                style={{ filter: "brightness(0)" }}
              />
            </div>
            <h3>Location</h3>
            <p>
              Tanjung Tokong, Penang, Malaysia
              <br />
              Open daily from <strong>7:00 AM – 11:00 PM</strong>
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">
              <img
                src="/images/groceries.jpg"
                alt="What We Offer"
                style={{ filter: "brightness(0)" }}
              />
            </div>
            <h3>What We Offer</h3>
            <p>
              From classic Roti Canai and Teh Tarik to hearty Nasi Kandar and
              Sup Kambing, our menu celebrates the rich flavours of Malaysian
              mamak culture — freshly prepared with the finest ingredients.
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">
              <img
                src="/images/call.jpg"
                alt="Contact Us"
                style={{ filter: "brightness(0)" }}
              />
            </div>
            <h3>Contact Us</h3>
            <p>
              Phone: +60 4-XXX XXXX
              <br />
              Email: hello@mrmamak.com.my
              <br />
              Instagram: @MrMamakPenang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
