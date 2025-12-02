// routes/medicines.js
router.get("/:id/barcode", authMiddleware, async (req, res) => {
  const med = await Medicine.findByPk(req.params.id);
  if (!med) return res.status(404).send("Not found");
  const png = await generateBarcodePng(med.barcode);
  res.set("Content-Type", "image/png");
  res.send(png);
});
