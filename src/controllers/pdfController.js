const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

dotenv.config();

const generatePDF = async (req, res) => {
  try {
    const name = req.query.name || "resume";
    const token = req.headers.authorization?.replace("jwt ", "");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // ✅ Enable request interception
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      // Continue all requests as-is
      request.continue();
    });

    // ✅ Set localStorage before DOM loads
    page.on("domcontentloaded", async () => {
      await page.evaluate((token) => {
        localStorage.setItem("token", token);
      }, token);
    });

    const targetURL = `${process.env.FRONTEND_URL}/${name}`;
    console.log("Navigating to:", targetURL);

    await page.goto(targetURL, { waitUntil: "networkidle0" });

    // ✅ Wait for resume content to appear
    // await page.waitForSelector("#profile-content-loaded", { timeout: 10000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};


module.exports = { generatePDF };
