# Prof. Stelands Stochastik-Abenteuer

Ein browserbasiertes Pixel-Art Lernspiel für die Vorlesung Einführung in die angewante Stochastik an der RWTH Aachen.

---
## 
![DemoBild](DemoBild.jpg)
## Hinweis

Der in diesem Spiel dargestellte Professor Steland ist eine fiktive Figur. Die reale Person Professor Dr. Steland an der RWTH Aachen ist nicht verantwortlich für dessen Inhalte.

---

## Was ist das?

Ein kleines Lernspiel, in dem du als Pixel-Charakter den RWTH-Campus erkundest. In den verschiedenen Gebäuden kannst du Quiz-Fragen zu den Stochastik-Vorlesungen beantworten, Coins verdienen und diese im Casino verzocken oder für neue Skins ausgeben.

## Bushof Update
Votet mich hoch für das ULTIMATIVE BUSHOF Update!!!

## Starten

### Einfachste Methode: Doppelklick

Einfach die `index.html` im `files`-Ordner doppelklicken — das Spiel öffnet sich direkt im Browser. Funktioniert in Firefox und Safari problemlos.

> **Chrome:** Falls die Hintergrundmusik in der Ponte nicht abgespielt wird, liegt das an Chromes lokalen Dateirichtlinien. Entweder Firefox nutzen oder den lokalen Server unten verwenden.

### Alternativ: Lokaler Webserver (Python)

Terminal öffnen, in den `files`-Ordner navigieren und ausführen:

```
python3 -m http.server 8080
```

Dann im Browser `http://localhost:8080` aufrufen.

### Oder: VS Code Live Server

Erweiterung **Live Server** installieren, dann `index.html` mit Rechtsklick → *Open with Live Server* öffnen.

---

## Steuerung

| Taste | Aktion |
|---|---|
| Pfeiltasten / WASD | Laufen |
| Enter / Leertaste | Gebäude betreten / Quiz bestätigen |
| Escape | Zurück / Schließen |

---

## Technik

- Reines Vanilla JavaScript, kein Framework
- Canvas-basiertes Pixel-Art Rendering
- Alle Quizfragen basieren auf den offiziellen Vorlesungsfolien 
- Blackjack mit 6-Deck-Schuh und Basic Strategy Advisor



