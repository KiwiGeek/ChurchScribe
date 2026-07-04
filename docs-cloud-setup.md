# Cloud Console Changes for the New Sync Setup Wizard

The wizard adds a "main storage" option to Google Drive and OneDrive (storing the
workspace in a user-chosen folder instead of the hidden app folder). That requires
one new permission in each cloud console, plus an API key for Google's folder picker.

## Azure (OneDrive / OneNote app registration)

Portal: https://portal.azure.com → Microsoft Entra ID → App registrations → your
Scriptoria registration (client ID `60869d80-c4cb-4d64-a753-ddecd3bb2752`).

1. **API permissions → Add a permission → Microsoft Graph → Delegated permissions.**
2. Add **`Files.ReadWrite`**. Keep the existing `Files.ReadWrite.AppFolder` and
   `User.Read`.
3. Click **Add permissions**. No admin consent is required for personal Microsoft
   accounts — users see an incremental consent prompt the first time they choose
   the "folder in my OneDrive" option. Users who stay on the app folder are never
   asked for the wider scope (the code only requests `Files.ReadWrite` when
   `locationMode` is `mainStorage`).

Nothing else changes: redirect URIs, account types, and the SPA platform stay as
they are.

## Google Cloud Console (Google Drive)

Project hosting OAuth client `711830335817-2enpiqrmso0sqgq2fnh8o4ef4r60ede0`.

### 1. Add the drive.file scope

Console: https://console.cloud.google.com → APIs & Services → OAuth consent screen
(Data Access / Scopes section):

1. Click **Add or remove scopes**.
2. Add **`https://www.googleapis.com/auth/drive.file`** ("See, edit, create and
   delete only the specific Google Drive files that you use with this app").
3. Save.

`drive.file` is a **non-sensitive** scope — no verification review or CASA security
assessment is needed (unlike the full `drive` scope). The app requests it only when
the user chooses "A folder in My Drive"; app-folder users keep just `drive.appdata`.

### 2. Enable the Google Picker API

APIs & Services → Library → search **"Google Picker API"** → **Enable**.

The Picker is how users select (or create) the target Drive folder. It is the
mechanism that grants the app access to that folder under `drive.file` — the app
cannot browse the user's Drive by itself with that scope.

### 3. Create an API key for the Picker

APIs & Services → Credentials → **Create credentials → API key**, then restrict it:

- **API restrictions:** Google Picker API only.
- **Application restrictions:** HTTP referrers — add every origin the app is served
  from (e.g. `https://yoursite.example.com/*`, `http://localhost/*`).

### 4. Paste the key into the code

In `storage/gdrive.js`, set:

```js
const pickerApiKey = "YOUR_API_KEY_HERE";
```

Until this is set, the wizard's "Choose Folder…" button for Google Drive shows a
clear error explaining that the Picker isn't configured; the app-folder mode keeps
working regardless.

## Scope behaviour summary

| Provider | App folder mode | Main storage mode |
|---|---|---|
| Google Drive | `drive.appdata` | `drive.appdata` + `drive.file` (incremental consent) |
| OneDrive | `Files.ReadWrite.AppFolder`, `User.Read` | + `Files.ReadWrite` (incremental consent) |

Reconnects request the scope set matching the stored `locationMode`, so an existing
main-storage workspace silently reacquires the wider token on page load.
