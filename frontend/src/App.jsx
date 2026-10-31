import { useState, useEffect } from "react";
import {
  Heart,
  Users,
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL || "https://dukundekiliziyaubutumire.onrender.com"}/api`;

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchGuests = async () => {
    try {
      const res = await fetch(`${API_BASE}/guests`);
      const data = await res.json();
      setGuests(data);
    } catch (error) {
      console.error("Failed to fetch guests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const submitGuest = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add guest");
      }

      setName("");
      setPhone("");
      fetchGuests();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-background">
      <section className="relative min-h-[35svh] bg-foreground" style={{ background: '#006400' }}>
        <div className="absolute inset-0 bg-veil" />
        <div className="relative z-10 flex min-h-[35svh] flex-col items-center justify-center px-6 pb-6 pt-6 text-center text-white">
          <div className="animate-reveal max-w-3xl" style={{ animationDelay: "150ms" }}>
            <h1 className="font-display text-4xl leading-[1.06] sm:text-5xl md:text-6xl">
              DUKUNDE KILIZIYA
            </h1>
            <p className="mt-4 max-w-xl text-xs leading-5 sm:text-sm">
              Kwizihiza Yubile y'imyaka 80 ishize U Rwanda rutuwe Kristu Umwami bizaba taliki 22/11/2026
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6" style={{ background: '#8B0000' }}>
        <div className="mx-auto max-w-lg text-center">
          <Heart className="mx-auto mb-3 size-5 fill-white text-white" />
          <h2 className="font-display text-3xl text-white">Muzifatanya natwe?</h2>
          <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-white">
            Twakwishimira kubana namwe. Andika amazina yawe yose nimero ya telefone hano.
          </p>

          <form className="mt-6 space-y-3" onSubmit={submitGuest}>
            <label htmlFor="guest-name" className="block text-left text-xs font-medium text-white">
              Amazina yawe yose
            </label>

            <input
              id="guest-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoComplete="name"
              placeholder="KANDA HANO"
              className="input h-10 rounded-full bg-card px-4 text-sm"
              aria-describedby="form-message"
            />

            <label htmlFor="guest-phone" className="block text-left text-xs font-medium mt-2 text-white">
              Nimero ya telefone iri kuri whatsapp
            </label>

            <input
              id="guest-phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
              autoComplete="tel"
              placeholder="KANDA HANO"
              className="input h-10 rounded-full bg-card px-4 text-sm"
            />

            {message && <p id="form-message" role="alert" className="text-xs text-primary">{message}</p>}

            <button
              type="submit"
              className="w-full text-xs uppercase tracking-[0.15em] py-2 px-4"
              style={{ backgroundColor: '#006400', color: 'white', borderRadius: '8px' }}
              disabled={submitting || !name.trim() || !phone.trim()}
            >
              Ohereza
            </button>
          </form>
        </div>
      </section>

      <section id="guest-list" className="bg-secondary px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Users className="mx-auto mb-3 text-primary" size={24} />
            <h2 className="font-display text-3xl">Urutonde</h2>
            <div className="mx-auto my-4 h-px w-12 bg-primary" />
            <p className="font-display text-4xl text-primary">{guests.length}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]">Abemeje</p>
          </div>
          {guests.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      #
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Amazina
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Nimero ya telefone iri kuri whatsapp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, index) => (
                    <tr
                      key={guest.id}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-2">
                        <span className="font-display text-xs font-semibold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs font-medium text-primary">{guest.name}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs font-medium text-primary">{guest.phone}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-6 text-center text-xs italic text-muted-foreground">Ba uwa mbere kwemeza</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;