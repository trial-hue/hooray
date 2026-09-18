"use client";

import { useFormStatus } from "react-dom";
import { addContactAction } from "@/app/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Adding and drafting…" : "Add"}
    </button>
  );
}

export function AddContactForm() {
  return (
    <form action={addContactAction} className="mt-3 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr]">
        <div>
          <label className="label">First name</label>
          <input name="firstName" className="input" placeholder="Meera" required />
        </div>
        <div>
          <label className="label">Last name</label>
          <input name="lastName" className="input" placeholder="Devon" />
        </div>
        <div>
          <label className="label">Birthday</label>
          <input name="birthday" className="input" placeholder="30 Sep → 09-30, or 1961-09-30" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
        <div>
          <label className="label">Who they are to you</label>
          <input name="relationship" className="input" placeholder="my mum" />
        </div>
        <div>
          <label className="label">One line about them</label>
          <input name="fact" className="input" placeholder="Just took up watercolours and is better than she admits" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label className="label">Address</label>
          <input name="line1" className="input" placeholder="18 Orchard Close" />
        </div>
        <div>
          <label className="label">Town</label>
          <input name="town" className="input" placeholder="Harrow" />
        </div>
        <div>
          <label className="label">Postcode</label>
          <input name="postcode" className="input" placeholder="HA1 3QT" />
        </div>
      </div>
      <div>
        <Submit />
      </div>
    </form>
  );
}
