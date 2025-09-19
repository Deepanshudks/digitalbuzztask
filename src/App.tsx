import "./App.css";
import ChartWidget from "./components/ChartWidget";
import { DateTimePicker } from "./components/DateTimePicker";
import { MultiDocumentUpload } from "./components/MultiDocumentUpload";
import { MultiSelectDropdown } from "./components/MultiSelectDropdown";
import { NotificationButton } from "./components/Notification";
import { type OptionType, type DocumentType } from "./mocks";

import { useState } from "react";

function App() {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [docs, setDocs] = useState<DocumentType[]>([]);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((err) => console.log("Service Worker registration failed:", err));
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-8 bg-zinc-50 sm:grid-cols-2 md:grid-cols-3">
        <DateTimePicker />
        <MultiSelectDropdown
          value={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <NotificationButton />
      </div>
      <div className="grid gap-3  py-8 bg-zinc-50 sm:grid-cols-2 grid-cols-1">
        <ChartWidget />
        <MultiDocumentUpload value={docs} onChange={setDocs} />
      </div>
    </>
  );
}

export default App;
