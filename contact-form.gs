// ---------------------------------------------------------------------------
// Google Apps Script — backend formularza kontaktowego Alvernia Planet.
// Odbiera POST (application/x-www-form-urlencoded) z /kontakt i wysyła e-mail
// na RECIPIENT. Wdrożenie krok po kroku: patrz CONTACT_FORM_SETUP.md.
// ---------------------------------------------------------------------------

var RECIPIENT = "rezerwacje@alverniaplanet.com";

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var name = (p.name || "").trim() || "(brak)";
    var email = (p.email || "").trim();
    var phone = (p.phone || "").trim() || "(brak)";
    var message = (p.message || "").trim() || "(brak treści)";

    var body =
      "Nowa wiadomość z formularza kontaktowego alverniaplanet.com\n\n" +
      "Imię i nazwisko: " + name + "\n" +
      "E-mail: " + (email || "(brak)") + "\n" +
      "Telefon: " + phone + "\n" +
      "Język: " + (p.locale || "-") + "\n" +
      "Źródło: " + (p.source || "-") + "\n\n" +
      "Treść wiadomości:\n" + message;

    MailApp.sendEmail({
      to: RECIPIENT,
      subject: "Formularz kontaktowy: " + name,
      body: body,
      replyTo: email.indexOf("@") > -1 ? email : RECIPIENT,
      name: "Alvernia Planet — formularz kontaktowy",
    });

    return ContentService.createTextOutput("OK");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err);
  }
}

// Szybki test w przeglądarce (wejście na URL /exec) — potwierdza, że web app żyje.
function doGet() {
  return ContentService.createTextOutput("Alvernia Planet contact endpoint OK");
}
