# Mau-Mau Manager

Eine browserbasierte Verwaltung für eure Mau-Mau-Spielrunden im modernen
Apple-Look. Läuft komplett client-seitig (kein Server, kein Build).

**Geteilte Daten über mehrere Geräte/Personen** gibt es nur in der
Claude-Artifact-Version dieser App (dort synchronisiert jedes Speichern
automatisch zu allen offenen Ansichten). Diese `index.html` hier – lokal
geöffnet oder z. B. über GitHub Pages gehostet – speichert dagegen nur
lokal im jeweiligen Browser (`localStorage`); mehrere Geräte sehen dabei
**nicht** dieselben Daten. Die App erkennt selbst, ob sie innerhalb von
claude.ai läuft, und schaltet den Sync-Teil automatisch an/aus.

`index.html` einfach im Browser öffnen, um loszulegen.

## Funktionen

### Spieler
- Einzelspieler mit Vorname und Nachname anlegen, bearbeiten und löschen.
- Automatische Avatar-Farbe (frei wählbar aus einer Apple-Systemfarben-Palette).

### Spieltage
- Jeder Spieltag/jede Spielrunde wird mit **Datum und Uhrzeit** erfasst
  (Vorbelegung: jetzt), optional mit einer Notiz (z. B. Ort/Anlass).
- Pro Spieltag werden die **Punkte je Spieler** erfasst – Spieler können pro
  Spieltag ein- oder ausgeschlossen werden (z. B. wenn jemand nicht dabei war).
- Optional können pro Spieler und Spieltag **Mau-Verstöße** über einen
  Stepper erfasst werden. Diese werden über alle Spieltage aufaddiert und in
  der Statistik ausgewiesen.
- Spieltage lassen sich nachträglich bearbeiten oder löschen und sind in
  einer aufklappbaren Liste (neueste zuerst) einsehbar.

### Rangliste
- Automatisch aufsummierte Gesamtpunktzahl je Spieler über alle Spieltage.
- Podium für die besten drei Spieler plus vollständige Rangliste
  (Spieltage, Durchschnitt, Siege, Mau-Verstöße).
- Wertungsrichtung („wenigste Punkte gewinnt“ / „meiste Punkte gewinnt“)
  ist im Regelwerk einstellbar – klassisches Mau-Mau wertet Strafpunkte,
  daher gewinnt standardmäßig, wer die **wenigsten** Punkte hat.

### Statistik
- Detailauswertung pro Spieler: Gesamtpunkte, Anzahl Spieltage,
  Durchschnitt, Siege, Mau-Verstöße, beste Runde sowie Punkteverlauf über
  die Zeit.
- Vergleichsansicht über alle Spieler: Gesamtpunkte- und
  Mau-Verstöße-Ranking als Balkendiagramme.

### Regelwerk
- Individuelles Regelwerk über ein eigenes Menü verwaltbar – frei benennbar
  (Standard: **„GriKlö“**).
- Wertungsrichtung und optionale Strafpunkte je Mau-Verstoß (werden bei
  Bedarf automatisch in die Gesamtpunktzahl eingerechnet) einstellbar.
- Frei editierbare Liste einzelner Regeln, standardmäßig vorbelegt mit:
  1. Bube auf Bube auflegen ist grundsätzlich nicht erlaubt.
  2. Es ist immer eine passende Karte in der ausliegenden Farbe auszuspielen
     – oder ein weiteres Ass mit direkter Folgekarte in der Farbe.
     Andernfalls ist eine Karte zu ziehen.
  3. Auf eine Acht kann eine weitere Acht gelegt werden.
- Regeln können ergänzt, umformuliert oder entfernt werden – alle Änderungen
  werden automatisch gespeichert.

## Technik

- Eine einzelne selbstständige `index.html` – kein Build, keine externen
  Abhängigkeiten (Schriftart: reiner Systemfont-Stack `-apple-system` /
  `SF Pro`, dadurch echtes Apple-Rendering auf macOS/iOS und sinnvolle
  Fallbacks auf anderen Systemen).
- Zustand (Spieler, Spieltage, Regelwerk) wird zusätzlich in `localStorage`
  gehalten und bleibt bei einem erneuten Besuch erhalten (Offline-Fallback,
  bzw. einziger Speicherort außerhalb von claude.ai).
- Hell-/Dunkelmodus folgen automatisch der Systemeinstellung; über den
  Icon-Button oben rechts lässt sich auch manuell zwischen Hell, Dunkel und
  System umgeschaltet werden.
- Reines Vanilla JavaScript (kein Framework), responsives Layout für
  Desktop und Mobile.

## Lokal starten

Kein Server nötig – einfach `index.html` im Browser öffnen:

```bash
open index.html   # macOS
# oder: xdg-open index.html (Linux) / doppelklicken
```
