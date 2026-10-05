import { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  ChevronDown,
  Church,
  Clock3,
  Heart,
  MapPin,
  UsersRound,
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api`;

function App() {
  const attendanceRef = useRef(null);
  const [name, setName] = useState("");
  const [confirmedName, setConfirmedName] = useState("");
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

  const goToAttendance = () => {
    attendanceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitGuest = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add guest");
      }

      setConfirmedName(data.name);
      setName("");
      fetchGuests();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToGuestList = () => {
    document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="overflow-hidden bg-background">
      <section className="relative min-h-[92svh] bg-foreground">
        <img
          src="/hero-bg.jpg"
          alt="Tereza na Michel"
          className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
        />
        <div className="absolute inset-0 bg-veil" />
        <div className="relative z-10 flex min-h-[92svh] flex-col items-center justify-center px-6 pb-9 pt-8 text-center text-primary-foreground">
          <div className="mb-12">
            
            <div className="mt-4 h-px w-16 bg-gold-soft" />
          </div>
          <div className="animate-reveal max-w-3xl" style={{ animationDelay: "150ms" }}>
            <h1 className="font-display text-5xl leading-[1.06] sm:text-7xl md:text-8xl">
              Tereza <span className="block py-2 text-3xl text-gold-soft sm:text-4xl">&</span> Michel
            </h1>
            <p className="animate-reveal text-lg font-medium uppercase tracking-[0.2em] leading-relaxed text-gold-soft">
              Umuryango wa Ntidendereza Faustin n'Umuryango wa Singirunkunda Philippe
            </p>
            <p className="mt-6 max-w-xl text-sm leading-6 sm:text-base">
              Unejejwe no kubatumira mu gushyigikira abana babo bazahana isakramentu ry'ugushyingirwa
            </p>
          </div>
          <button
            onClick={goToAttendance}
            className="btn btn-invitation mt-12 h-12 px-7 text-xs uppercase tracking-[0.18em]"
          >
            <Heart className="fill-current" /> Tuzifatanya
          </button>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Bika itariki</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">7 Ugushyingo 2026</h2>
          <p className="mt-2 text-muted-foreground">Ku wa 07/11/2026</p>
          <div className="mx-auto my-12 grid max-w-xl gap-8 sm:grid-cols-2">
            <EventDetail icon={UsersRound} time="9:00 AM" title="Gusaba no gukwa" place="Centre Urumuri, Remera" />
            <EventDetail icon={Church} time="3:00 PM" title="Isakaramentu ryo gushyingirwa" place="Christus Chapel, Remera" />
          </div>
          <p className="mx-auto max-w-xl font-display text-2xl leading-relaxed text-primary">"Kuza kwanyu bizadushimisha."</p>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
            "Amaso y'Uwiteka ahora ayahanze abamukunda, akababera umurinzi ukomeye n'inkingi itajegajega."
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mwene Siraki 34:16</p>
        </div>
      </section>

      <section ref={attendanceRef} className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-lg text-center">
          <Heart className="mx-auto mb-5 size-7 fill-primary text-primary" />
          <h2 className="font-display text-4xl">Muzifatanya natwe?</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted-foreground">
            Twakwishimira kubana namwe. Andika amazina yawe yose hano.
          </p>

          {confirmedName ? (
            <div className="relative mt-10 animate-reveal overflow-hidden border-y border-border py-10">
              {[0, 1, 2, 3, 4].map((item) => (
                <Heart
                  key={item}
                  className="animate-heart absolute bottom-0 size-4 text-primary opacity-0"
                  style={{ left: `${12 + item * 19}%`, animationDelay: `${item * 0.35}s` }}
                />
              ))}
              <p className="font-display text-3xl">Murakoze, {confirmedName} ❤️</p>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Amazina yawe yongewe ku rutonde rw'abazitabira ubukwe.
              </p>
              <button
                className="btn btn-outline mt-7 rounded-full"
                onClick={scrollToGuestList}
              >
                Reba urutonde <ChevronDown className="size-4" />
              </button>
            </div>
          ) : (
            <form className="mt-9 space-y-4" onSubmit={submitGuest}>
              <label htmlFor="guest-name" className="block text-left text-sm font-medium">
                Amazina yawe yose
              </label>
              <input
                id="guest-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoComplete="name"
                placeholder="Andika amazina yawe"
                className="input h-14 rounded-full bg-card px-6 text-base"
                aria-describedby="form-message"
              />
              {message && <p id="form-message" role="alert" className="text-sm text-primary">{message}</p>}
              <button
                type="submit"
                className="btn btn-invitation btn-lg w-full text-sm uppercase tracking-[0.15em]"
                disabled={submitting || !name.trim()}
              >
                <Heart className="fill-current" /> Tuzifatanya
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="guest-list" className="bg-secondary px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <UsersRound className="mx-auto mb-4 text-primary" size={32} />
            <h2 className="font-display text-4xl">Urutonde rw'abazitabira ubukwe</h2>
            <div className="mx-auto my-8 h-px w-16 bg-primary" />
            <p className="font-display text-6xl text-primary">{guests.length}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em]">Abemeje</p>
          </div>
          {guests.length > 0 ? (
            <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amazina
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, index) => (
                    <tr
                      key={guest.id}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <span className="font-display text-sm font-semibold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-primary">{guest.name}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-10 text-center text-sm italic text-muted-foreground">Ba uwa mbere kwemeza</p>
          )}
        </div>
      </section>

      <footer className="px-6 py-12 text-center">
        <p className="font-display text-3xl">Tereza & Michel</p>
        <div className="mx-auto my-5 flex w-fit items-center gap-3 text-primary">
          <CalendarDays className="size-4" />
          <span className="h-px w-8 bg-primary" />
          <MapPin className="size-4" />
          <span className="h-px w-8 bg-primary" />
          <Clock3 className="size-4" />
        </div>
        <p className="text-xs text-muted-foreground">07 · 11 · 2026 — Remera</p>
      </footer>
    </main>
  );
}

function EventDetail({ icon: Icon, time, title, place }) {
  return (
    <article className="text-center">
      <Icon className="mx-auto mb-4 size-6 text-primary" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{time}</p>
      <h3 className="mt-2 font-display text-2xl">{title}</h3>
      <p className="mt-3 text-sm">{place}</p>
    </article>
  );
}

export default App;