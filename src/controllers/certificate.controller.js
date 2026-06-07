import PDFDocument from "pdfkit";
import SkillRequest from "../models/SkillRequest.js";

export const generateCertificate = async (req, res) => {
  try {
    const request = await SkillRequest.findById(
      req.params.requestId
    )
      .populate("requester", "name")
      .populate("provider", "name")
      .populate("skill", "title");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.status !== "Completed") {
      return res.status(400).json({
        message:
          "Certificate available only for completed courses",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate.pdf`
    );

    doc.pipe(res);

    // Border
    doc.rect(30, 30, 550, 730).stroke();

    doc.moveDown(3);

    doc
      .fontSize(28)
      .text("CERTIFICATE OF COMPLETION", {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(18)
      .text("This certificate is proudly presented to", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(24)
      .text(request.requester.name, {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(18)
      .text(
        `For successfully completing the skill`,
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(22)
      .text(request.skill.title, {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(16)
      .text(
        `Provided by ${request.provider.name}`,
        {
          align: "center",
        }
      );

    doc.moveDown(4);

    doc
      .fontSize(14)
      .text(
        `Issued on ${new Date().toLocaleDateString()}`,
        {
          align: "center",
        }
      );

    doc.moveDown(3);

    doc
      .fontSize(20)
      .text("SkillBarter Platform", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Certificate generation failed",
    });
  }
};