module.exports = (app, db) => {
    return {
        get: async (_, res) => {
            db.model('processing').find({ isProcessed: false }, (err, processings) => {
                if (err) return res.status(500).send(err);
                if (!processings.length) return res.status(404).send("No documents found");
                const rand = Math.floor(Math.random() * processings.length);
                const processing = processings[rand];
                db.model('data').findById(processing._id, (err, data) => {
                    if (err) return res.status(500).send(err);
                    if (!data) return res.status(404).send("No document found");
                    res.status(200).send({ processing, data });
                });
            });
        },
        patch: async (req, res) => {
            const { id } = req.params;
            db.model("processing").findByIdAndUpdate(
                id,
                { 
                    isProcessed: true,
                    processedAt: new Date()
                },
                { new: true },
                (err, doc) => {
                    if (err) return res.status(500).send(err);
                    if (!doc) return res.status(404).send("No document found");
                    res.status(200).send(doc);
                }
            );
        },
        delete: async (req, res) => {
            const { id } = req.params;
            db.model("processing").findByIdAndRemove(
                id,
                (err, doc) => {
                    if (err) return res.status(500).send(err);
                    if (!doc) return res.status(404).send("No document found");
                    res.status(200).send(doc);
                }
            );
        }
    }
}