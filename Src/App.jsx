
import { useMemo, useState } from "react";

const initialEvents = [
  {
    id: 1,
    name: "Birthday Celebration",
    category: "Birthday",
    price: 15000,
    emoji: "🎂",
    description: "Colorful decorations, cake table, balloons and party setup.",
  },
  {
    id: 2,
    name: "Haldi Ceremony",
    category: "Haldi",
    price: 25000,
    emoji: "🌼",
    description: "Traditional yellow floral decorations and a beautiful backdrop.",
  },
  {
    id: 3,
    name: "Wedding Celebration",
    category: "Marriage",
    price: 100000,
    emoji: "💍",
    description: "Elegant wedding stage, floral decor and guest seating.",
  },
  {
    id: 4,
    name: "Baby Shower",
    category: "Baby Shower",
    price: 20000,
    emoji: "🧸",
    description: "A sweet celebration with themed decorations and photo areas.",
  },
];

const categories = [
  { name: "Birthday", emoji: "🎂", text: "Make birthdays unforgettable." },
  { name: "Haldi", emoji: "🌼", text: "Celebrate beautiful traditions." },
  { name: "Marriage", emoji: "💍", text: "Create memories that last forever." },
  { name: "Baby Shower", emoji: "🧸", text: "Welcome a little bundle of joy." },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function EventCard({ event, onBook }) {
  return (
    <article className="event-card">
      <div className="event-art" aria-hidden="true">
        <span>{event.emoji || "🎉"}</span>
      </div>

      <div className="event-card-content">
        <span className="category-label">{event.category}</span>
        <h3>{event.name}</h3>
        <p>{event.description}</p>

        <div className="event-card-bottom">
          <div>
            <span className="price-caption">Starting from</span>
            <strong className="price">{money(event.price)}</strong>
          </div>

          <button
            className="button button-primary button-small"
            onClick={() => onBook(event)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [page, setPage] = useState("Home");
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("Birthday Celebration");
  const [bookingMessage, setBookingMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [booking, setBooking] = useState({
    name: "",
    date: "",
    guests: "50",
    category: "Birthday",
    email: "",
    phone: "",
  });
  const [custom, setCustom] = useState({
    name: "",
    category: "Birthday",
    price: "",
    description: "",
    emoji: "🎉",
  });

  const today = new Date().toLocaleDateString("en-CA");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) =>
      `${event.name} ${event.category} ${event.description}`
        .toLowerCase()
        .includes(query)
    );
  }, [events, search]);

  function goTo(nextPage) {
    setPage(nextPage);
    setBookingMessage("");
    setCustomMessage("");

    if (nextPage === "Events") {
      setSearch("");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bookEvent(event) {
    setSelectedEvent(event.name);
    setBooking((previous) => ({
      ...previous,
      category: event.category,
    }));
    setBookingMessage("");
    setPage("Book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBookingChange(event) {
    const { name, value } = event.target;

    setBooking((previous) => ({
      ...previous,
      [name]: value,
    }));

    setBookingMessage("");
  }

  function handleBookingSubmit(event) {
    event.preventDefault();

    if (
      !booking.name.trim() ||
      !booking.date ||
      !booking.guests ||
      !booking.category ||
      !booking.email.trim() ||
      !booking.phone.trim()
    ) {
      setBookingMessage("Please fill in all required fields.");
      return;
    }

    if (booking.date < today) {
      setBookingMessage("Please select today or a future event date.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
      setBookingMessage("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(booking.phone)) {
      setBookingMessage("Enter a valid 10-digit mobile number.");
      return;
    }

    if (
      !Number.isInteger(Number(booking.guests)) ||
      Number(booking.guests) < 1
    ) {
      setBookingMessage("Guest count must be at least 1.");
      return;
    }

    const request = {
      ...booking,
      event: selectedEvent,
      guests: Number(booking.guests),
    };

    // Demonstration only: this request is not saved to a database.
    console.log("Booking request:", request);

    setBookingMessage(
      `Booking request submitted successfully for ${selectedEvent}!`
    );

    setBooking({
      name: "",
      date: "",
      guests: "50",
      category: "Birthday",
      email: "",
      phone: "",
    });
  }

  function handleCustomChange(event) {
    const { name, value } = event.target;

    setCustom((previous) => ({
      ...previous,
      [name]: value,
    }));

    setCustomMessage("");
  }

  function handleCustomSubmit(event) {
    event.preventDefault();

    if (
      !custom.name.trim() ||
      !custom.category ||
      custom.price === "" ||
      !custom.description.trim()
    ) {
      setCustomMessage("Please complete all custom event fields.");
      return;
    }

    const price = Number(custom.price);

    if (!Number.isFinite(price) || price <= 0) {
      setCustomMessage("Please enter a price greater than zero.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      name: custom.name.trim(),
      category: custom.category,
      price,
      emoji: custom.emoji || "🎉",
      description: custom.description.trim(),
    };

    setEvents((previous) => [...previous, newEvent]);

    setCustomMessage(
      `"${newEvent.name}" has been added to the event catalog!`
    );

    setCustom({
      name: "",
      category: "Birthday",
      price: "",
      description: "",
      emoji: "🎉",
    });
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="nav-container">
          <button
            className="brand"
            onClick={() => goTo("Home")}
            aria-label="CelebrationCraft home"
          >
            <span className="brand-icon">✦</span>
            <span>Celebration<span className="brand-accent">Craft</span></span>
          </button>

          <nav className="navigation" aria-label="Main navigation">
            {["Home", "Events", "Book", "Create"].map((item) => (
              <button
                key={item}
                className={`nav-link ${page === item ? "active" : ""}`}
                onClick={() => goTo(item)}
              >
                {item === "Events"
                  ? "Events Catalog"
                  : item === "Book"
                    ? "Book Event"
                    : item === "Create"
                      ? "Create Event"
                      : "Home"}
              </button>
            ))}
          </nav>

          <button
            className="button button-primary header-button"
            onClick={() => goTo("Book")}
          >
            Plan Your Event
          </button>
        </div>
      </header>

      <main>
        {page === "Home" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">YOUR MOMENT, OUR MAGIC</span>
                <h1>
                  Every Celebration
                  <br />
                  Deserves to Be <span>Special.</span>
                </h1>
                <p>
                  From intimate birthdays to grand weddings, discover
                  celebration packages that turn your precious moments into
                  lifelong memories.
                </p>

                <div className="hero-actions">
                  <button
                    className="button button-primary"
                    onClick={() => goTo("Events")}
                  >
                    Explore Celebrations <span>→</span>
                  </button>

                  <button
                    className="button button-outline"
                    onClick={() => goTo("Create")}
                  >
                    Create Your Own
                  </button>
                </div>

                <div className="hero-note">
                  <span>✦</span> Thoughtfully planned. Beautifully celebrated.
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-circle">
                  <span className="hero-big-emoji">🎉</span>
                  <span className="floating floating-one">🎂</span>
                  <span className="floating floating-two">🌸</span>
                  <span className="floating floating-three">✨</span>
                </div>
                <div className="hero-caption">
                  <strong>Make it memorable</strong>
                  <span>Celebrate life's beautiful milestones</span>
                </div>
              </div>
            </section>

            <section className="section category-section">
              <div className="section-heading">
                <span className="eyebrow">FIND YOUR OCCASION</span>
                <h2>Moments Worth Celebrating</h2>
                <p>
                  Choose your celebration and discover a package made for you.
                </p>
              </div>

              <div className="category-grid">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="category-card"
                    onClick={() => {
                      setSearch(category.name);
                      setPage("Events");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <span className="category-emoji">{category.emoji}</span>
                    <h3>{category.name}</h3>
                    <p>{category.text}</p>
                    <span className="category-arrow">Explore packages →</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="home-cta">
              <span className="eyebrow">YOUR IDEA, YOUR WAY</span>
              <h2>Have a celebration in mind?</h2>
              <p>Create a custom event package that matches your vision.</p>
              <button
                className="button button-light"
                onClick={() => goTo("Create")}
              >
                Design Your Celebration →
              </button>
            </section>
          </>
        )}

        {page === "Events" && (
          <section className="section page-section">
            <div className="section-heading">
              <span className="eyebrow">OUR CELEBRATION COLLECTION</span>
              <h1>Explore Event Packages</h1>
              <p>Find the right celebration package for your special day.</p>
            </div>

            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search by event name or category..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search event packages"
              />
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  Clear
                </button>
              )}
            </div>

            <p className="results-count">
              {filteredEvents.length} package
              {filteredEvents.length === 1 ? "" : "s"} found
            </p>

            {filteredEvents.length > 0 ? (
              <div className="event-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onBook={bookEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>🔎</span>
                <h3>No packages found</h3>
                <p>Try another search or create your own celebration theme.</p>
                <button
                  className="button button-primary"
                  onClick={() => goTo("Create")}
                >
                  Create a Package
                </button>
              </div>
            )}

            <div className="catalog-footer">
              <p>Want something different? Design a custom package.</p>
              <button
                className="button button-outline"
                onClick={() => goTo("Create")}
              >
                Create Custom Event
              </button>
            </div>
          </section>
        )}

        {page === "Book" && (
          <section className="section page-section">
            <div className="section-heading">
              <span className="eyebrow">LET'S MAKE IT HAPPEN</span>
              <h1>Book Your Celebration</h1>
              <p>Share your details to submit your event booking request.</p>
            </div>

            <div className="form-layout">
              <div className="form-decoration">
                <span className="form-decoration-emoji">🎊</span>
                <h2>Your special day starts here.</h2>
                <p>
                  Tell us about your celebration, and take the first step
                  toward planning a memorable event.
                </p>
                <div className="form-decoration-note">
                  ✦ Every detail matters
                </div>
              </div>

              <form className="form-card" onSubmit={handleBookingSubmit}>
                <h2>Booking Details</h2>
                <p className="form-intro">Fields marked * are required.</p>

                <div className="form-group">
                  <label htmlFor="booking-name">Full Name *</label>
                  <input
                    id="booking-name"
                    name="name"
                    value={booking.name}
                    onChange={handleBookingChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="booking-email">Email Address *</label>
                  <input
                    id="booking-email"
                    name="email"
                    type="email"
                    value={booking.email}
                    onChange={handleBookingChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="booking-phone">Mobile Number *</label>
                  <input
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={booking.phone}
                    onChange={handleBookingChange}
                    placeholder="10-digit mobile number"
                    autoComplete="tel-national"
                    title="Enter exactly 10 digits"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="booking-category">Celebration Type *</label>
                  <select
                    id="booking-category"
                    name="category"
                    value={booking.category}
                    onChange={(event) => {
                      handleBookingChange(event);
                      const matchingEvent = events.find(
                        (item) => item.category === event.target.value
                      );
                      if (matchingEvent) {
                        setSelectedEvent(matchingEvent.name);
                      }
                    }}
                    required
                  >
                    {[
                      ...new Set(events.map((item) => item.category)),
                    ].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="booking-event">Package *</label>
                  <select
                    id="booking-event"
                    value={selectedEvent}
                    onChange={(event) => {
                      const chosen = events.find(
                        (item) => item.name === event.target.value
                      );
                      setSelectedEvent(event.target.value);
                      if (chosen) {
                        setBooking((previous) => ({
                          ...previous,
                          category: chosen.category,
                        }));
                      }
                      setBookingMessage("");
                    }}
                    required
                  >
                    {events.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name} — {money(item.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="booking-date">Event Date *</label>
                    <input
                      id="booking-date"
                      type="date"
                      name="date"
                      min={today}
                      value={booking.date}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="booking-guests">Guest Count *</label>
                    <input
                      id="booking-guests"
                      type="number"
                      name="guests"
                      min="1"
                      step="1"
                      value={booking.guests}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                </div>

                {bookingMessage && (
                  <div
                    className={`message ${
                      bookingMessage.includes("successfully")
                        ? "message-success"
                        : "message-error"
                    }`}
                    role="status"
                  >
                    {bookingMessage}
                  </div>
                )}

                <button className="button button-primary submit-button">
                  Submit Booking Request →
                </button>

                <p className="privacy-note">
                  Demo only: your booking is not permanently saved or sent.
                </p>
              </form>
            </div>
          </section>
        )}

        {page === "Create" && (
          <section className="section page-section">
            <div className="section-heading">
              <span className="eyebrow">BRING YOUR VISION TO LIFE</span>
              <h1>Create a Custom Event</h1>
              <p>
                Build your own celebration package and add it to the catalog.
              </p>
            </div>

            <div className="custom-layout">
              <form className="form-card custom-form" onSubmit={handleCustomSubmit}>
                <h2>Design Your Package</h2>
                <p className="form-intro">
                  Add the details of your new celebration theme.
                </p>

                <div className="form-group">
                  <label htmlFor="custom-name">Event Name *</label>
                  <input
                    id="custom-name"
                    name="name"
                    value={custom.name}
                    onChange={handleCustomChange}
                    placeholder="e.g. Garden Anniversary"
                    maxLength={70}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="custom-category">Category *</label>
                  <input
                    id="custom-category"
                    name="category"
                    list="category-options"
                    value={custom.category}
                    onChange={handleCustomChange}
                    placeholder="Choose or enter a category"
                    maxLength={40}
                    required
                  />
                  <datalist id="category-options">
                    {[
                      ...new Set([
                        ...categories.map((item) => item.name),
                        ...events.map((item) => item.category),
                        "Anniversary",
                        "Engagement",
                        "Corporate",
                        "Graduation",
                      ]),
                    ].map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label htmlFor="custom-price">Package Price (INR) *</label>
                  <input
                    id="custom-price"
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    value={custom.price}
                    onChange={handleCustomChange}
                    placeholder="Enter package price"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="custom-emoji">Package Icon</label>
                  <select
                    id="custom-emoji"
                    name="emoji"
                    value={custom.emoji}
                    onChange={handleCustomChange}
                  >
                    <option value="🎉">🎉 Celebration</option>
                    <option value="🎂">🎂 Birthday</option>
                    <option value="🌼">🌼 Traditional</option>
                    <option value="💍">💍 Wedding</option>
                    <option value="🧸">🧸 Baby Shower</option>
                    <option value="🌹">🌹 Romantic</option>
                    <option value="🎓">🎓 Graduation</option>
                    <option value="✨">✨ Special Event</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="custom-description">Description *</label>
                  <textarea
                    id="custom-description"
                    name="description"
                    value={custom.description}
                    onChange={handleCustomChange}
                    placeholder="Describe decorations, arrangements and services..."
                    rows="4"
                    maxLength={300}
                    required
                  />
                </div>

                {customMessage && (
                  <div
                    className={`message ${
                      customMessage.includes("added")
                        ? "message-success"
                        : "message-error"
                    }`}
                    role="status"
                  >
                    {customMessage}
                  </div>
                )}

                <button className="button button-primary submit-button">
                  + Add Custom Package
                </button>
              </form>

              <aside className="custom-preview">
                <span className="eyebrow">LIVE PREVIEW</span>
                <h2>Your package, your style.</h2>
                <p>
                  This is how your custom package will appear in the event
                  catalog.
                </p>

                <article className="event-card preview-card">
                  <div className="event-art">
                    <span>{custom.emoji || "🎉"}</span>
                  </div>
                  <div className="event-card-content">
                    <span className="category-label">
                      {custom.category || "Your Category"}
                    </span>
                    <h3>{custom.name || "Your Event Name"}</h3>
                    <p>
                      {custom.description ||
                        "Your package description will appear here."}
                    </p>
                    <div className="preview-price">
                      <span className="price-caption">Starting from</span>
                      <strong className="price">
                        {custom.price && Number(custom.price) > 0
                          ? money(Number(custom.price))
                          : "₹ —"}
                      </strong>
                    </div>
                  </div>
                </article>

                <div className="preview-tip">
                  <span>💡</span>
                  <p>
                    After you add the package, open the Events Catalog to find
                    it and book it.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <button className="footer-brand" onClick={() => goTo("Home")}>
          ✦ CelebrationCraft
        </button>
        <p>Making life's special moments unforgettable.</p>
        <div className="footer-links">
          <button onClick={() => goTo("Events")}>Explore Events</button>
          <button onClick={() => goTo("Book")}>Book a Celebration</button>
          <button onClick={() => goTo("Create")}>Create Your Own</button>
        </div>
        <span className="copyright">
          © {new Date().getFullYear()} CelebrationCraft. Student project demo.
        </span>
      </footer>
    </div>
  );
}

export default App;
