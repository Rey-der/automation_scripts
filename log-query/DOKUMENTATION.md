# Log Query — DORA-Konforme Dokumentation

**Dokumenten-ID:** AUT-LQ-001
**Version:** 1.0
**Erstellt:** 2026-03-15
**Klassifikation:** Intern — Betriebsdokumentation
**Verantwortlich:** IT-Automatisierung

---

## 1. Zweck und Geltungsbereich

Dieses Skript zeigt die **letzten Automatisierungslog-Einträge** aus der zentralen Datenbank an. Es dient der operativen Überwachung automatisierter Prozesse und bildet eine Grundlage für Audit-Anforderungen.

### Regulatorischer Bezug (DORA)
- **Art. 10 (Erkennung anomaler Aktivitäten):** Einsicht in aktuelle Automatisierungsprotokolle
- **Art. 11 (IKT-Risikomanagement):** Nachvollziehbarkeit und Transparenz der Automatisierung
- **Art. 15 (Berichtswesen):** Log-Daten für IKT-Berichte und Audits
- **Art. 19 (Meldung von Vorfällen):** Log-Einträge als Grundlage für Vorfallberichte

---

## 2. Funktionsbeschreibung

| Eigenschaft | Wert |
|---|---|
| **Skriptname** | `log-query` |
| **Sprachen** | JavaScript (Node.js), C# (.NET) |
| **Typ** | Lesend (Read-Only) |
| **Einstiegspunkt JS** | `main.js` |
| **Einstiegspunkt C#** | `csharp/Program.cs` |
| **Ausgabeformat** | JSON via `stdout` |

### Ablauf
1. Umgebungsvariable `SMART_DESKTOP_DB` wird geprüft
2. Optionaler Limit-Parameter wird ausgelesen (Standard: 20)
3. Tabelle `automation_logs` wird absteigend nach Zeitstempel abgefragt
4. Ergebnis wird als JSON-Array ausgegeben

---

## 3. Ein- und Ausgabedaten

### Eingabe
| Parameter | Quelle | Pflicht | Standard | Beschreibung |
|---|---|---|---|---|
| `SMART_DESKTOP_DB` | Umgebungsvariable | Ja | — | Absoluter Pfad zur SQLite-Datenbank |
| Argument 1 | CLI-Argument | Nein | `20` | Maximale Anzahl anzuzeigender Einträge |

### Ausgabe (JSON-Felder)
| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | Integer | Primärschlüssel |
| `script` | String | Name des protokollierenden Skripts |
| `level` | String | Log-Level (`INFO`, `ERROR`, `SUCCESS`) |
| `message` | String | Log-Nachricht |
| `details` | String / null | Zusätzliche Details (JSON) |
| `timestamp` | String (ISO 8601) | Zeitpunkt des Logeintrags |

---

## 4. Datenbankzugriffe

| Tabelle | Zugriffsart | Beschreibung |
|---|---|---|
| `automation_logs` | SELECT | Letzte N Einträge, absteigend nach Zeitstempel |

**Schreibzugriffe:** Keine.

---

## 5. Fehlerbehandlung

| Fehlerbedingung | Verhalten | Exit-Code |
|---|---|---|
| `SMART_DESKTOP_DB` nicht gesetzt | Fehlermeldung, Abbruch | 1 |
| Keine Log-Einträge vorhanden | Hinweistext | 0 |

---

## 6. Sicherheitsaspekte

- **Keine Schreiboperationen**
- **Keine Netzwerkkommunikation**
- **Log-Nachrichten** können betriebsinterne Informationen enthalten — Zugriff beschränken
- **Parametrisierte SQL-Abfragen:** Kein SQL-Injection-Risiko

---

## 7. Abhängigkeiten

| Komponente | Version | Zweck |
|---|---|---|
| Node.js | ≥ 18.x | Runtime (JS-Variante) |
| .NET SDK | ≥ 8.0 | Runtime (C#-Variante) |
| `better-sqlite3` | via smart_desktop_sql | Datenbankzugriff (JS) |
| `Microsoft.Data.Sqlite` | NuGet | Datenbankzugriff (C#) |

---

## 8. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---|---|---|---|
| 1.0 | 2026-03-15 | IT-Automatisierung | Erstdokumentation inkl. C#-Variante |
