
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const datos = JSON.parse(e.postData.contents);

    const nombre = String(datos.nombre || "").trim();
    const asiste = String(datos.asiste || "").toLowerCase();

    if (!nombre || !["si", "no"].includes(asiste)) {
      throw new Error("Datos de confirmación inválidos");
    }

    const hoja = SpreadsheetApp
      .openById("1kfbVz0Leu29O6gIq5Psx1sB0O98boNEO84xo6FDYHvo")
      .getSheets()[0];

    hoja.appendRow([
      nombre,
      asiste === "si" ? "SI" : "NO",
      new Date()
    ]);

    return ContentService
      .createTextOutput(
        JSON.stringify({ ok: true })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error(error);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          ok: false,
          error: String(error.message)
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

