const handleFaceDetect = (req, res) => {
    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key a455bde74c14465d9cb8b10eb84fa4f7")
    let url = req.body.Url;
    //This is clarifai call API function
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model.
            model_id: "face-detection",
            inputs: [{ data: { image: { url: url } } }]
        },
        metadata,
        (err, response) => {
            try {
                if (err) {
                    res.status(502).send("Cannot connect to clarifai " + err);
                } else if (response.status.code !== 10000) {
                    res.status(500).send("Clafirai is not responding " + response.status.description + "\n" + response.status.details);
                } else {
                    res.status(200).json(response.outputs[0].data.regions.map(values=> values.region_info.bounding_box));
                }
            } catch {
                res.status(504).send("No Face Detected")
            }

        }
    );
}


module.exports = {
    handleFaceDetect
}